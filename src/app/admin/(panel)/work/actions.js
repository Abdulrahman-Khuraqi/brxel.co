"use server";

import { redirect } from "next/navigation";
import { updateTag } from "next/cache";
import { guarded } from "@/server/auth/guard";
import { audit } from "@/server/audit";
import { TAGS } from "@/server/content/tags";
import { deleteProject, readProjectForm, saveProject, setProjectStatus } from "@/server/admin/work";
import { idField } from "@/server/admin/validation";

export async function createProjectAction(_state, formData) {
  const result = await guarded("work.create", async (user) => {
    const saved = await saveProject(user, null, readProjectForm(formData));
    await audit(user, "work.create", { type: "project", id: saved.id, summary: `أضاف العمل «${saved.title}»` });
    if (saved.status === "published") updateTag(TAGS.portfolio);
    return { ok: true, id: saved.id };
  });
  if (result.ok) redirect(`/admin/work/${result.id}/?created=1`);
  return result;
}

export async function updateProjectAction(id, _state, formData) {
  return guarded("work.edit", async (user) => {
    const saved = await saveProject(user, id, readProjectForm(formData));
    const changed = saved.wasStatus !== saved.status ? ` (${saved.status === "published" ? "نشر" : "إخفاء"})` : "";
    await audit(user, "work.update", { type: "project", id, summary: `عدّل العمل «${saved.title}»${changed}` });
    updateTag(TAGS.portfolio);
    return { ok: true, message: "حُفظت التغييرات." };
  });
}

export async function setProjectStatusAction(_state, formData) {
  return guarded("work.publish", async (user) => {
    const id = idField.parse(formData.get("id"));
    const status = String(formData.get("status"));
    const project = await setProjectStatus(user, id, status);
    await audit(user, status === "published" ? "work.publish" : "work.unpublish", {
      type: "project",
      id,
      summary: `${status === "published" ? "نشر" : "أخفى"} العمل «${project.title}»`,
    });
    updateTag(TAGS.portfolio);
    return { ok: true, message: status === "published" ? "نُشر العمل." : "أصبح العمل مسودة." };
  });
}

export async function deleteProjectAction(_state, formData) {
  const result = await guarded("work.delete", async (user) => {
    const project = await deleteProject(idField.parse(formData.get("id")));
    await audit(user, "work.delete", { type: "project", id: project.id, summary: `حذف العمل «${project.title}»` });
    updateTag(TAGS.portfolio);
    return { ok: true };
  });
  if (result.ok) redirect("/admin/work/?deleted=1");
  return result;
}
