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
  print: "مطبوعات",
  web: "واجهات ومواقع",
};

export const categoryOrder = ["identity", "social", "print", "web"];

/**
 * Delivered client work, in the order it is shown. Each item declares one
 * `category` from CATEGORIES; the label is resolved here so the map stays the
 * single source. An unknown category throws at build time rather than
 * rendering a blank chip.
 */
export const projects = catalog.projects.map((project) => {
  const categoryLabel = CATEGORIES[project.category];
  if (!categoryLabel) {
    throw new Error(`Project "${project.id}" has an unknown category: "${project.category}"`);
  }
  return { ...project, categoryLabel, gallery: SOCIAL_GALLERIES[project.id] || [] };
});

/** The subset the home page shows before linking through to /work/. */
export const featuredProjects = projects.filter((project) => project.featured);

export const socialProjects = projects.filter((project) => project.category === "social");

export const projectCount = projects.length;

/** Count per category, for the filter chips on /work/. */
export const categoryCounts = categoryOrder.reduce((acc, key) => {
  acc[key] = projects.filter((project) => project.category === key).length;
  return acc;
}, {});
