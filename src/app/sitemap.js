import { siteUrl } from "@/lib/site";
import { serviceHref, services } from "@/lib/services";
import { getPortfolio } from "@/server/content/portfolio";
import { getPostSitemap } from "@/server/content/blog";

// Projects and posts come from the database, so the sitemap is built per request (and cached).
export const dynamic = "force-dynamic";

const ROUTES = [
  { path: "/", priority: 1 },
  { path: "/services/", priority: 0.9 },
  ...services.map((service) => ({ path: serviceHref(service.id), priority: 0.8 })),
  { path: "/work/", priority: 0.8 },
  { path: "/blog/", priority: 0.8 },
  { path: "/contact/", priority: 0.8 },
  { path: "/about/", priority: 0.7 },
  { path: "/terms/", priority: 0.3 },
  { path: "/privacy/", priority: 0.3 },
  { path: "/refunds/", priority: 0.3 },
];

export default async function sitemap() {
  const [{ socialProjects }, posts] = await Promise.all([getPortfolio(), getPostSitemap()]);

  return [
    ...ROUTES.map(({ path, priority }) => ({ url: `${siteUrl}${path}`, priority })),
    ...socialProjects
      .filter((project) => project.gallery.length)
      .map((project) => ({ url: `${siteUrl}/work/social/${project.id}/`, priority: 0.6 })),
    ...posts.map((post) => ({ url: `${siteUrl}/blog/${post.slug}/`, lastModified: new Date(post.updatedAt), priority: 0.6 })),
  ];
}
