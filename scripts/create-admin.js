/*
 * Creates a dashboard account, or resets a password when you're locked out.
 *
 *   npm run admin:create -- --email you@brxel.co --name "Name"            owner, generated password
 *   npm run admin:create -- --email a@brxel.co --name "A" --role "محرر"   any role by name
 *   npm run admin:create -- --email you@brxel.co --reset                   new password, signs out everywhere
 *
 * Pass --password to choose the password instead of generating one.
 */
import { eq } from "drizzle-orm";
import { getDb, parseArgs, run } from "./lib.js";
import * as schema from "../src/server/db/schema.js";
import { checkPasswordStrength, generatePassword, hashPassword } from "../src/server/auth/password.js";

run(async () => {
  const args = parseArgs();
  const email = String(args.email || "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Pass a valid --email.");

  const db = getDb();
  const password = typeof args.password === "string" ? args.password : generatePassword();
  const [existing] = await db.select().from(schema.users).where(eq(schema.users.email, email));

  if (args.reset) {
    if (!existing) throw new Error(`No account for ${email}.`);
    const weak = checkPasswordStrength(password, { email, name: existing.name });
    if (weak) throw new Error(weak);
    await db
      .update(schema.users)
      .set({ passwordHash: await hashPassword(password), status: "active", passwordChangedAt: new Date() })
      .where(eq(schema.users.id, existing.id));
    await db.delete(schema.sessions).where(eq(schema.sessions.userId, existing.id));
    await db.insert(schema.auditLogs).values({
      action: "user.password_reset_cli",
      entityType: "user",
      entityId: String(existing.id),
      summary: `Password reset from the command line for ${email}`,
    });
    console.log(`✔ Password reset for ${email}\n  New password: ${password}`);
    return;
  }

  if (existing) throw new Error(`${email} already has an account. Use --reset to set a new password.`);
  const name = String(args.name || "").trim();
  if (!name) throw new Error("Pass --name.");

  const weak = checkPasswordStrength(password, { email, name });
  if (weak) throw new Error(weak);

  const roleName = typeof args.role === "string" ? args.role : null;
  const [role] = roleName
    ? await db.select().from(schema.roles).where(eq(schema.roles.name, roleName))
    : await db.select().from(schema.roles).where(eq(schema.roles.isOwner, true));
  if (!role) throw new Error(roleName ? `No role named "${roleName}".` : "Run npm run db:seed first to create the roles.");

  const [{ id }] = await db
    .insert(schema.users)
    .values({ email, name, passwordHash: await hashPassword(password), roleId: role.id, passwordChangedAt: new Date() })
    .$returningId();
  await db.insert(schema.auditLogs).values({
    action: "user.create_cli",
    entityType: "user",
    entityId: String(id),
    summary: `${email} created from the command line as ${role.name}`,
  });
  console.log(`✔ ${email} created as ${role.name}\n  Password: ${password}\n  Sign in at /admin/login and change it from "حسابي".`);
});
