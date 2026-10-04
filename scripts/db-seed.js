/*
 * Fills a fresh database with what the site needs to run. Idempotent: each
 * part only runs when its table is still empty, so it's safe to re-run.
 *
 *   roles + permissions   the default roles in src/server/auth/permissions.js
 *   site settings         the hero numbers
 *   portfolio             src/data/projects.json and the social galleries in /public
 *   blog categories       a starting set
 *   owner account         from ADMIN_EMAIL / ADMIN_PASSWORD / ADMIN_NAME, if set
 */
import { readFile, readdir } from "node:fs/promises";
import { count, eq } from "drizzle-orm";
import { getDb, run } from "./lib.js";
import * as schema from "../src/server/db/schema.js";
import { DEFAULT_ROLES, normalizePermissions } from "../src/server/auth/permissions.js";
import { checkPasswordStrength, hashPassword } from "../src/server/auth/password.js";

const isEmpty = async (db, table) => (await db.select({ total: count() }).from(table))[0].total === 0;

const DEFAULT_SETTINGS = {
  "hero.stats": [
    { value: "+1000", label: "مشروع مُنجز" },
    { value: "+200", label: "عميل" },
    { value: "+60", label: "هوية بصرية" },
  ],
};

const DEFAULT_CATEGORIES = [
  { slug: "brand-identity", name: "الهوية البصرية" },
  { slug: "social-media", name: "السوشيال ميديا" },
  { slug: "ecommerce", name: "المتاجر الإلكترونية" },
  { slug: "studio", name: "من داخل الاستوديو" },
];

/** Social projects keep their full galleries as numbered files under public/work/social/gallery/<id>/. */
async function galleryFor(id) {
  try {
    const files = (await readdir(`public/work/social/gallery/${id}`)).filter((file) => /\.(webp|jpe?g|png)$/i.test(file));
    return files.sort().map((file) => `/work/social/gallery/${id}/${file}`);
  } catch {
    return [];
  }
}

run(async () => {
  const db = getDb();

  if (await isEmpty(db, schema.roles)) {
    for (const role of DEFAULT_ROLES) {
      const [{ id }] = await db
        .insert(schema.roles)
        .values({ name: role.name, description: role.description, isOwner: Boolean(role.isOwner) })
        .$returningId();
      const keys = normalizePermissions(role.permissions);
      if (keys.length) await db.insert(schema.rolePermissions).values(keys.map((permission) => ({ roleId: id, permission })));
    }
    console.log(`✔ ${DEFAULT_ROLES.length} roles`);
  }

  for (const [key, value] of Object.entries(DEFAULT_SETTINGS)) {
    const existing = await db.select().from(schema.settings).where(eq(schema.settings.key, key));
    if (!existing.length) {
      await db.insert(schema.settings).values({ key, value: JSON.stringify(value) });
      console.log(`✔ setting ${key}`);
    }
  }

  if (await isEmpty(db, schema.projects)) {
    const { projects } = JSON.parse(await readFile("src/data/projects.json", "utf8"));
    const now = new Date();
    for (const [order, project] of projects.entries()) {
      const [{ id }] = await db
        .insert(schema.projects)
        .values({
          slug: project.id,
          title: project.title,
          titleLatin: project.titleLatin || "",
          sector: project.sector || "",
          category: project.category,
          summary: project.summary || null,
          coverImage: project.image,
          link: project.link || "",
          featured: Boolean(project.featured),
          status: "published",
          sortOrder: order,
          publishedAt: now,
        })
        .$returningId();
      const gallery = project.category === "social" ? await galleryFor(project.id) : [];
      if (gallery.length) {
        await db
          .insert(schema.projectImages)
          .values(gallery.map((url, index) => ({ projectId: id, url, sortOrder: index })));
      }
    }
    console.log(`✔ ${projects.length} projects imported from src/data/projects.json`);
  }

  if (await isEmpty(db, schema.postCategories)) {
    await db.insert(schema.postCategories).values(DEFAULT_CATEGORIES);
    console.log(`✔ ${DEFAULT_CATEGORIES.length} blog categories`);
  }

  if (await isEmpty(db, schema.users)) {
    const email = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD || "";
    if (!email || !password) {
      console.log("! No users yet. Create the owner with: npm run admin:create -- --email you@brxel.co --name \"Your name\"");
      return;
    }
    const name = process.env.ADMIN_NAME || "المالك";
    const weak = checkPasswordStrength(password, { email, name });
    if (weak) throw new Error(`ADMIN_PASSWORD: ${weak}`);
    const [owner] = await db.select().from(schema.roles).where(eq(schema.roles.isOwner, true));
    await db.insert(schema.users).values({
      email,
      name,
      passwordHash: await hashPassword(password),
      roleId: owner.id,
      passwordChangedAt: new Date(),
    });
    console.log(`✔ owner account ${email} (remove ADMIN_PASSWORD from the environment now)`);
  }

  console.log("✔ Seed complete.");
});
