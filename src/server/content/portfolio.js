import "server-only";
import { unstable_cache } from "next/cache";
import { asc, eq, inArray } from "drizzle-orm";
import { getDb, schema } from "@/server/db/client";
import { arrangePortfolio } from "@/lib/projects";
import { TAGS } from "@/server/content/tags";

/**
 * Published projects with their galleries, cached until the dashboard changes
 * one (tag "portfolio") or an hour passes. Two queries, whatever the size.
 */
const loadPublished = unstable_cache(
  async () => {
    const db = getDb();
    const rows = await db
      .select()
      .from(schema.projects)
      .where(eq(schema.projects.status, "published"))
      .orderBy(asc(schema.projects.sortOrder), asc(schema.projects.id));

    const images = rows.length
      ? await db
          .select()
          .from(schema.projectImages)
          .where(inArray(schema.projectImages.projectId, rows.map((row) => row.id)))
          .orderBy(asc(schema.projectImages.sortOrder), asc(schema.projectImages.id))
      : [];

    return rows.map((row) => ({
      id: row.slug,
      title: row.title,
      titleLatin: row.titleLatin,
      sector: row.sector,
      category: row.category,
      summary: row.summary || "",
      image: row.coverImage,
      link: row.link,
      featured: Boolean(row.featured),
      order: row.sortOrder,
      gallery: images.filter((image) => image.projectId === row.id).map((image) => image.url),
    }));
  },
  ["portfolio-published-v1"],
  { tags: [TAGS.portfolio], revalidate: 3600 }
);

export async function getPortfolio() {
  return arrangePortfolio(await loadPublished());
}
