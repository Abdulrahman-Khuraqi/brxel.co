import { relations, sql } from "drizzle-orm";
import {
  bigint,
  boolean,
  char,
  datetime,
  index,
  int,
  mediumtext,
  mysqlEnum,
  mysqlTable,
  primaryKey,
  smallint,
  text,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";

/*
 * The whole database, in one place. Works on MySQL 8 and MariaDB 10.6+ (what
 * Hostinger provides). Every table is utf8mb4 through the database default,
 * which `npm run db:migrate` sets before applying migrations.
 *
 * Imports here stay relative (no "@/") so the scripts in /scripts can load it
 * with plain Node.
 */

const createdAt = () => datetime("created_at", { mode: "date" }).notNull().default(sql`CURRENT_TIMESTAMP`);
const updatedAt = () =>
  datetime("updated_at", { mode: "date" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => new Date());

/* ───────────────────────── People and access ───────────────────────── */

export const roles = mysqlTable("roles", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 64 }).notNull(),
  description: varchar("description", { length: 255 }).notNull().default(""),
  /** The owner role: every permission, cannot be edited or deleted. */
  isOwner: boolean("is_owner").notNull().default(false),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
}, (table) => [uniqueIndex("roles_name_unique").on(table.name)]);

/** One row per permission a role holds; the catalogue of keys lives in src/server/auth/permissions.js. */
export const rolePermissions = mysqlTable("role_permissions", {
  roleId: int("role_id").notNull().references(() => roles.id, { onDelete: "cascade" }),
  permission: varchar("permission", { length: 64 }).notNull(),
}, (table) => [primaryKey({ columns: [table.roleId, table.permission] })]);

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 191 }).notNull(),
  name: varchar("name", { length: 120 }).notNull(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  roleId: int("role_id").notNull().references(() => roles.id, { onDelete: "restrict" }),
  status: mysqlEnum("status", ["active", "disabled"]).notNull().default("active"),
  lastLoginAt: datetime("last_login_at", { mode: "date" }),
  passwordChangedAt: datetime("password_changed_at", { mode: "date" }),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
}, (table) => [uniqueIndex("users_email_unique").on(table.email), index("users_role_idx").on(table.roleId)]);

/** Server-side sessions. Only a SHA-256 of the cookie token is stored, so a leaked table can't sign anyone in. */
export const sessions = mysqlTable("sessions", {
  id: char("id", { length: 64 }).primaryKey(),
  userId: int("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  expiresAt: datetime("expires_at", { mode: "date" }).notNull(),
  ip: varchar("ip", { length: 45 }),
  userAgent: varchar("user_agent", { length: 255 }),
  createdAt: createdAt(),
}, (table) => [index("sessions_user_idx").on(table.userId), index("sessions_expires_idx").on(table.expiresAt)]);

/** Every sign-in attempt, for rate limiting and for the security trail. */
export const loginAttempts = mysqlTable("login_attempts", {
  id: bigint("id", { mode: "number", unsigned: true }).autoincrement().primaryKey(),
  email: varchar("email", { length: 191 }).notNull(),
  ip: varchar("ip", { length: 45 }).notNull(),
  success: boolean("success").notNull(),
  createdAt: createdAt(),
}, (table) => [
  index("login_attempts_email_idx").on(table.email, table.createdAt),
  index("login_attempts_ip_idx").on(table.ip, table.createdAt),
]);

/* ───────────────────────── Portfolio ───────────────────────── */

export const PROJECT_CATEGORIES = ["identity", "social", "web", "print"];
export const PUBLISH_STATUSES = ["draft", "published"];

export const projects = mysqlTable("projects", {
  id: int("id").autoincrement().primaryKey(),
  /** Public id in URLs, e.g. /work/social/chocosarayi/. */
  slug: varchar("slug", { length: 120 }).notNull(),
  title: varchar("title", { length: 191 }).notNull(),
  titleLatin: varchar("title_latin", { length: 191 }).notNull().default(""),
  sector: varchar("sector", { length: 120 }).notNull().default(""),
  category: mysqlEnum("category", PROJECT_CATEGORIES).notNull(),
  summary: text("summary"),
  coverImage: varchar("cover_image", { length: 512 }).notNull(),
  link: varchar("link", { length: 512 }).notNull().default(""),
  featured: boolean("featured").notNull().default(false),
  status: mysqlEnum("status", PUBLISH_STATUSES).notNull().default("draft"),
  /** Manual nudge inside a category; lower comes first after the featured/depth ordering. */
  sortOrder: int("sort_order").notNull().default(0),
  publishedAt: datetime("published_at", { mode: "date" }),
  createdBy: int("created_by").references(() => users.id, { onDelete: "set null" }),
  updatedBy: int("updated_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
}, (table) => [
  uniqueIndex("projects_slug_unique").on(table.slug),
  index("projects_listing_idx").on(table.status, table.category, table.sortOrder),
]);

export const projectImages = mysqlTable("project_images", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  url: varchar("url", { length: 512 }).notNull(),
  alt: varchar("alt", { length: 255 }).notNull().default(""),
  sortOrder: smallint("sort_order").notNull().default(0),
}, (table) => [index("project_images_project_idx").on(table.projectId, table.sortOrder)]);

/* ───────────────────────── Blog ───────────────────────── */

export const POST_STATUSES = ["draft", "review", "published"];

export const postCategories = mysqlTable("post_categories", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 120 }).notNull(),
  name: varchar("name", { length: 120 }).notNull(),
  createdAt: createdAt(),
}, (table) => [uniqueIndex("post_categories_slug_unique").on(table.slug)]);

export const posts = mysqlTable("posts", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 160 }).notNull(),
  title: varchar("title", { length: 191 }).notNull(),
  excerpt: varchar("excerpt", { length: 400 }).notNull().default(""),
  /** Markdown. Rendered without raw HTML, so stored content can't inject scripts. */
  body: mediumtext("body").notNull(),
  coverImage: varchar("cover_image", { length: 512 }).notNull().default(""),
  categoryId: int("category_id").references(() => postCategories.id, { onDelete: "set null" }),
  authorId: int("author_id").references(() => users.id, { onDelete: "set null" }),
  status: mysqlEnum("status", POST_STATUSES).notNull().default("draft"),
  seoTitle: varchar("seo_title", { length: 191 }).notNull().default(""),
  seoDescription: varchar("seo_description", { length: 320 }).notNull().default(""),
  publishedAt: datetime("published_at", { mode: "date" }),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
}, (table) => [
  uniqueIndex("posts_slug_unique").on(table.slug),
  index("posts_listing_idx").on(table.status, table.publishedAt),
  index("posts_author_idx").on(table.authorId),
]);

/* ───────────────────────── Media, settings, audit ───────────────────────── */

export const media = mysqlTable("media", {
  id: int("id").autoincrement().primaryKey(),
  /** Path under UPLOAD_DIR, e.g. 2026/10/3f9c…a1.webp; served at /uploads/<path>. */
  path: varchar("path", { length: 255 }).notNull(),
  originalName: varchar("original_name", { length: 255 }).notNull().default(""),
  mime: varchar("mime", { length: 64 }).notNull(),
  size: int("size", { unsigned: true }).notNull(),
  width: smallint("width", { unsigned: true }),
  height: smallint("height", { unsigned: true }),
  alt: varchar("alt", { length: 255 }).notNull().default(""),
  uploadedBy: int("uploaded_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: createdAt(),
}, (table) => [uniqueIndex("media_path_unique").on(table.path), index("media_created_idx").on(table.createdAt)]);

/** Small editable site values (hero numbers, …), stored as JSON text so MariaDB and MySQL behave the same. */
export const settings = mysqlTable("settings", {
  key: varchar("key", { length: 64 }).primaryKey(),
  value: text("value").notNull(),
  updatedBy: int("updated_by").references(() => users.id, { onDelete: "set null" }),
  updatedAt: updatedAt(),
});

export const auditLogs = mysqlTable("audit_logs", {
  id: bigint("id", { mode: "number", unsigned: true }).autoincrement().primaryKey(),
  userId: int("user_id").references(() => users.id, { onDelete: "set null" }),
  action: varchar("action", { length: 64 }).notNull(),
  entityType: varchar("entity_type", { length: 32 }).notNull().default(""),
  entityId: varchar("entity_id", { length: 64 }).notNull().default(""),
  summary: varchar("summary", { length: 255 }).notNull().default(""),
  ip: varchar("ip", { length: 45 }),
  createdAt: createdAt(),
}, (table) => [
  index("audit_created_idx").on(table.createdAt),
  index("audit_entity_idx").on(table.entityType, table.entityId),
  index("audit_user_idx").on(table.userId, table.createdAt),
]);

/* ───────────────────────── Relations (for relational queries) ───────────────────────── */

export const rolesRelations = relations(roles, ({ many }) => ({
  permissions: many(rolePermissions),
  users: many(users),
}));

export const rolePermissionsRelations = relations(rolePermissions, ({ one }) => ({
  role: one(roles, { fields: [rolePermissions.roleId], references: [roles.id] }),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
  role: one(roles, { fields: [users.roleId], references: [roles.id] }),
  sessions: many(sessions),
  posts: many(posts),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const projectsRelations = relations(projects, ({ many }) => ({
  images: many(projectImages),
}));

export const projectImagesRelations = relations(projectImages, ({ one }) => ({
  project: one(projects, { fields: [projectImages.projectId], references: [projects.id] }),
}));

export const postsRelations = relations(posts, ({ one }) => ({
  author: one(users, { fields: [posts.authorId], references: [users.id] }),
  category: one(postCategories, { fields: [posts.categoryId], references: [postCategories.id] }),
}));

export const postCategoriesRelations = relations(postCategories, ({ many }) => ({
  posts: many(posts),
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  user: one(users, { fields: [auditLogs.userId], references: [users.id] }),
}));
