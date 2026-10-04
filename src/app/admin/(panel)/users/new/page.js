import { PageHead } from "@/components/admin/ui";
import { requirePermission } from "@/server/auth/guard";
import UserForm from "../UserForm";
import { createUserAction } from "../actions";
import { assignableRoles } from "../roles";

export const metadata = { title: "إضافة مستخدم" };

export default async function NewUserPage() {
  const actor = await requirePermission("users.manage");
  const roles = await assignableRoles(actor);
  return (
    <div className="grid max-w-3xl gap-6">
      <PageHead
        title="إضافة مستخدم"
        description="ننشئ كلمة مرور مؤقتة قوية تظهر لك مرة واحدة لتسلّمها للمستخدم."
        back={{ href: "/admin/users/", label: "المستخدمون" }}
      />
      <UserForm action={createUserAction} roles={roles} />
    </div>
  );
}
