import "server-only";
import { listRoles } from "@/server/admin/team";

/** Roles this user may hand out: never more than they hold, and the owner role only by an owner. */
export async function assignableRoles(actor) {
  const roles = await listRoles();
  if (actor.role.isOwner) return roles;
  return roles.filter((role) => !role.isOwner && role.permissions.every((key) => actor.permissions.has(key)));
}
