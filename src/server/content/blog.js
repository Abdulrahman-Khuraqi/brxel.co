import "server-only";
import { unstable_cache } from "next/cache";
import { and, asc, count, desc, eq, lte } from "drizzle-orm";
import { getDb, schema } from "@/server/db/client";
import { TAGS } from "@/server/content/tags";

export const POSTS_PER_PAGE = 9;

const published = () => and(eq(schema.posts.status, "published"), lte(schema.posts.publishedAt, new Date()));

const cardFields = {
  slug: schema.posts.slug,
  title: schema.posts.title,
  excerpt: schema.posts.excerpt,
  coverImage: schema.posts.coverImage,
  publishedAt: schema.posts.publishedAt,
  categorySlug: schema.postCategories.slug,
  categoryName: schema.postCategories.name,
};

/** One page of published posts, newest first, optionally inside one category. */
export const listPublishedPosts = unstable_cache(
  async ({ page = 1, category = "" } = {}) => {
    const db = getDb();
    const where = category ? and(published(), eq(schema.postCategories.slug, category)) : published();
    const [{ total }] = await db
      .select({ total: count() })
      .from(schema.posts)
      .leftJoin(schema.postCategories, eq(schema.postCategories.id, schema.posts.categoryId))
      .where(where);
    const items = await db
      .select(cardFields)
      .from(schema.posts)
      .leftJoin(schema.postCategories, eq(schema.postCategories.id, schema.posts.categoryId))
      .where(where)
      .orderBy(desc(schema.posts.publishedAt), desc(schema.posts.id))
      .limit(POSTS_PER_PAGE)
      .offset((Math.max(1, page) - 1) * POSTS_PER_PAGE);
    return { items, total, pages: Math.max(1, Math.ceil(total / POSTS_PER_PAGE)) };
  },
  ["posts-list-v1"],
  { tags: [TAGS.posts], revalidate: 600 }
);

export const getPublishedPost = unstable_cache(
  async (slug) => {
    const [post] = await getDb()
      .select({
        ...cardFields,
        id: schema.posts.id,
        body: schema.posts.body,
        seoTitle: schema.posts.seoTitle,
        seoDescription: schema.posts.seoDescription,
        updatedAt: schema.posts.updatedAt,
        authorName: schema.users.name,
      })
      .from(schema.posts)
      .leftJoin(schema.postCategories, eq(schema.postCategories.id, schema.posts.categoryId))
      .leftJoin(schema.users, eq(schema.users.id, schema.posts.authorId))
      .where(and(published(), eq(schema.posts.slug, slug)));
    return post || null;
  },
  ["posts-one-v1"],
  { tags: [TAGS.posts], revalidate: 600 }
);

/** Categories that have at least one published post, for the filter on /blog/. */
export const getActiveCategories = unstable_cache(
  async () =>
    getDb()
      .select({ slug: schema.postCategories.slug, name: schema.postCategories.name, total: count(schema.posts.id) })
      .from(schema.postCategories)
      .innerJoin(schema.posts, and(eq(schema.posts.categoryId, schema.postCategories.id), published()))
      .groupBy(schema.postCategories.id)
      .orderBy(asc(schema.postCategories.name)),
  ["posts-categories-v1"],
  { tags: [TAGS.posts], revalidate: 600 }
);

/** Every published slug with its last change, for the sitemap. */
export const getPostSitemap = unstable_cache(
  async () =>
    getDb()
      .select({ slug: schema.posts.slug, updatedAt: schema.posts.updatedAt })
      .from(schema.posts)
      .where(published()),
  ["posts-sitemap-v1"],
  { tags: [TAGS.posts], revalidate: 600 }
);
