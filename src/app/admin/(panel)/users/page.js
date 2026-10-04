import Link from "next/link";
import { UserPlus } from "lucide-react";
import { Badge, ButtonLink, PageHead, StatusBadge, Table, Td, formatDateTime } from "@/components/admin/ui";
import { can, requirePermission } from "@/server/auth/guard";
import { listUsers } from "@/server/admin/team";

export const metadata = { title: "المستخدمون" };

export default async function UsersPage() {
  const actor = await requirePermission("users.view");
  const users = await listUsers();
  const manage = can(actor, "users.manage");

  return (
    <div className="grid gap-6">
      <PageHead
        title="المستخدمون"
        description={`${users.length} حساب. لكل مستخدم دور يحدد صلاحياته على الأعمال والمدونة والفريق.`}
        actions={
          manage ? (
            <ButtonLink href="/admin/users/new/">
              <UserPlus className="h-4 w-4" aria-hidden="true" />
              إضافة مستخدم
            </ButtonLink>
          ) : null
        }
      />
      <Table head={["الاسم", "البريد", "الدور", "الحالة", "آخر دخول"]}>
        {users.map((user) => (
          <tr key={user.id} className="hover:bg-surface">
            <Td>
              {manage && (!user.isOwner || actor.role.isOwner) ? (
                <Link href={`/admin/users/${user.id}/`} className="font-semibold text-ice hover:text-brand-bright">
                  {user.name}
                </Link>
              ) : (
                <span className="font-semibold text-ice">{user.name}</span>
              )}
              {user.id === actor.id ? <span className="ms-2 text-xs text-ice-faint">(أنت)</span> : null}
            </Td>
            <Td className="latin text-xs">{user.email}</Td>
            <Td>{user.isOwner ? <Badge tone="gold">{user.roleName}</Badge> : user.roleName}</Td>
            <Td>
              <StatusBadge status={user.status} />
            </Td>
            <Td className="latin text-xs">{user.lastLoginAt ? formatDateTime(user.lastLoginAt) : "لم يدخل بعد"}</Td>
          </tr>
        ))}
      </Table>
    </div>
  );
}
