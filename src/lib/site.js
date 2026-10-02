// Single source of truth for BRXEL brand, business and contact facts.
// Nothing in the UI should hard-code any of these values.

export const brand = {
  name: "BRXEL",
  nameAr: "بركسل",
  legalName: "BRXEL",
  owner: "BRXEL",
  tagline: "DESIGN THAT SHIPS.",
  shortPitch:
    "خدمات تصميم جرافيكي: هوية بصرية، سوشيال ميديا، مطبوعات، ومواقع إلكترونية، بنطاق عمل واضح ومخرجات محددة.",
  email: "shoate2013@gmail.com",
  phone: "0533036414",
  /** International form without "+", used for wa.me links. */
  whatsapp: "966533036414",
  country: "المملكة العربية السعودية",
  city: "المملكة العربية السعودية",
};

/**
 * Freelance practitioner licence issued by the Ministry of Human Resources and
 * Social Development: the official registration to practise graphic
 * design. Replaces the commercial-register / VAT block of the old business.
 * The holder's national ID is on the certificate but deliberately not published.
 */
export const licence = {
  holder: "سعيد مشبب محمد القحطاني",
  holderEn: "Saeed Mushabbab Mohammed Alqahtani",
  documentId: "FL-705484607",
  category: "الخدمات التخصصية",
  speciality: "تصميم الجرافيك",
  issuer: "وزارة الموارد البشرية والتنمية الاجتماعية",
  issued: "2026-09-24",
  expires: "2027-09-24",
  /** Public copy of the certificate, national ID redacted. */
  file: "/docs/artxel-freelance-certificate.pdf",
};

export const contactLinks = {
  whatsapp: `https://wa.me/${brand.whatsapp}`,
  email: `mailto:${brand.email}`,
  tel: `tel:+${brand.whatsapp}`,
};

export const nav = [
  { href: "/", label: "الرئيسية" },
  { href: "/services/", label: "الخدمات" },
  { href: "/work/", label: "أعمالنا" },
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
