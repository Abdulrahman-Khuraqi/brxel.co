import AdminShell from "@/components/admin/AdminShell";
import { can, requireUser } from "@/server/auth/guard";
import { signOutAction } from "@/app/admin/actions";

const NAV = [
  { href: "/admin/", label: "نظرة عامة", icon: "Gauge", section: "عام" },
  { href: "/admin/work/", label: "الأعمال", icon: "FolderKanban", section: "المحتوى", permission: "work.view" },
  { href: "/admin/blog/", label: "المقالات", icon: "BookOpen", section: "المحتوى", permission: "blog.view" },
  { href: "/admin/blog/categories/", label: "تصنيفات المدونة", icon: "Tags", section: "المحتوى", permission: "blog.categories" },
  { href: "/admin/media/", label: "مكتبة الوسائط", icon: "Images", section: "المحتوى", permission: "media.upload" },
  { href: "/admin/settings/", label: "أرقام الموقع", icon: "Settings2", section: "الموقع", permission: "settings.edit" },
  { href: "/admin/users/", label: "المستخدمون", icon: "Users", section: "الفريق", permission: "users.view" },
  { href: "/admin/roles/", label: "الأدوار والصلاحيات", icon: "ShieldCheck", section: "الفريق", permission: "roles.manage" },
  { href: "/admin/activity/", label: "سجل النشاط", icon: "Activity", section: "الفريق", permission: "audit.view" },
  { href: "/admin/account/", label: "حسابي", icon: "UserRound", section: "حسابي" },
];

/** Every dashboard page sits inside this shell; the menu shows only what the user may open. */
export default async function PanelLayout({ children }) {
  const user = await requireUser();
  const nav = NAV.filter((item) => !item.permission || can(user, item.permission)).map(({ permission: _permission, ...item }) => item);

  return (
    <AdminShell user={{ name: user.name, roleName: user.role.name }} nav={nav} signOut={signOutAction}>
      {children}
    </AdminShell>
  );
}
