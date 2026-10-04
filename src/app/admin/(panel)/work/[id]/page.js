import { notFound } from "next/navigation";
import { Badge, PageHead, formatDateTime } from "@/components/admin/ui";
import ConfirmAction from "@/components/admin/ConfirmAction";
import { can, requirePermission } from "@/server/auth/guard";
import { canEditProject, getProject } from "@/server/admin/work";
import { idField } from "@/server/admin/validation";
import ProjectForm from "../ProjectForm";
import { deleteProjectAction, updateProjectAction } from "../actions";

export const metadata = { title: "تعديل عمل" };

export default async function EditProjectPage({ params }) {
  const user = await requirePermission("work.view");
  const parsed = idField.safeParse((await params).id);
  if (!parsed.success) notFound();
  const project = await getProject(parsed.data);
  if (!project) notFound();

  const editable = canEditProject(user, project);

  return (
    <div className="grid gap-6">
      <PageHead
        title={project.title}
        description={`آخر تعديل ${formatDateTime(project.updatedAt)}`}
        back={{ href: "/admin/work/", label: "الأعمال" }}
        actions={
          can(user, "work.delete") ? (
            <ConfirmAction
              action={deleteProjectAction}
              fields={{ id: project.id }}
              label="حذف"
              title={`حذف «${project.title}»؟`}
              message="سيُحذف العمل ومعرض صوره من الموقع نهائيًا. الصور تبقى في مكتبة الوسائط."
              confirmLabel="حذف نهائيًا"
            />
          ) : null
        }
      />
      {editable ? null : (
        <p className="rounded-xl border border-brand/30 bg-brand/10 px-4 py-3 text-sm text-brand-bright">
          {can(user, "work.edit") ? "هذا العمل منشور؛ تعديله يحتاج صلاحية النشر. " : ""}
          <Badge tone="gold">للعرض فقط</Badge>
        </p>
      )}
      <ProjectForm action={updateProjectAction.bind(null, project.id)} project={project} canPublish={can(user, "work.publish")} readOnly={!editable} />
    </div>
  );
}
