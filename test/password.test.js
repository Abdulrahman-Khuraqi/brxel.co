import { test } from "node:test";
import assert from "node:assert/strict";
import {
  checkPasswordStrength,
  generatePassword,
  hashPassword,
  needsRehash,
  verifyPassword,
} from "../src/server/auth/password.js";

test("a hash verifies its own password and nothing else", async () => {
  const hash = await hashPassword("Sun-Gold-Studio-77");
  assert.match(hash, /^scrypt\$32768\$8\$1\$/);
  assert.equal(await verifyPassword("Sun-Gold-Studio-77", hash), true);
  assert.equal(await verifyPassword("sun-gold-studio-77", hash), false);
  assert.equal(await verifyPassword("", hash), false);
});

test("two hashes of one password differ (random salt)", async () => {
  assert.notEqual(await hashPassword("same-password-123"), await hashPassword("same-password-123"));
});

test("malformed hashes are rejected, not thrown", async () => {
  assert.equal(await verifyPassword("x", "not-a-hash"), false);
  assert.equal(await verifyPassword("x", null), false);
});

test("weaker stored parameters are flagged for rehash", () => {
  assert.equal(needsRehash("scrypt$16384$8$1$a$b"), true);
  assert.equal(needsRehash("scrypt$32768$8$1$a$b"), false);
});

test("strength rules", () => {
  assert.ok(checkPasswordStrength("short"));
  assert.ok(checkPasswordStrength("aaaaaaaaaaaa"));
  assert.ok(checkPasswordStrength("owner-password-1", { email: "owner@brxel.co" }));
  assert.equal(checkPasswordStrength("Sun-Gold-Studio-77", { email: "owner@brxel.co", name: "Abdulrahman" }), null);
});

test("generated passwords pass the strength rules", () => {
  for (let index = 0; index < 20; index += 1) assert.equal(checkPasswordStrength(generatePassword()), null);
});
