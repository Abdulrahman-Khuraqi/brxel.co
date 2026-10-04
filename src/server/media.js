import "server-only";
import { randomBytes } from "node:crypto";
import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { getDb, schema } from "@/server/db/client";
import { ActionError } from "@/server/auth/guard";

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
const MAX_EDGE = 2400;
const ACCEPTED = new Set(["jpeg", "png", "webp", "avif", "gif", "heif", "tiff"]);

/**
 * Where uploads live. Keep it outside the app folder in production (see the
 * README): a redeploy replaces the app folder, and the uploads must survive it.
 */
export const uploadRoot = () => path.resolve(/*turbopackIgnore: true*/ process.env.UPLOAD_DIR || "storage/uploads");

export const publicUrl = (relativePath) => `/uploads/${relativePath}`;

/**
 * Validates and stores one uploaded image. Whatever comes in is decoded by
 * sharp (so a renamed script is rejected), auto-rotated, stripped of
 * metadata, capped at 2400px and re-encoded as WebP under a random name.
 */
export async function storeImage(file, user, { alt = "" } = {}) {
  if (!file || typeof file.arrayBuffer !== "function" || file.size === 0) throw new ActionError("اختر صورة لرفعها.");
  if (file.size > MAX_UPLOAD_BYTES) throw new ActionError("حجم الصورة أكبر من 10 ميغابايت.");

  const input = Buffer.from(await file.arrayBuffer());
  let meta;
  try {
    meta = await sharp(input, { limitInputPixels: 80_000_000 }).metadata();
  } catch {
    throw new ActionError(`الملف "${file.name}" ليس صورة يمكن قراءتها.`);
  }
  if (!ACCEPTED.has(meta.format)) throw new ActionError("الصيغ المقبولة: JPG وPNG وWebP وAVIF وGIF.");

  const { data, info } = await sharp(input, { limitInputPixels: 80_000_000 })
    .rotate()
    .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 82, effort: 4 })
    .toBuffer({ resolveWithObject: true });

  const now = new Date();
  const folder = `${now.getUTCFullYear()}/${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
  const relativePath = `${folder}/${randomBytes(12).toString("hex")}.webp`;
  await mkdir(path.join(uploadRoot(), folder), { recursive: true });
  await writeFile(path.join(uploadRoot(), relativePath), data);

  const [{ id }] = await getDb()
    .insert(schema.media)
    .values({
      path: relativePath,
      originalName: String(file.name || "").slice(0, 255),
      mime: "image/webp",
      size: data.length,
      width: info.width,
      height: info.height,
      alt: alt.slice(0, 255),
      uploadedBy: user.id,
    })
    .$returningId();

  return { id, url: publicUrl(relativePath), width: info.width, height: info.height };
}

/** Removes a stored file; a missing file is not an error. */
export async function removeImageFile(relativePath) {
  const target = path.resolve(uploadRoot(), relativePath);
  if (!target.startsWith(uploadRoot() + path.sep)) return;
  await rm(target, { force: true });
}
