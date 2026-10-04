"use server";

import { refresh } from "next/cache";
import { ActionError, can, canAny, guarded } from "@/server/auth/guard";
import { audit } from "@/server/audit";
import { storeImage } from "@/server/media";
import { deleteMedia, listMedia, updateMediaAlt } from "@/server/admin/library";
import { idField } from "@/server/admin/validation";

/** Uploads one or more images (field "files"). Used by the library page and by every image picker. */
export async function uploadImages(_state, formData) {
  return guarded("media.upload", async (user) => {
    const files = formData.getAll("files").filter((file) => typeof file === "object" && file.size > 0);
    if (!files.length) throw new ActionError("اختر صورة واحدة على الأقل.");
    if (files.length > 20) throw new ActionError("ارفع 20 صورة كحد أقصى في المرة الواحدة.");
    const uploaded = [];
    for (const file of files) uploaded.push(await storeImage(file, user));
    await audit(user, "media.upload", { type: "media", id: uploaded[0].id, summary: `رفع ${uploaded.length} صورة` });
    refresh();
    return { ok: true, message: uploaded.length > 1 ? `تم رفع ${uploaded.length} صور.` : "تم رفع الصورة.", uploaded };
  });
}

/** One page of the library, for the "choose from library" picker. */
export async function browseMedia(page = 1) {
  return guarded(null, async (user) => {
    if (!canAny(user, ["media.upload", "work.create", "work.edit", "blog.write"])) throw new ActionError("ليست لديك صلاحية لمكتبة الوسائط.");
    const result = await listMedia({ page: Number(page) || 1 });
    return { ok: true, ...result, items: result.items.map(({ id, url, alt, width, height }) => ({ id, url, alt, width, height })) };
  });
}

export async function removeMedia(_state, formData) {
  return guarded("media.delete", async (user) => {
    const item = await deleteMedia(idField.parse(formData.get("id")));
    await audit(user, "media.delete", { type: "media", id: item.id, summary: `حذف صورة ${item.originalName || item.path}` });
    refresh();
    return { ok: true, message: "حُذفت الصورة." };
  });
}

export async function saveMediaAlt(_state, formData) {
  return guarded(null, async (user) => {
    if (!can(user, "media.upload")) throw new ActionError("ليست لديك صلاحية لهذا الإجراء.");
    await updateMediaAlt(idField.parse(formData.get("id")), { alt: String(formData.get("alt") || "") });
    refresh();
    return { ok: true, message: "حُفظ الوصف." };
  });
}
