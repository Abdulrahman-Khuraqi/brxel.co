"use server";

import { redirect } from "next/navigation";
import { guarded } from "@/server/auth/guard";
import { audit } from "@/server/audit";
import { deleteRole, saveRole } from "@/server/admin/team";
import { formText, idField } from "@/server/admin/validation";

const readRole = (formData) => ({
  name: formText(formData, "name"),
  description: formText(formData, "description"),
  permissions: formData.getAll("permissions").map(String),
});

export async function createRoleAction(_state, formData) {
  const result = await guarded("roles.manage", async (user) => {
    const saved = await saveRole(user, null, readRole(formData));
    await audit(user, "role.create", { type: "role", id: saved.id, summary: `أنشأ الدور «${saved.name}» (${saved.permissions.length} صلاحية)` });
    return { ok: true };
  });
  if (result.ok) redirect("/admin/roles/");
  return result;
}

export async function updateRoleAction(id, _state, formData) {
  return guarded("roles.manage", async (user) => {
    const saved = await saveRole(user, id, readRole(formData));
    await audit(user, "role.update", { type: "role", id, summary: `عدّل الدور «${saved.name}» (${saved.permissions.length} صلاحية)` });
    return { ok: true, message: "حُفظ الدور. يطبَّق على أصحابه فورًا." };
  });
}

export async function deleteRoleAction(_state, formData) {
  const result = await guarded("roles.manage", async (user) => {
    const role = await deleteRole(user, idField.parse(formData.get("id")));
    await audit(user, "role.delete", { type: "role", id: role.id, summary: `حذف الدور «${role.name}»` });
    return { ok: true };
  });
  if (result.ok) redirect("/admin/roles/");
  return result;
}
