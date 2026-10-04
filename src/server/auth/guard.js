import "server-only";
import { redirect, unstable_rethrow } from "next/navigation";
import { getSessionUser } from "@/server/auth/session";

/** True when the user holds the permission; the owner role holds every permission. */
export function can(user, permission) {
  if (!user) return false;
  return user.role.isOwner || user.permissions.has(permission);
}

export const canAny = (user, permissions) => permissions.some((permission) => can(user, permission));

/** For dashboard pages: the signed-in user, or a redirect to the sign-in page. */
export async function requireUser() {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login/");
  return user;
}

/** For dashboard pages: the user if they hold the permission, otherwise the "no access" page. */
export async function requirePermission(permission) {
  const user = await requireUser();
  if (!can(user, permission)) redirect("/admin/forbidden/");
  return user;
}

/** An error whose message is safe to show to the person who triggered it. */
export class ActionError extends Error {
  constructor(message, fieldErrors = undefined) {
    super(message);
    this.fieldErrors = fieldErrors;
  }
}

/**
 * Wraps the body of every dashboard Server Action:
 *
 *   - re-checks the session and the permission on the server (the UI hiding a
 *     button is a convenience, never the protection);
 *   - turns ActionError into `{ error, fieldErrors }` for the form;
 *   - lets Next's redirect/notFound signals through;
 *   - hides anything unexpected behind a generic message and logs it.
 *
 * `permission` may be null for actions any signed-in user may run (their own account).
 */
export async function guarded(permission, body) {
  try {
    const user = await getSessionUser();
    if (!user) throw new ActionError("انتهت جلستك. سجّل الدخول مرة أخرى.");
    if (permission && !can(user, permission)) throw new ActionError("ليست لديك صلاحية لهذا الإجراء.");
    return await body(user);
  } catch (error) {
    unstable_rethrow(error);
    if (error instanceof ActionError) return { ok: false, error: error.message, fieldErrors: error.fieldErrors };
    console.error("[dashboard action]", error);
    return { ok: false, error: "حدث خطأ غير متوقع. حاول مرة أخرى." };
  }
}

/** Validates FormData-derived input with a Zod schema, throwing field errors in the form's shape. */
export function parseInput(schema, input) {
  const result = schema.safeParse(input);
  if (result.success) return result.data;
  const fieldErrors = {};
  for (const issue of result.error.issues) {
    const key = issue.path.join(".");
    if (!fieldErrors[key]) fieldErrors[key] = issue.message;
  }
  throw new ActionError("راجع الحقول المظلّلة.", fieldErrors);
}
