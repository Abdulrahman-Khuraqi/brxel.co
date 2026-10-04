import { PageHead } from "@/components/admin/ui";
import { requirePermission } from "@/server/auth/guard";
import { ALL_PERMISSIONS, PERMISSION_GROUPS } from "@/server/auth/permissions";
import RoleForm from "../RoleForm";
import { createRoleAction } from "../actions";

export const metadata = { title: "دور جديد" };

export default async function NewRolePage() {
  const actor = await requirePermission("roles.manage");
  const grantable = actor.role.isOwner ? ALL_PERMISSIONS : ALL_PERMISSIONS.filter((key) => actor.permissions.has(key));
  return (
    <div className="grid gap-6">
      <PageHead title="دور جديد" back={{ href: "/admin/roles/", label: "الأدوار" }} />
      <RoleForm action={createRoleAction} groups={PERMISSION_GROUPS} grantable={grantable} />
    </div>
  );
}
