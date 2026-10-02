import { LEGAL_UPDATED } from "@/lib/legal";

// `output: "export"` needs the sitemap generated at build time, not per request.
export const dynamic = "force-static";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const ROUTES = [
  { path: "/", priority: 1 },
  { path: "/services/", priority: 0.9 },
  { path: "/work/", priority: 0.8 },
  { path: "/contact/", priority: 0.8 },
  { path: "/about/", priority: 0.7 },
  { path: "/terms/", priority: 0.3 },
  { path: "/privacy/", priority: 0.3 },
  { path: "/refunds/", priority: 0.3 },
];

export default function sitemap() {
  return ROUTES.map(({ path, priority }) => ({
    url: `${siteUrl}${path}`,
    lastModified: LEGAL_UPDATED,
    priority,
  }));
}
