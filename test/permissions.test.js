import { test } from "node:test";
import assert from "node:assert/strict";
import {
  ALL_PERMISSIONS,
  DEFAULT_ROLES,
  isKnownPermission,
  normalizePermissions,
} from "../src/server/auth/permissions.js";

test("permission keys are unique", () => {
  assert.equal(new Set(ALL_PERMISSIONS).size, ALL_PERMISSIONS.length);
});

test("unknown keys are dropped and prerequisites added", () => {
  assert.deepEqual(normalizePermissions(["blog.edit_all", "root.everything"]), ["blog.view", "blog.write", "blog.edit_all"]);
  assert.deepEqual(normalizePermissions(["users.manage"]), ["users.view", "users.manage"]);
});

test("normalising is stable and ordered like the catalogue", () => {
  const once = normalizePermissions(["audit.view", "work.delete"]);
  assert.deepEqual(normalizePermissions(once), once);
  assert.deepEqual(once, ["work.view", "work.delete", "audit.view"]);
});

test("default roles only use known permissions, and exactly one is the owner", () => {
  for (const role of DEFAULT_ROLES) for (const key of role.permissions) assert.ok(isKnownPermission(key), key);
  assert.equal(DEFAULT_ROLES.filter((role) => role.isOwner).length, 1);
});

test("an author can write but not publish", () => {
  const author = normalizePermissions(DEFAULT_ROLES.find((role) => role.name === "كاتب").permissions);
  assert.ok(author.includes("blog.write"));
  assert.ok(!author.includes("blog.publish"));
  assert.ok(!author.includes("work.view"));
});
