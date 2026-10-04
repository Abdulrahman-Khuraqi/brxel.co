import Link from "next/link";
import { ShieldPlus } from "lucide-react";
import { Badge, ButtonLink, PageHead } from "@/components/admin/ui";
import { requirePermission } from "@/server/auth/guard";
import { listRoles } from "@/server/admin/team";
import { ALL_PERMISSIONS, PERMISSION_GROUPS } from "@/server/auth/permissions";

export const metadata = { title: "الأدوار والصلاحيات" };

export default async function RolesPage() {
  await requirePermission("roles.manage");
  const roles = await listRoles();

  return (
    <div className="grid gap-6">
      <PageHead
        title="الأدوار والصلاحيات"
        description="الدور مجموعة صلاحيات. أسنده للمستخدمين من صفحة المستخدمين."
        actions={
          <ButtonLink href="/admin/roles/new/">
            <ShieldPlus className="h-4 w-4" aria-hidden="true" />
            دور جديد
          </ButtonLink>
        }
      />
      <ul className="grid gap-4 md:grid-cols-2">
        {roles.map((role) => {
          const held = role.isOwner ? ALL_PERMISSIONS : role.permissions;
          return (
            <li key={role.id}>
              <Link href={`/admin/roles/${role.id}/`} className="block h-full rounded-2xl border border-hairline bg-surface p-5 transition hover:border-hairline-strong">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-base font-bold text-ice">{role.name}</p>
                  <span className="flex gap-2">
                    {role.isOwner ? <Badge tone="gold">ثابت</Badge> : null}
                    <Badge>{role.users} مستخدم</Badge>
                  </span>
                </div>
                {role.description ? <p className="mt-1 text-sm leading-6 text-ice-muted">{role.description}</p> : null}
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {PERMISSION_GROUPS.map((group) => {
                    const count = group.permissions.filter((permission) => held.includes(permission.key)).length;
                    return (
                      <li key={group.key}>
                        <Badge tone={count === 0 ? "grey" : count === group.permissions.length ? "green" : "gold"}>
                          {group.label}: <span className="latin ms-1">{count}/{group.permissions.length}</span>
                        </Badge>
                      </li>
                    );
                  })}
                </ul>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
