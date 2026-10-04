import catalog from "@/data/projects.json";

const numberedGallery = (id, count, extension = "webp") =>
  Array.from(
    { length: count },
    (_, index) => `/work/social/gallery/${id}/${String(index + 1).padStart(2, "0")}.${extension}`
  );

/** Every delivered social post, kept separate from the compact cover image. */
const SOCIAL_GALLERIES = {
  chocosarayi: numberedGallery("chocosarayi", 12),
  alrreesha: numberedGallery("alrreesha", 11),
  rino: numberedGallery("rino", 8),
  ec: numberedGallery("ec", 9),
  mshwar: [
    ...numberedGallery("mshwar", 10),
    "/work/social/gallery/mshwar/12.jpg",
    "/work/social/gallery/mshwar/13.jpg",
  ],
  pegas: numberedGallery("pegas", 17),
  awael: numberedGallery("awael", 19),
  saed: numberedGallery("saed", 10),
  "rose-dental": ["/work/social/gallery/rose-dental/01.jpg"],
};

/** Portfolio categories, in the order the filter and the grid present them. */
export const CATEGORIES = {
  identity: "هوية بصرية",
  social: "سوشيال ميديا",
  web: "واجهات ومواقع",
  print: "مطبوعات",
};

export const categoryOrder = ["identity", "social", "web", "print"];

/**
 * Delivered client work. Each item declares one `category` from CATEGORIES;
 * the label is resolved here so the map stays the single source. An unknown
 * category throws at build time rather than rendering a blank chip.
 */
const allProjects = catalog.projects.map((project, order) => {
  const categoryLabel = CATEGORIES[project.category];
  if (!categoryLabel) {
    throw new Error(`Project "${project.id}" has an unknown category: "${project.category}"`);
  }
  return { ...project, order, categoryLabel, gallery: SOCIAL_GALLERIES[project.id] || [] };
});

/** How much there is to see: a full gallery or a live site beats a single cover. */
const depth = (project) => project.gallery.length + (project.link ? 5 : 0);

/**
 * Order inside a category: featured work first, then the projects with the
 * most to show, then the order of the JSON file. Adding a project never needs
 * a manual re-shuffle — flag it `featured` to lift it to the top.
 */
const byStrength = (a, b) =>
  Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || depth(b) - depth(a) || a.order - b.order;

export const projectsByCategory = Object.fromEntries(
  categoryOrder.map((key) => [key, allProjects.filter((project) => project.category === key).sort(byStrength)])
);

/** Takes one from each list in turn, so a mixed view never shows a run of the same discipline. */
function interleave(lists) {
  const result = [];
  const longest = Math.max(...lists.map((list) => list.length));
  for (let index = 0; index < longest; index += 1) {
    lists.forEach((list) => {
      if (list[index]) result.push(list[index]);
    });
  }
  return result;
}

/** Every project, best first and mixed across disciplines: the "all" view on /work/. */
export const projects = interleave(categoryOrder.map((key) => projectsByCategory[key]));

/** The featured subset, mixed the same way, for the home page. */
export const featuredProjects = interleave(
  categoryOrder.map((key) => projectsByCategory[key].filter((project) => project.featured))
);

export const socialProjects = projectsByCategory.social;

export const projectCount = projects.length;

/** Count per category, for the filter chips on /work/. */
export const categoryCounts = Object.fromEntries(categoryOrder.map((key) => [key, projectsByCategory[key].length]));
