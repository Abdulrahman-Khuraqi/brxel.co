/*
 * Portfolio ordering, shared by the server and the browser. The projects
 * themselves live in the database (see src/server/content/portfolio.js);
 * this module only knows how to arrange a list of them.
 */

/** Portfolio categories, in the order the filter and the grid present them. */
export const CATEGORIES = {
  identity: "هوية بصرية",
  social: "سوشيال ميديا",
  web: "واجهات ومواقع",
  print: "مطبوعات",
};

export const categoryOrder = ["identity", "social", "web", "print"];

/** How much there is to see: a full gallery or a live site beats a single cover. */
const depth = (project) => project.gallery.length + (project.link ? 5 : 0);

/**
 * Order inside a category: featured work first, then the projects with the
 * most to show, then the manual order set in the dashboard.
 */
const byStrength = (a, b) =>
  Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || depth(b) - depth(a) || a.order - b.order;

/** Takes one from each list in turn, so a mixed view never shows a run of the same discipline. */
function interleave(lists) {
  const result = [];
  const longest = Math.max(0, ...lists.map((list) => list.length));
  for (let index = 0; index < longest; index += 1) {
    lists.forEach((list) => {
      if (list[index]) result.push(list[index]);
    });
  }
  return result;
}

/**
 * Turns a flat list of published projects into every view the site needs.
 * Each project: { id, title, titleLatin, sector, category, summary, image, link, featured, order, gallery }.
 */
export function arrangePortfolio(list) {
  const known = list
    .filter((project) => CATEGORIES[project.category])
    .map((project) => ({ ...project, categoryLabel: CATEGORIES[project.category] }));

  const projectsByCategory = Object.fromEntries(
    categoryOrder.map((key) => [key, known.filter((project) => project.category === key).sort(byStrength)])
  );
  const projects = interleave(categoryOrder.map((key) => projectsByCategory[key]));

  return {
    projects,
    projectsByCategory,
    featuredProjects: interleave(categoryOrder.map((key) => projectsByCategory[key].filter((project) => project.featured))),
    socialProjects: projectsByCategory.social,
    projectCount: projects.length,
    categoryCounts: Object.fromEntries(categoryOrder.map((key) => [key, projectsByCategory[key].length])),
  };
}
