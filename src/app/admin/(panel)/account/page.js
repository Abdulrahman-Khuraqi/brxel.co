import { PageHead } from "@/components/admin/ui";
import { requireUser } from "@/server/auth/guard";
import { PasswordForm, ProfileForm, SessionsForm } from "./AccountForms";
import { changePasswordAction, signOutOthersAction, updateProfileAction } from "./actions";

export const metadata = { title: "حسابي" };

export default async function AccountPage() {
  const user = await requireUser();
  return (
    <div className="grid max-w-3xl gap-6">
      <PageHead title="حسابي" />
      <ProfileForm action={updateProfileAction} name={user.name} email={user.email} roleName={user.role.name} />
      <PasswordForm action={changePasswordAction} email={user.email} />
      <SessionsForm action={signOutOthersAction} />
    </div>
  );
}
