import "server-only";
import { getDb, schema } from "@/server/db/client";
import { requestMeta } from "@/server/auth/session";

/**
 * Records who did what. Called after every change in the dashboard; a failure
 * to log never undoes the change itself, it only reports to the server log.
 */
export async function audit(user, action, { type = "", id = "", summary = "" } = {}) {
  try {
    const { ip } = await requestMeta();
    await getDb()
      .insert(schema.auditLogs)
      .values({
        userId: user?.id ?? null,
        action,
        entityType: type,
        entityId: String(id ?? ""),
        summary: summary.slice(0, 255),
        ip,
      });
  } catch (error) {
    console.error("[audit] could not record", action, error);
  }
}
