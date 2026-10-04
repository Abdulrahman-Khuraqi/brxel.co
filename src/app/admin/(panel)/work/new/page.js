import { PageHead } from "@/components/admin/ui";
import { can, requirePermission } from "@/server/auth/guard";
import ProjectForm from "../ProjectForm";
import { createProjectAction } from "../actions";

export const metadata = { title: "إضافة عمل" };

export default async function NewProjectPage() {
  const user = await requirePermission("work.create");
  return (
    <div className="grid gap-6">
      <PageHead title="إضافة عمل" back={{ href: "/admin/work/", label: "الأعمال" }} />
      <ProjectForm action={createProjectAction} canPublish={can(user, "work.publish")} />
    </div>
  );
}
