import "server-only";
import { z } from "zod";
import { and, asc, count, desc, eq, like, ne, or } from "drizzle-orm";
import { getDb, schema } from "@/server/db/client";
import { ActionError, can, parseInput } from "@/server/auth/guard";
import { formText, imageUrl, optionalText, slugField, slugify, text } from "@/server/admin/validation";

export const PAGE_SIZE = 25;

export const POST_STATUS_LABELS = { draft: "مسودة", review: "بانتظار المراجعة", published: "منشور" };

const postSchema = z.object({
  title: text(191, "اكتب عنوان المقال."),
  slug: slugField(160),
  excerpt: optionalText(400),
  body: z.string().max(200_000, "المقال أطول من الحد المسموح.").refine((value) => value.trim().length > 0, "اكتب نص المقال."),
  coverImage: z.union([z.literal(""), imageUrl]),
  categoryId: z.union([z.literal(""), z.coerce.number().int().positive()]),
  status: z.enum(schema.POST_STATUSES),
  seoTitle: optionalText(191),
  seoDescription: optionalText(320),
  // Sent by the editor as a UTC ISO string (converted from the writer's local time in the browser).
  publishedAt: z.union([z.literal(""), z.string().refine((value) => !Number.isNaN(Date.parse(value)), "تاريخ غير صالح.")]),
});

export function readPostForm(formData) {
  const title = formText(formData, "title");
  return {
    title,
    slug: formText(formData, "slug") || slugify(title),
    excerpt: formText(formData, "excerpt"),
    body: formText(formData, "body"),
    coverImage: formText(formData, "coverImage"),
    categoryId: formText(formData, "categoryId"),
    status: formText(formData, "status") || "draft",
    seoTitle: formText(formData, "seoTitle"),
    seoDescription: formText(formData, "seoDescription"),
    publishedAt: formText(formData, "publishedAt"),
  };
}

/**
 * Who may change a post:
 *   - their own draft or review post: blog.write
 *   - anyone's post: blog.edit_all
 *   - a published post: also blog.publish (otherwise it's read-only, so live text never changes unreviewed)
 */
export function canEditPost(user, post) {
  const ownsIt = post.authorId === user.id;
  if (!(can(user, "blog.edit_all") || (ownsIt && can(user, "blog.write")))) return false;
  return post.status !== "published" || can(user, "blog.publish");
}

/** Statuses this user may set: writers move between draft and review; publishers may publish. */
export const allowedStatuses = (user) => (can(user, "blog.publish") ? schema.POST_STATUSES : ["draft", "review"]);

export async function listPosts(user, { q = "", status = "", mine = false, page = 1 } = {}) {
  const filters = [];
  if (q) filters.push(or(like(schema.posts.title, `%${q}%`), like(schema.posts.slug, `%${q}%`)));
  if (schema.POST_STATUSES.includes(status)) filters.push(eq(schema.posts.status, status));
  // Without blog.edit_all a writer sees their own posts plus what is already public.
  if (mine || !can(user, "blog.edit_all")) {
    filters.push(mine ? eq(schema.posts.authorId, user.id) : or(eq(schema.posts.authorId, user.id), eq(schema.posts.status, "published")));
  }
  const where = filters.length ? and(...filters) : undefined;

  const db = getDb();
  const [{ total }] = await db.select({ total: count() }).from(schema.posts).where(where);
  const items = await db
    .select({
      id: schema.posts.id,
      title: schema.posts.title,
      slug: schema.posts.slug,
      status: schema.posts.status,
      authorId: schema.posts.authorId,
      authorName: schema.users.name,
      categoryName: schema.postCategories.name,
      publishedAt: schema.posts.publishedAt,
      updatedAt: schema.posts.updatedAt,
    })
    .from(schema.posts)
    .leftJoin(schema.users, eq(schema.users.id, schema.posts.authorId))
    .leftJoin(schema.postCategories, eq(schema.postCategories.id, schema.posts.categoryId))
    .where(where)
    .orderBy(desc(schema.posts.updatedAt), desc(schema.posts.id))
    .limit(PAGE_SIZE)
    .offset((Math.max(1, page) - 1) * PAGE_SIZE);
  return { items, total, pages: Math.max(1, Math.ceil(total / PAGE_SIZE)) };
}

export async function getPost(id) {
  const [post] = await getDb()
    .select({ post: schema.posts, authorName: schema.users.name })
    .from(schema.posts)
    .leftJoin(schema.users, eq(schema.users.id, schema.posts.authorId))
    .where(eq(schema.posts.id, id));
  return post ? { ...post.post, authorName: post.authorName } : null;
}

async function assertSlugFree(slug, exceptId) {
  const condition = exceptId ? and(eq(schema.posts.slug, slug), ne(schema.posts.id, exceptId)) : eq(schema.posts.slug, slug);
  const [taken] = await getDb().select({ id: schema.posts.id }).from(schema.posts).where(condition);
  if (taken) throw new ActionError("راجع الحقول المظلّلة.", { slug: "هذا الرابط مستخدم لمقال آخر." });
}

export async function savePost(user, id, input) {
  const data = parseInput(postSchema, input);
  const existing = id ? await getPost(id) : null;
  if (id && !existing) throw new ActionError("المقال غير موجود.");
  if (existing && !canEditPost(user, existing)) throw new ActionError("ليست لديك صلاحية تعديل هذا المقال.");
  if (!allowedStatuses(user).includes(data.status)) throw new ActionError("النشر يحتاج صلاحية النشر. احفظه كمسودة أو أرسله للمراجعة.");

  await assertSlugFree(data.slug, id);
  if (data.categoryId) {
    const [category] = await getDb().select().from(schema.postCategories).where(eq(schema.postCategories.id, data.categoryId));
    if (!category) throw new ActionError("راجع الحقول المظلّلة.", { categoryId: "التصنيف غير موجود." });
  }

  // A chosen date schedules the post; otherwise it goes live now (and keeps its first date after that).
  const chosenDate = data.publishedAt ? new Date(data.publishedAt) : null;
  const publishedAt = data.status === "published" ? chosenDate ?? existing?.publishedAt ?? new Date() : chosenDate ?? existing?.publishedAt ?? null;

  const values = {
    title: data.title,
    slug: data.slug,
    excerpt: data.excerpt,
    body: data.body,
    coverImage: data.coverImage,
    categoryId: data.categoryId || null,
    status: data.status,
    seoTitle: data.seoTitle,
    seoDescription: data.seoDescription,
    publishedAt,
  };

  const db = getDb();
  if (id) {
    await db.update(schema.posts).set(values).where(eq(schema.posts.id, id));
    return { id, title: data.title, status: data.status, wasStatus: existing.status };
  }
  const [{ id: newId }] = await db.insert(schema.posts).values({ ...values, authorId: user.id }).$returningId();
  return { id: newId, title: data.title, status: data.status, wasStatus: null };
}

export async function deletePost(user, id) {
  const post = await getPost(id);
  if (!post) throw new ActionError("المقال غير موجود.");
  const ownDraft = post.authorId === user.id && post.status !== "published" && can(user, "blog.write");
  if (!can(user, "blog.delete") && !ownDraft) throw new ActionError("ليست لديك صلاحية حذف هذا المقال.");
  await getDb().delete(schema.posts).where(eq(schema.posts.id, id));
  return post;
}

export async function postStats(user) {
  const where = can(user, "blog.edit_all") ? undefined : eq(schema.posts.authorId, user.id);
  const rows = await getDb()
    .select({ status: schema.posts.status, total: count() })
    .from(schema.posts)
    .where(where)
    .groupBy(schema.posts.status);
  return Object.fromEntries(rows.map((row) => [row.status, row.total]));
}

/* ───────── Categories ───────── */

const categorySchema = z.object({ name: text(120, "اكتب اسم التصنيف."), slug: slugField(120) });

export async function listCategories() {
  return getDb()
    .select({ id: schema.postCategories.id, name: schema.postCategories.name, slug: schema.postCategories.slug, total: count(schema.posts.id) })
    .from(schema.postCategories)
    .leftJoin(schema.posts, eq(schema.posts.categoryId, schema.postCategories.id))
    .groupBy(schema.postCategories.id)
    .orderBy(asc(schema.postCategories.name));
}

export async function saveCategory(id, input) {
  const data = parseInput(categorySchema, { name: input.name, slug: input.slug || slugify(input.name) });
  const condition = id ? and(eq(schema.postCategories.slug, data.slug), ne(schema.postCategories.id, id)) : eq(schema.postCategories.slug, data.slug);
  const [taken] = await getDb().select().from(schema.postCategories).where(condition);
  if (taken) throw new ActionError("راجع الحقول المظلّلة.", { slug: "هذا الرابط مستخدم لتصنيف آخر." });
  if (id) {
    await getDb().update(schema.postCategories).set(data).where(eq(schema.postCategories.id, id));
    return { id, ...data };
  }
  const [{ id: newId }] = await getDb().insert(schema.postCategories).values(data).$returningId();
  return { id: newId, ...data };
}

export async function deleteCategory(id) {
  const [category] = await getDb().select().from(schema.postCategories).where(eq(schema.postCategories.id, id));
  if (!category) throw new ActionError("التصنيف غير موجود.");
  // Posts in it keep existing, uncategorised (ON DELETE SET NULL).
  await getDb().delete(schema.postCategories).where(eq(schema.postCategories.id, id));
  return category;
}
