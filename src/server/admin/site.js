import "server-only";
import { z } from "zod";
import { count, desc, eq } from "drizzle-orm";
import { getDb, schema } from "@/server/db/client";
import { parseInput } from "@/server/auth/guard";
import { SETTING_DEFAULTS } from "@/server/content/settings";

/* ───────── Site settings ───────── */

const statsSchema = z
  .array(
    z.object({
      value: z.string().trim().min(1, "اكتب الرقم.").max(12, "الرقم طويل جدًا."),
      label: z.string().trim().min(1, "اكتب الوصف.").max(40, "الوصف طويل جدًا."),
    })
  )
  .min(1, "أضف رقمًا واحدًا على الأقل.")
  .max(4, "الحد الأقصى أربعة أرقام.");

export async function readSetting(key) {
  const [row] = await getDb().select().from(schema.settings).where(eq(schema.settings.key, key));
  if (!row) return SETTING_DEFAULTS[key];
  try {
    return JSON.parse(row.value);
  } catch {
    return SETTING_DEFAULTS[key];
  }
}

export async function saveHeroStats(user, rows) {
  const stats = parseInput(statsSchema, rows);
  const value = JSON.stringify(stats);
  await getDb()
    .insert(schema.settings)
    .values({ key: "hero.stats", value, updatedBy: user.id })
    .onDuplicateKeyUpdate({ set: { value, updatedBy: user.id } });
  return stats;
}

/* ───────── Activity ───────── */

export const AUDIT_PAGE_SIZE = 50;

export async function listAudit({ page = 1, userId = null } = {}) {
  const db = getDb();
  const where = userId ? eq(schema.auditLogs.userId, userId) : undefined;
  const [{ total }] = await db.select({ total: count() }).from(schema.auditLogs).where(where);
  const items = await db
    .select({
      id: schema.auditLogs.id,
      action: schema.auditLogs.action,
      entityType: schema.auditLogs.entityType,
      entityId: schema.auditLogs.entityId,
      summary: schema.auditLogs.summary,
      ip: schema.auditLogs.ip,
      createdAt: schema.auditLogs.createdAt,
      userName: schema.users.name,
    })
    .from(schema.auditLogs)
    .leftJoin(schema.users, eq(schema.users.id, schema.auditLogs.userId))
    .where(where)
    .orderBy(desc(schema.auditLogs.id))
    .limit(AUDIT_PAGE_SIZE)
    .offset((Math.max(1, page) - 1) * AUDIT_PAGE_SIZE);
  return { items, total, pages: Math.max(1, Math.ceil(total / AUDIT_PAGE_SIZE)) };
}
