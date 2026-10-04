import { notFound, redirect } from "next/navigation";
import { Card, PageHead, formatDateTime } from "@/components/admin/ui";
import ConfirmAction from "@/components/admin/ConfirmAction";
import { requirePermission } from "@/server/auth/guard";
import { getUser } from "@/server/admin/team";
import { idField } from "@/server/admin/validation";
import UserForm from "../UserForm";
import ResetPassword from "../ResetPassword";
import { deleteUserAction, resetPasswordAction, updateUserAction } from "../actions";
import { assignableRoles } from "../roles";

export const metadata = { title: "تعديل مستخدم" };

export default async function EditUserPage({ params }) {
  const actor = await requirePermission("users.manage");
  const parsed = idField.safeParse((await params).id);
  if (!parsed.success) notFound();
  const user = await getUser(parsed.data);
  if (!user) notFound();
  if (user.isOwner && !actor.role.isOwner) redirect("/admin/forbidden/");

  const self = user.id === actor.id;
  let roles = await assignableRoles(actor);
  // Keep the current role selectable even when this admin couldn't grant it.
  if (!roles.some((role) => role.id === user.roleId)) roles = [{ id: user.roleId, name: user.roleName }, ...roles];

  return (
    <div className="grid max-w-3xl gap-6">
      <PageHead
        title={user.name}
        description={`أُنشئ ${formatDateTime(user.createdAt)} · آخر دخول ${user.lastLoginAt ? formatDateTime(user.lastLoginAt) : "—"}`}
        back={{ href: "/admin/users/", label: "المستخدمون" }}
      />
      <UserForm action={updateUserAction.bind(null, user.id)} user={user} roles={roles} self={self} />
      {self ? null : (
        <Card title="الأمان">
          <div className="grid gap-5">
            <ResetPassword action={resetPasswordAction} userId={user.id} email={user.email} />
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-hairline pt-5">
              <p className="text-sm text-ice-muted">الحذف نهائي. مقالاته تبقى بدون كاتب. التعطيل يكفي عادةً.</p>
              <ConfirmAction
                action={deleteUserAction}
                fields={{ id: user.id }}
                label="حذف الحساب"
                title={`حذف حساب ${user.name}؟`}
                message="لن يتمكن من الدخول، ولا يمكن التراجع عن الحذف."
                confirmLabel="حذف نهائيًا"
              />
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
