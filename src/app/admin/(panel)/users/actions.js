"use server";

import { refresh } from "next/cache";
import { redirect } from "next/navigation";
import { guarded } from "@/server/auth/guard";
import { audit } from "@/server/audit";
import { createUser, deleteUser, resetUserPassword, updateUser } from "@/server/admin/team";
import { formText, idField } from "@/server/admin/validation";

export async function createUserAction(_state, formData) {
  return guarded("users.manage", async (user) => {
    const created = await createUser(user, {
      name: formText(formData, "name"),
      email: formText(formData, "email"),
      roleId: formText(formData, "roleId"),
    });
    await audit(user, "user.create", { type: "user", id: created.id, summary: `أضاف المستخدم ${created.email}` });
    return { ok: true, message: "أُنشئ الحساب.", id: created.id, email: created.email, password: created.password };
  });
}

export async function updateUserAction(id, _state, formData) {
  return guarded("users.manage", async (user) => {
    const { before, after } = await updateUser(user, id, {
      name: formText(formData, "name"),
      email: formText(formData, "email"),
      roleId: formText(formData, "roleId"),
      status: formText(formData, "status") || "active",
    });
    const notes = [];
    if (before.roleId !== after.roleId) notes.push(`الدور: ${before.roleName} ← ${after.roleName}`);
    if (before.status !== after.status) notes.push(after.status === "active" ? "فعّل الحساب" : "عطّل الحساب");
    await audit(user, "user.update", { type: "user", id, summary: `عدّل ${after.email}${notes.length ? ` (${notes.join("، ")})` : ""}` });
    refresh();
    return { ok: true, message: "حُفظت التغييرات." };
  });
}

export async function resetPasswordAction(_state, formData) {
  return guarded("users.manage", async (user) => {
    const { user: target, password } = await resetUserPassword(user, idField.parse(formData.get("id")));
    await audit(user, "user.password_reset", { type: "user", id: target.id, summary: `أعاد تعيين كلمة مرور ${target.email}` });
    return { ok: true, message: "أُعيد تعيين كلمة المرور، وخرج المستخدم من كل أجهزته.", password };
  });
}

export async function deleteUserAction(_state, formData) {
  const result = await guarded("users.manage", async (user) => {
    const target = await deleteUser(user, idField.parse(formData.get("id")));
    await audit(user, "user.delete", { type: "user", id: target.id, summary: `حذف المستخدم ${target.email}` });
    return { ok: true };
  });
  if (result.ok) redirect("/admin/users/");
  return result;
}
