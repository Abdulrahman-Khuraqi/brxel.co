import "server-only";
import { z } from "zod";
import { count, desc, eq, like, or } from "drizzle-orm";
import { getDb, schema } from "@/server/db/client";
import { ActionError, parseInput } from "@/server/auth/guard";
import { publicUrl, removeImageFile } from "@/server/media";
import { optionalText } from "@/server/admin/validation";

export const MEDIA_PAGE_SIZE = 48;

export async function listMedia({ page = 1 } = {}) {
  const db = getDb();
  const [{ total }] = await db.select({ total: count() }).from(schema.media);
  const rows = await db
    .select({ media: schema.media, uploader: schema.users.name })
    .from(schema.media)
    .leftJoin(schema.users, eq(schema.users.id, schema.media.uploadedBy))
    .orderBy(desc(schema.media.createdAt), desc(schema.media.id))
    .limit(MEDIA_PAGE_SIZE)
    .offset((Math.max(1, page) - 1) * MEDIA_PAGE_SIZE);
  return {
    items: rows.map((row) => ({ ...row.media, url: publicUrl(row.media.path), uploader: row.uploader })),
    total,
    pages: Math.max(1, Math.ceil(total / MEDIA_PAGE_SIZE)),
  };
}

/** Where an image is used, so it isn't deleted out from under a live page. */
export async function mediaUsage(url) {
  const db = getDb();
  const [projectsUsing, galleriesUsing, postsUsing] = await Promise.all([
    db.select({ title: schema.projects.title }).from(schema.projects).where(eq(schema.projects.coverImage, url)),
    db
      .select({ title: schema.projects.title })
      .from(schema.projectImages)
      .innerJoin(schema.projects, eq(schema.projects.id, schema.projectImages.projectId))
      .where(eq(schema.projectImages.url, url)),
    db
      .select({ title: schema.posts.title })
      .from(schema.posts)
      .where(or(eq(schema.posts.coverImage, url), like(schema.posts.body, `%${url}%`))),
  ]);
  return [...projectsUsing, ...galleriesUsing, ...postsUsing].map((row) => row.title);
}

export async function deleteMedia(id) {
  const [item] = await getDb().select().from(schema.media).where(eq(schema.media.id, id));
  if (!item) throw new ActionError("الصورة غير موجودة.");
  const usedBy = [...new Set(await mediaUsage(publicUrl(item.path)))];
  if (usedBy.length) {
    throw new ActionError(`الصورة مستخدمة في: ${usedBy.slice(0, 3).join("، ")}${usedBy.length > 3 ? "…" : ""}. أزلها من هناك أولًا.`);
  }
  await getDb().delete(schema.media).where(eq(schema.media.id, id));
  await removeImageFile(item.path);
  return item;
}

export async function updateMediaAlt(id, input) {
  const { alt } = parseInput(z.object({ alt: optionalText(255) }), input);
  await getDb().update(schema.media).set({ alt }).where(eq(schema.media.id, id));
}
