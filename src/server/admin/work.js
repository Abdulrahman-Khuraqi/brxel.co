import "server-only";
import { z } from "zod";
import { and, asc, count, desc, eq, like, ne, or } from "drizzle-orm";
import { getDb, schema } from "@/server/db/client";
import { ActionError, can, parseInput } from "@/server/auth/guard";
import { checkbox, formText, imageUrl, jsonField, optionalHttpsUrl, optionalText, slugField, slugify, text } from "@/server/admin/validation";

export const PAGE_SIZE = 25;

const projectSchema = z.object({
  title: text(191, "اكتب اسم المشروع."),
  titleLatin: optionalText(191),
  slug: slugField(120),
  sector: optionalText(120),
  category: z.enum(schema.PROJECT_CATEGORIES, { error: "اختر التصنيف." }),
  summary: optionalText(2000),
  coverImage: imageUrl,
  link: optionalHttpsUrl,
  featured: z.boolean(),
  sortOrder: z.coerce.number().int().min(-9999).max(9999),
  status: z.enum(schema.PUBLISH_STATUSES),
  gallery: z.array(imageUrl).max(80, "الحد الأقصى 80 صورة في المعرض."),
});

export function readProjectForm(formData) {
  const title = formText(formData, "title");
  const titleLatin = formText(formData, "titleLatin");
  return {
    title,
    titleLatin,
    slug: formText(formData, "slug") || slugify(titleLatin || title),
    sector: formText(formData, "sector"),
    category: formText(formData, "category"),
    summary: formText(formData, "summary"),
    coverImage: formText(formData, "coverImage"),
    link: formText(formData, "link"),
    featured: checkbox(formData, "featured"),
    sortOrder: formText(formData, "sortOrder") || "0",
    status: formText(formData, "status") || "draft",
    gallery: jsonField(formData, "gallery", []),
  };
}

export async function listProjects({ q = "", category = "", status = "", page = 1 } = {}) {
  const filters = [];
  if (q) filters.push(or(like(schema.projects.title, `%${q}%`), like(schema.projects.titleLatin, `%${q}%`), like(schema.projects.slug, `%${q}%`)));
  if (schema.PROJECT_CATEGORIES.includes(category)) filters.push(eq(schema.projects.category, category));
  if (schema.PUBLISH_STATUSES.includes(status)) filters.push(eq(schema.projects.status, status));
  const where = filters.length ? and(...filters) : undefined;

  const db = getDb();
  const [{ total }] = await db.select({ total: count() }).from(schema.projects).where(where);
  const items = await db
    .select()
    .from(schema.projects)
    .where(where)
    .orderBy(desc(schema.projects.updatedAt), desc(schema.projects.id))
    .limit(PAGE_SIZE)
    .offset((Math.max(1, page) - 1) * PAGE_SIZE);
  return { items, total, pages: Math.max(1, Math.ceil(total / PAGE_SIZE)) };
}

export async function getProject(id) {
  const db = getDb();
  const [project] = await db.select().from(schema.projects).where(eq(schema.projects.id, id));
  if (!project) return null;
  const images = await db
    .select()
    .from(schema.projectImages)
    .where(eq(schema.projectImages.projectId, id))
    .orderBy(asc(schema.projectImages.sortOrder), asc(schema.projectImages.id));
  return { ...project, gallery: images.map((image) => image.url) };
}

/** Live work changes only with the publish permission; without it, published projects are read-only. */
export const canEditProject = (user, project) => can(user, "work.edit") && (project.status !== "published" || can(user, "work.publish"));

async function assertSlugFree(slug, exceptId) {
  const condition = exceptId ? and(eq(schema.projects.slug, slug), ne(schema.projects.id, exceptId)) : eq(schema.projects.slug, slug);
  const [taken] = await getDb().select({ id: schema.projects.id }).from(schema.projects).where(condition);
  if (taken) throw new ActionError("راجع الحقول المظلّلة.", { slug: "هذا الرابط مستخدم لمشروع آخر." });
}

async function replaceGallery(tx, projectId, gallery) {
  await tx.delete(schema.projectImages).where(eq(schema.projectImages.projectId, projectId));
  if (gallery.length) {
    await tx.insert(schema.projectImages).values(gallery.map((url, index) => ({ projectId, url, sortOrder: index })));
  }
}

/** Creates (no id) or updates a project. Returns the saved row's id and status. */
export async function saveProject(user, id, input) {
  const data = parseInput(projectSchema, input);
  const existing = id ? await getProject(id) : null;
  if (id && !existing) throw new ActionError("المشروع غير موجود.");
  if (existing && !canEditProject(user, existing)) throw new ActionError("هذا المشروع منشور، وتعديله يحتاج صلاحية النشر.");

  // Without the publish permission, the status stays where it was (new work starts as a draft).
  const status = can(user, "work.publish") ? data.status : existing?.status ?? "draft";
  await assertSlugFree(data.slug, id);

  const values = {
    title: data.title,
    titleLatin: data.titleLatin,
    slug: data.slug,
    sector: data.sector,
    category: data.category,
    summary: data.summary || null,
    coverImage: data.coverImage,
    link: data.link,
    featured: data.featured,
    sortOrder: data.sortOrder,
    status,
    publishedAt: status === "published" ? existing?.publishedAt ?? new Date() : existing?.publishedAt ?? null,
    updatedBy: user.id,
  };

  return getDb().transaction(async (tx) => {
    let projectId = id;
    if (id) {
      await tx.update(schema.projects).set(values).where(eq(schema.projects.id, id));
    } else {
      [{ id: projectId }] = await tx.insert(schema.projects).values({ ...values, createdBy: user.id }).$returningId();
    }
    await replaceGallery(tx, projectId, data.gallery);
    return { id: projectId, status, title: data.title, wasStatus: existing?.status };
  });
}

export async function setProjectStatus(user, id, status) {
  if (!schema.PUBLISH_STATUSES.includes(status)) throw new ActionError("حالة غير معروفة.");
  const project = await getProject(id);
  if (!project) throw new ActionError("المشروع غير موجود.");
  await getDb()
    .update(schema.projects)
    .set({ status, publishedAt: status === "published" ? project.publishedAt ?? new Date() : project.publishedAt, updatedBy: user.id })
    .where(eq(schema.projects.id, id));
  return project;
}

export async function deleteProject(id) {
  const project = await getProject(id);
  if (!project) throw new ActionError("المشروع غير موجود.");
  await getDb().delete(schema.projects).where(eq(schema.projects.id, id));
  return project;
}

export async function projectStats() {
  const rows = await getDb()
    .select({ status: schema.projects.status, total: count() })
    .from(schema.projects)
    .groupBy(schema.projects.status);
  return Object.fromEntries(rows.map((row) => [row.status, row.total]));
}
