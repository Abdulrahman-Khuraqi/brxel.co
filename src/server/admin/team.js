import "server-only";
import { z } from "zod";
import { and, asc, count, desc, eq, inArray, ne } from "drizzle-orm";
import { getDb, schema } from "@/server/db/client";
import { ActionError, parseInput } from "@/server/auth/guard";
import { normalizePermissions } from "@/server/auth/permissions";
import { checkPasswordStrength, generatePassword, hashPassword, verifyPassword } from "@/server/auth/password";
import { destroyUserSessions } from "@/server/auth/session";
import { text } from "@/server/admin/validation";

/*
 * Team rules, enforced here whatever the screens allow:
 *   - nobody can hand out access they don't hold themselves (no privilege escalation);
 *   - only an owner can create, change or remove an owner;
 *   - nobody can change their own role or disable themselves;
 *   - there is always at least one active owner.
 */

const emailField = z.string().trim().toLowerCase().max(191).email("بريد إلكتروني غير صالح.");

async function rolePermissionKeys(roleId) {
  const rows = await getDb()
    .select({ permission: schema.rolePermissions.permission })
    .from(schema.rolePermissions)
    .where(eq(schema.rolePermissions.roleId, roleId));
  return rows.map((row) => row.permission);
}

async function getRoleRow(roleId) {
  const [role] = await getDb().select().from(schema.roles).where(eq(schema.roles.id, roleId));
  return role || null;
}

/** Throws unless `actor` already holds everything in `role`. */
async function assertCanGrantRole(actor, role) {
  if (!role) throw new ActionError("راجع الحقول المظلّلة.", { roleId: "اختر دورًا صالحًا." });
  if (actor.role.isOwner) return;
  if (role.isOwner) throw new ActionError("منح دور المالك متاح للمالك فقط.");
  const missing = (await rolePermissionKeys(role.id)).filter((key) => !actor.permissions.has(key));
  if (missing.length) throw new ActionError("لا يمكنك منح دور يملك صلاحيات ليست لديك.");
}

async function activeOwnerCount(exceptUserId) {
  const [{ total }] = await getDb()
    .select({ total: count() })
    .from(schema.users)
    .innerJoin(schema.roles, eq(schema.roles.id, schema.users.roleId))
    .where(and(eq(schema.roles.isOwner, true), eq(schema.users.status, "active"), ne(schema.users.id, exceptUserId)));
  return total;
}

/** Loads the target user and checks the actor may manage them at all. */
async function manageableUser(actor, userId) {
  const user = await getUser(userId);
  if (!user) throw new ActionError("المستخدم غير موجود.");
  if (user.isOwner && !actor.role.isOwner) throw new ActionError("إدارة حساب المالك متاحة للمالك فقط.");
  return user;
}

/* ───────── Users ───────── */

export async function listUsers() {
  return getDb()
    .select({
      id: schema.users.id,
      name: schema.users.name,
      email: schema.users.email,
      status: schema.users.status,
      lastLoginAt: schema.users.lastLoginAt,
      createdAt: schema.users.createdAt,
      roleId: schema.roles.id,
      roleName: schema.roles.name,
      isOwner: schema.roles.isOwner,
    })
    .from(schema.users)
    .innerJoin(schema.roles, eq(schema.roles.id, schema.users.roleId))
    .orderBy(desc(schema.roles.isOwner), asc(schema.users.name));
}

export async function getUser(id) {
  const [user] = await getDb()
    .select({
      id: schema.users.id,
      name: schema.users.name,
      email: schema.users.email,
      status: schema.users.status,
      lastLoginAt: schema.users.lastLoginAt,
      createdAt: schema.users.createdAt,
      roleId: schema.users.roleId,
      roleName: schema.roles.name,
      isOwner: schema.roles.isOwner,
    })
    .from(schema.users)
    .innerJoin(schema.roles, eq(schema.roles.id, schema.users.roleId))
    .where(eq(schema.users.id, id));
  return user || null;
}

const newUserSchema = z.object({
  name: text(120, "اكتب الاسم."),
  email: emailField,
  roleId: z.coerce.number().int().positive("اختر الدور."),
});

/** Creates an account with a generated password, returned once so it can be handed over. */
export async function createUser(actor, input) {
  const data = parseInput(newUserSchema, input);
  await assertCanGrantRole(actor, await getRoleRow(data.roleId));

  const [taken] = await getDb().select({ id: schema.users.id }).from(schema.users).where(eq(schema.users.email, data.email));
  if (taken) throw new ActionError("راجع الحقول المظلّلة.", { email: "يوجد حساب بهذا البريد." });

  const password = generatePassword();
  const [{ id }] = await getDb()
    .insert(schema.users)
    .values({ ...data, passwordHash: await hashPassword(password), passwordChangedAt: null })
    .$returningId();
  return { id, password, ...data };
}

const updateUserSchema = z.object({
  name: text(120, "اكتب الاسم."),
  email: emailField,
  roleId: z.coerce.number().int().positive("اختر الدور."),
  status: z.enum(["active", "disabled"]),
});

export async function updateUser(actor, userId, input) {
  const data = parseInput(updateUserSchema, input);
  const user = await manageableUser(actor, userId);
  const self = actor.id === userId;

  if (self && data.roleId !== user.roleId) throw new ActionError("لا يمكنك تغيير دورك بنفسك.");
  if (self && data.status !== "active") throw new ActionError("لا يمكنك تعطيل حسابك بنفسك.");

  const role = await getRoleRow(data.roleId);
  if (data.roleId !== user.roleId) await assertCanGrantRole(actor, role);

  const losesOwner = user.isOwner && (!role?.isOwner || data.status !== "active");
  if (losesOwner && (await activeOwnerCount(userId)) === 0) throw new ActionError("يجب أن يبقى مالك نشط واحد على الأقل.");

  const [taken] = await getDb()
    .select({ id: schema.users.id })
    .from(schema.users)
    .where(and(eq(schema.users.email, data.email), ne(schema.users.id, userId)));
  if (taken) throw new ActionError("راجع الحقول المظلّلة.", { email: "يوجد حساب آخر بهذا البريد." });

  await getDb().update(schema.users).set(data).where(eq(schema.users.id, userId));
  // A disabled account, or one whose access changed, starts over with a fresh sign-in.
  if (data.status !== "active" || data.roleId !== user.roleId) await destroyUserSessions(userId);
  return { before: user, after: { ...data, roleName: role?.name } };
}

export async function resetUserPassword(actor, userId) {
  const user = await manageableUser(actor, userId);
  if (actor.id === userId) throw new ActionError("غيّر كلمة مرورك من صفحة حسابي.");
  const password = generatePassword();
  await getDb()
    .update(schema.users)
    .set({ passwordHash: await hashPassword(password), passwordChangedAt: null })
    .where(eq(schema.users.id, userId));
  await destroyUserSessions(userId);
  return { user, password };
}

export async function deleteUser(actor, userId) {
  const user = await manageableUser(actor, userId);
  if (actor.id === userId) throw new ActionError("لا يمكنك حذف حسابك بنفسك.");
  if (user.isOwner && (await activeOwnerCount(userId)) === 0) throw new ActionError("يجب أن يبقى مالك نشط واحد على الأقل.");
  // Their posts and work stay; authorship becomes empty (ON DELETE SET NULL).
  await getDb().delete(schema.users).where(eq(schema.users.id, userId));
  return user;
}

/* ───────── The signed-in user's own account ───────── */

export async function updateOwnProfile(actor, input) {
  const data = parseInput(z.object({ name: text(120, "اكتب الاسم.") }), input);
  await getDb().update(schema.users).set(data).where(eq(schema.users.id, actor.id));
  return data;
}

export async function changeOwnPassword(actor, { current, next, confirm }) {
  const [row] = await getDb().select().from(schema.users).where(eq(schema.users.id, actor.id));
  if (!(await verifyPassword(String(current || ""), row.passwordHash))) {
    throw new ActionError("راجع الحقول المظلّلة.", { current: "كلمة المرور الحالية غير صحيحة." });
  }
  const weak = checkPasswordStrength(String(next || ""), { email: actor.email, name: actor.name });
  if (weak) throw new ActionError("راجع الحقول المظلّلة.", { next: weak });
  if (next !== confirm) throw new ActionError("راجع الحقول المظلّلة.", { confirm: "التأكيد لا يطابق كلمة المرور الجديدة." });
  await getDb()
    .update(schema.users)
    .set({ passwordHash: await hashPassword(next), passwordChangedAt: new Date() })
    .where(eq(schema.users.id, actor.id));
  await destroyUserSessions(actor.id, actor.sessionId);
}

/* ───────── Roles ───────── */

export async function listRoles() {
  const db = getDb();
  const roles = await db
    .select({
      id: schema.roles.id,
      name: schema.roles.name,
      description: schema.roles.description,
      isOwner: schema.roles.isOwner,
      users: count(schema.users.id),
    })
    .from(schema.roles)
    .leftJoin(schema.users, eq(schema.users.roleId, schema.roles.id))
    .groupBy(schema.roles.id)
    .orderBy(desc(schema.roles.isOwner), asc(schema.roles.id));
  const permissions = roles.length
    ? await db.select().from(schema.rolePermissions).where(inArray(schema.rolePermissions.roleId, roles.map((role) => role.id)))
    : [];
  return roles.map((role) => ({
    ...role,
    permissions: permissions.filter((row) => row.roleId === role.id).map((row) => row.permission),
  }));
}

export async function getRole(id) {
  const role = await getRoleRow(id);
  return role ? { ...role, permissions: await rolePermissionKeys(id) } : null;
}

const roleSchema = z.object({
  name: text(64, "اكتب اسم الدور."),
  description: z.string().trim().max(255),
  permissions: z.array(z.string()),
});

export async function saveRole(actor, id, input) {
  const data = parseInput(roleSchema, input);
  const permissions = normalizePermissions(data.permissions);
  if (!actor.role.isOwner && permissions.some((key) => !actor.permissions.has(key))) {
    throw new ActionError("لا يمكنك منح صلاحيات ليست لديك.");
  }

  const existing = id ? await getRoleRow(id) : null;
  if (id && !existing) throw new ActionError("الدور غير موجود.");
  if (existing?.isOwner) throw new ActionError("دور المالك ثابت ولا يمكن تعديله.");
  if (id && actor.role.id === id) throw new ActionError("لا يمكنك تعديل الدور الذي تحمله.");

  const condition = id ? and(eq(schema.roles.name, data.name), ne(schema.roles.id, id)) : eq(schema.roles.name, data.name);
  const [taken] = await getDb().select({ id: schema.roles.id }).from(schema.roles).where(condition);
  if (taken) throw new ActionError("راجع الحقول المظلّلة.", { name: "يوجد دور بهذا الاسم." });

  return getDb().transaction(async (tx) => {
    let roleId = id;
    if (id) {
      await tx.update(schema.roles).set({ name: data.name, description: data.description }).where(eq(schema.roles.id, id));
      await tx.delete(schema.rolePermissions).where(eq(schema.rolePermissions.roleId, id));
    } else {
      [{ id: roleId }] = await tx.insert(schema.roles).values({ name: data.name, description: data.description }).$returningId();
    }
    if (permissions.length) {
      await tx.insert(schema.rolePermissions).values(permissions.map((permission) => ({ roleId, permission })));
    }
    return { id: roleId, name: data.name, permissions };
  });
}

export async function deleteRole(actor, id) {
  const role = await getRoleRow(id);
  if (!role) throw new ActionError("الدور غير موجود.");
  if (role.isOwner) throw new ActionError("دور المالك ثابت ولا يمكن حذفه.");
  const [{ total }] = await getDb().select({ total: count() }).from(schema.users).where(eq(schema.users.roleId, id));
  if (total) throw new ActionError(`هذا الدور مسند إلى ${total} مستخدم. انقلهم إلى دور آخر أولًا.`);
  if (!actor.role.isOwner && (await rolePermissionKeys(id)).some((key) => !actor.permissions.has(key))) {
    throw new ActionError("لا يمكنك حذف دور يملك صلاحيات ليست لديك.");
  }
  await getDb().delete(schema.roles).where(eq(schema.roles.id, id));
  return role;
}
