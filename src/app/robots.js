import { brand } from "@/lib/site";

// `output: "export"` needs robots.txt generated at build time, not per request.
export const dynamic = "force-static";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || `https://${brand.domain}`;

export default function robots() {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
