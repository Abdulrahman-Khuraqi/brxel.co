import { z } from "zod";

/** Letters (Arabic or Latin), digits and single dashes: "chocosarayi", "تصميم-متجر-سلة". */
export const SLUG_PATTERN = /^[\p{L}\p{N}]+(?:-[\p{L}\p{N}]+)*$/u;

export function slugify(text) {
  return String(text || "")
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[ً-ٰٟ]/g, "") // Arabic diacritics
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);
}

export const slugField = (max = 120) =>
  z
    .string()
    .trim()
    .toLowerCase()
    .min(2, "الرابط قصير جدًا.")
    .max(max, "الرابط طويل جدًا.")
    .regex(SLUG_PATTERN, "استخدم حروفًا وأرقامًا وشرطات فقط، دون مسافات.");

/** A site path ("/uploads/…", "/work/…") or an https URL. Nothing that could become a script or another scheme. */
export const imageUrl = z
  .string()
  .trim()
  .max(512)
  .refine((value) => /^\/(?!\/)[^\s"'<>]+$/.test(value) || /^https:\/\/[^\s"'<>]+$/.test(value), "رابط الصورة غير صالح.");

export const optionalHttpsUrl = z
  .string()
  .trim()
  .max(512)
  .refine((value) => value === "" || /^https?:\/\/[^\s"'<>]+$/.test(value), "اكتب رابطًا يبدأ بـ https://");

export const text = (max, message = "هذا الحقل مطلوب.") => z.string().trim().min(1, message).max(max, `الحد الأقصى ${max} حرف.`);
export const optionalText = (max) => z.string().trim().max(max, `الحد الأقصى ${max} حرف.`);

export const idField = z.coerce.number().int().positive();

/** Reads a checkbox the way HTML submits it: present means checked. */
export const checkbox = (formData, name) => formData.get(name) === "on" || formData.get(name) === "true";

/** Reads a JSON-encoded hidden field (galleries, stats rows). */
export function jsonField(formData, name, fallback) {
  try {
    const raw = formData.get(name);
    return raw ? JSON.parse(String(raw)) : fallback;
  } catch {
    return fallback;
  }
}

export const formText = (formData, name) => String(formData.get(name) ?? "");
