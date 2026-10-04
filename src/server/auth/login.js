import "server-only";
import { and, count, eq, gt } from "drizzle-orm";
import { getDb, schema } from "@/server/db/client";
import { hashPassword, needsRehash, verifyPassword } from "@/server/auth/password";
import { createSession, requestMeta } from "@/server/auth/session";

const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILURES_PER_EMAIL = 5;
const MAX_FAILURES_PER_IP = 20;

// Verified against when the email is unknown, so a miss takes as long as a wrong password.
const DUMMY_HASH = hashPassword("not-a-real-password-just-timing");

const failuresSince = async (column, value, since) =>
  (
    await getDb()
      .select({ total: count() })
      .from(schema.loginAttempts)
      .where(and(eq(column, value), eq(schema.loginAttempts.success, false), gt(schema.loginAttempts.createdAt, since)))
  )[0].total;

/**
 * Checks the credentials and starts a session. Returns null on success or an
 * Arabic message on failure. The message never says which of the two was wrong.
 */
export async function signIn(rawEmail, password) {
  const email = String(rawEmail || "").trim().toLowerCase().slice(0, 191);
  const { ip } = await requestMeta();
  const db = getDb();
  const since = new Date(Date.now() - WINDOW_MS);

  const [byEmail, byIp] = await Promise.all([
    failuresSince(schema.loginAttempts.email, email, since),
    failuresSince(schema.loginAttempts.ip, ip, since),
  ]);
  if (byEmail >= MAX_FAILURES_PER_EMAIL || byIp >= MAX_FAILURES_PER_IP) {
    return "محاولات كثيرة غير ناجحة. انتظر 15 دقيقة ثم حاول مرة أخرى.";
  }

  const [user] = await db.select().from(schema.users).where(eq(schema.users.email, email));
  const valid = user ? await verifyPassword(password, user.passwordHash) : (await verifyPassword(password, await DUMMY_HASH), false);
  const allowed = valid && user.status === "active";

  await db.insert(schema.loginAttempts).values({ email, ip, success: allowed });

  if (!allowed) {
    return valid ? "هذا الحساب معطّل. تواصل مع مدير الموقع." : "البريد الإلكتروني أو كلمة المرور غير صحيحة.";
  }

  const updates = { lastLoginAt: new Date() };
  if (needsRehash(user.passwordHash)) updates.passwordHash = await hashPassword(password);
  await db.update(schema.users).set(updates).where(eq(schema.users.id, user.id));

  await createSession(user.id);
  await db.insert(schema.auditLogs).values({
    userId: user.id,
    action: "auth.sign_in",
    entityType: "user",
    entityId: String(user.id),
    summary: "تسجيل دخول",
    ip,
  });
  return null;
}
