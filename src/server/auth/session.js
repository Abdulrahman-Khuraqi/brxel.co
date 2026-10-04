import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { cache } from "react";
import { cookies, headers } from "next/headers";
import { and, eq, gt, lt, ne } from "drizzle-orm";
import { getDb, schema } from "@/server/db/client";

/*
 * Session handling, following the "sessions in your own database" pattern:
 * the browser holds a random 256-bit token in an httpOnly cookie, the
 * database holds only its SHA-256. Sessions slide: an active user stays
 * signed in, an idle one is signed out after SESSION_DAYS.
 */
export const SESSION_COOKIE = "brxel_session";
export const SESSION_DAYS = 30;
const DAY = 24 * 60 * 60 * 1000;
const REFRESH_WHEN_LEFT = 15 * DAY;

const hashToken = (token) => createHash("sha256").update(token).digest("hex");

export const cookieOptions = (expires) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  expires,
});

/** Client address and agent, as far as the proxy in front of Node reports them. */
export async function requestMeta() {
  const list = await headers();
  const forwarded = list.get("x-forwarded-for")?.split(",")[0]?.trim();
  return {
    ip: (forwarded || list.get("x-real-ip") || "").slice(0, 45) || "unknown",
    userAgent: (list.get("user-agent") || "").slice(0, 255),
  };
}

/** Starts a session for the user and sets the cookie. Call from a Server Action only. */
export async function createSession(userId) {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * DAY);
  const { ip, userAgent } = await requestMeta();

  await getDb().insert(schema.sessions).values({ id: hashToken(token), userId, expiresAt, ip, userAgent });
  (await cookies()).set(SESSION_COOKIE, token, cookieOptions(expiresAt));

  // Housekeeping: expired rows are useless, drop them now and then.
  if (Math.random() < 0.05) {
    await getDb().delete(schema.sessions).where(lt(schema.sessions.expiresAt, new Date()));
  }
}

/**
 * The signed-in user for this request, with their role's permissions, or null.
 * Wrapped in React `cache` so a page and its components share one lookup.
 */
export const getSessionUser = cache(async () => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token || token.length > 100) return null;

  const db = getDb();
  const id = hashToken(token);
  const [row] = await db
    .select({
      sessionId: schema.sessions.id,
      expiresAt: schema.sessions.expiresAt,
      id: schema.users.id,
      email: schema.users.email,
      name: schema.users.name,
      status: schema.users.status,
      roleId: schema.roles.id,
      roleName: schema.roles.name,
      isOwner: schema.roles.isOwner,
    })
    .from(schema.sessions)
    .innerJoin(schema.users, eq(schema.users.id, schema.sessions.userId))
    .innerJoin(schema.roles, eq(schema.roles.id, schema.users.roleId))
    .where(and(eq(schema.sessions.id, id), gt(schema.sessions.expiresAt, new Date())));

  if (!row || row.status !== "active") return null;

  if (row.expiresAt.getTime() - Date.now() < REFRESH_WHEN_LEFT) {
    // The cookie itself is re-issued by src/proxy.js on every dashboard request.
    await db
      .update(schema.sessions)
      .set({ expiresAt: new Date(Date.now() + SESSION_DAYS * DAY) })
      .where(eq(schema.sessions.id, id));
  }

  const permissionRows = await db
    .select({ permission: schema.rolePermissions.permission })
    .from(schema.rolePermissions)
    .where(eq(schema.rolePermissions.roleId, row.roleId));

  return {
    id: row.id,
    email: row.email,
    name: row.name,
    sessionId: row.sessionId,
    role: { id: row.roleId, name: row.roleName, isOwner: Boolean(row.isOwner) },
    permissions: new Set(permissionRows.map((item) => item.permission)),
  };
});

/** Ends the current session and clears the cookie. */
export async function destroySession() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) await getDb().delete(schema.sessions).where(eq(schema.sessions.id, hashToken(token)));
  store.delete(SESSION_COOKIE);
}

/** Signs a user out everywhere, optionally keeping one session (the one making the change). */
export async function destroyUserSessions(userId, keepSessionId = null) {
  const condition = keepSessionId
    ? and(eq(schema.sessions.userId, userId), ne(schema.sessions.id, keepSessionId))
    : eq(schema.sessions.userId, userId);
  await getDb().delete(schema.sessions).where(condition);
}
