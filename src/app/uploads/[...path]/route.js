import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import path from "node:path";
import { Readable } from "node:stream";
import { uploadRoot } from "@/server/media";

const TYPES = { webp: "image/webp", jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", avif: "image/avif", gif: "image/gif" };
const SAFE_SEGMENT = /^[A-Za-z0-9_-][A-Za-z0-9._-]*$/;

/**
 * Serves files uploaded from the dashboard. Names are random and never reused,
 * so responses can be cached for a year. Only image types under UPLOAD_DIR are
 * served; anything else is a 404.
 */
export async function GET(_request, { params }) {
  const segments = (await params).path || [];
  if (!segments.length || segments.some((segment) => !SAFE_SEGMENT.test(segment))) {
    return new Response("Not found", { status: 404 });
  }

  const root = uploadRoot();
  const file = path.resolve(root, ...segments);
  const type = TYPES[path.extname(file).slice(1).toLowerCase()];
  if (!type || !file.startsWith(root + path.sep)) return new Response("Not found", { status: 404 });

  let info;
  try {
    info = await stat(file);
  } catch {
    return new Response("Not found", { status: 404 });
  }
  if (!info.isFile()) return new Response("Not found", { status: 404 });

  return new Response(Readable.toWeb(createReadStream(file)), {
    headers: {
      "Content-Type": type,
      "Content-Length": String(info.size),
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
