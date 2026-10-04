import { notFound } from "next/navigation";
import { PageHead } from "@/components/admin/ui";
import ConfirmAction from "@/components/admin/ConfirmAction";
import { requirePermission } from "@/server/auth/guard";
import { getRole } from "@/server/admin/team";
import { ALL_PERMISSIONS, PERMISSION_GROUPS } from "@/server/auth/permissions";
import { idField } from "@/server/admin/validation";
import RoleForm from "../RoleForm";
import { deleteRoleAction, updateRoleAction } from "../actions";

export const metadata = { title: "تعديل دور" };

export default async function EditRolePage({ params }) {
  const actor = await requirePermission("roles.manage");
  const parsed = idField.safeParse((await params).id);
  if (!parsed.success) notFound();
  const role = await getRole(parsed.data);
  if (!role) notFound();

  const grantable = actor.role.isOwner ? ALL_PERMISSIONS : ALL_PERMISSIONS.filter((key) => actor.permissions.has(key));
  const ownRole = actor.role.id === role.id;
  const readOnly = role.isOwner || ownRole;

  return (
    <div className="grid gap-6">
      <PageHead
        title={role.name}
        description={role.isOwner ? "دور المالك يملك كل الصلاحيات ولا يمكن تعديله." : ownRole ? "هذا دورك؛ لا يمكنك تعديله بنفسك." : role.description}
        back={{ href: "/admin/roles/", label: "الأدوار" }}
        actions={
          readOnly ? null : (
            <ConfirmAction
              action={deleteRoleAction}
              fields={{ id: role.id }}
              label="حذف الدور"
              title={`حذف الدور «${role.name}»؟`}
              message="لا يمكن حذف دور مسند لمستخدمين؛ انقلهم إلى دور آخر أولًا."
              confirmLabel="حذف"
            />
          )
        }
      />
      <RoleForm
        action={updateRoleAction.bind(null, role.id)}
        role={role.isOwner ? { ...role, permissions: ALL_PERMISSIONS } : role}
        groups={PERMISSION_GROUPS}
        grantable={grantable}
        readOnly={readOnly}
      />
    </div>
  );
}
