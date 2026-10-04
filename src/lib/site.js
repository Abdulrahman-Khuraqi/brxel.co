// Single source of truth for BRXEL brand, business and contact facts.
// Nothing in the UI should hard-code any of these values.

export const brand = {
  name: "BRXEL",
  nameAr: "بركسل",
  legalName: "BRXEL",
  owner: "BRXEL",
  tagline: "DESIGN THAT SHIPS.",
  shortPitch:
    "استوديو تصميم جرافيكي: هوية بصرية، سوشيال ميديا، مطبوعات، وواجهات مواقع ومتاجر سلة وزد، بنطاق عمل واضح ومخرجات محددة.",
  domain: "brxel.co",
  email: "hello@brxel.co",
  /** Display form, written left to right. */
  phone: "+963 941 581 406",
  /** International form without "+", used for wa.me and tel: links. */
  whatsapp: "963941581406",
};

/** Canonical origin for metadata, sitemaps and structured data. */
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || `https://${brand.domain}`;

export const contactLinks = {
  whatsapp: `https://wa.me/${brand.whatsapp}`,
  email: `mailto:${brand.email}`,
  tel: `tel:+${brand.whatsapp}`,
};

export const nav = [
  { href: "/", label: "الرئيسية" },
  { href: "/services/", label: "الخدمات" },
  { href: "/work/", label: "أعمالنا" },
  { href: "/blog/", label: "المدونة" },
  { href: "/about/", label: "من نحن" },
  { href: "/contact/", label: "تواصل" },
];

export const navEn = [
  { href: "/en/", label: "Home" },
  { href: "/en/services/", label: "Services" },
  { href: "/en/work/", label: "Work" },
  { href: "/en/about/", label: "About" },
  { href: "/en/contact/", label: "Contact" },
];

export const englishPath = (pathname) => {
  if (pathname === "/") return "/en/";
  return `/en${pathname}`.replace(/\/+/g, "/");
};

export const arabicPath = (pathname) => {
  const path = pathname.replace(/^\/en(?=\/|$)/, "");
  return path || "/";
};
