import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt);

/*
 * Passwords are hashed with scrypt from Node's own crypto: memory-hard, no
 * native add-on to compile on the host. Parameters are stored with each hash
 * so they can be raised later without breaking existing accounts.
 */
const PARAMS = { N: 2 ** 15, r: 8, p: 1 };
const KEY_LENGTH = 64;
const MAX_MEM = 128 * PARAMS.N * PARAMS.r * 2;

export const PASSWORD_MIN_LENGTH = 10;

export async function hashPassword(password) {
  const salt = randomBytes(16);
  const key = await scryptAsync(password.normalize("NFKC"), salt, KEY_LENGTH, { ...PARAMS, maxmem: MAX_MEM });
  return ["scrypt", PARAMS.N, PARAMS.r, PARAMS.p, salt.toString("base64url"), key.toString("base64url")].join("$");
}

export async function verifyPassword(password, stored) {
  const parts = String(stored || "").split("$");
  if (parts.length !== 6 || parts[0] !== "scrypt") return false;
  const [, N, r, p, saltText, keyText] = parts;
  const expected = Buffer.from(keyText, "base64url");
  const params = { N: Number(N), r: Number(r), p: Number(p) };
  const key = await scryptAsync(password.normalize("NFKC"), Buffer.from(saltText, "base64url"), expected.length, {
    ...params,
    maxmem: 128 * params.N * params.r * 2,
  });
  return key.length === expected.length && timingSafeEqual(key, expected);
}

/** True when a stored hash uses weaker parameters than today's, so it can be upgraded on next sign-in. */
export function needsRehash(stored) {
  const [, N, r, p] = String(stored || "").split("$");
  return Number(N) < PARAMS.N || Number(r) < PARAMS.r || Number(p) < PARAMS.p;
}

/** Returns an Arabic error message, or null when the password is acceptable. */
export function checkPasswordStrength(password, { email = "", name = "" } = {}) {
  if (typeof password !== "string" || password.length < PASSWORD_MIN_LENGTH) {
    return `كلمة المرور يجب ألا تقل عن ${PASSWORD_MIN_LENGTH} أحرف.`;
  }
  if (password.length > 200) return "كلمة المرور طويلة جدًا.";
  const lower = password.toLowerCase();
  const local = email.split("@")[0]?.toLowerCase();
  if ((local && local.length > 3 && lower.includes(local)) || (name && lower.includes(name.toLowerCase()))) {
    return "لا تستخدم اسمك أو بريدك داخل كلمة المرور.";
  }
  if (new Set(password).size < 5) return "كلمة المرور متكررة الأحرف؛ اختر كلمة أقوى.";
  return null;
}

/** A readable random password for new accounts and resets. */
export function generatePassword(length = 16) {
  const alphabet = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = randomBytes(length);
  return Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join("");
}
