import { getPool } from "@/server/db/client";

export const dynamic = "force-dynamic";

/** For uptime monitors: 200 when the app and the database answer, 503 otherwise. */
export async function GET() {
  try {
    await getPool().query("SELECT 1");
    return Response.json({ ok: true, database: "up" }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ ok: false, database: "down" }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
