"use server";

import { redirect } from "next/navigation";
import { refresh, updateTag } from "next/cache";
import { guarded } from "@/server/auth/guard";
import { audit } from "@/server/audit";
import { TAGS } from "@/server/content/tags";
import { POST_STATUS_LABELS, deleteCategory, deletePost, readPostForm, saveCategory, savePost } from "@/server/admin/blog";
import { formText, idField } from "@/server/admin/validation";

const statusNote = (saved) => (saved.wasStatus && saved.wasStatus !== saved.status ? ` → ${POST_STATUS_LABELS[saved.status]}` : "");

export async function createPostAction(_state, formData) {
  const result = await guarded("blog.write", async (user) => {
    const saved = await savePost(user, null, readPostForm(formData));
    await audit(user, "blog.create", { type: "post", id: saved.id, summary: `كتب المقال «${saved.title}» (${POST_STATUS_LABELS[saved.status]})` });
    if (saved.status === "published") updateTag(TAGS.posts);
    return { ok: true, id: saved.id };
  });
  if (result.ok) redirect(`/admin/blog/${result.id}/`);
  return result;
}

export async function updatePostAction(id, _state, formData) {
  return guarded("blog.write", async (user) => {
    const saved = await savePost(user, id, readPostForm(formData));
    await audit(user, saved.status === "published" && saved.wasStatus !== "published" ? "blog.publish" : "blog.update", {
      type: "post",
      id,
      summary: `عدّل المقال «${saved.title}»${statusNote(saved)}`,
    });
    updateTag(TAGS.posts);
    return { ok: true, message: saved.status === "published" ? "حُفظ المقال وهو منشور." : `حُفظ المقال (${POST_STATUS_LABELS[saved.status]}).` };
  });
}

export async function deletePostAction(_state, formData) {
  const result = await guarded("blog.view", async (user) => {
    const post = await deletePost(user, idField.parse(formData.get("id")));
    await audit(user, "blog.delete", { type: "post", id: post.id, summary: `حذف المقال «${post.title}»` });
    updateTag(TAGS.posts);
    return { ok: true };
  });
  if (result.ok) redirect("/admin/blog/");
  return result;
}

export async function saveCategoryAction(_state, formData) {
  return guarded("blog.categories", async (user) => {
    const rawId = formText(formData, "id");
    const id = rawId ? idField.parse(rawId) : null;
    const saved = await saveCategory(id, { name: formText(formData, "name"), slug: formText(formData, "slug") });
    await audit(user, id ? "blog.category_update" : "blog.category_create", { type: "post_category", id: saved.id, summary: `تصنيف «${saved.name}»` });
    updateTag(TAGS.posts);
    refresh();
    return { ok: true, message: id ? "حُفظ التصنيف." : "أُضيف التصنيف." };
  });
}

export async function deleteCategoryAction(_state, formData) {
  return guarded("blog.categories", async (user) => {
    const category = await deleteCategory(idField.parse(formData.get("id")));
    await audit(user, "blog.category_delete", { type: "post_category", id: category.id, summary: `حذف التصنيف «${category.name}»` });
    updateTag(TAGS.posts);
    refresh();
    return { ok: true, message: "حُذف التصنيف." };
  });
}
