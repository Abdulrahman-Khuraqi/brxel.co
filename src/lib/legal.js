import policies from "@/data/policies.json";
import { brand, licence } from "@/lib/site";

export const LEGAL_UPDATED = "2026-09-29";
export const legalOrder = ["terms", "privacy", "refunds"];

/**
 * Every policy closes with the same contact block, built from the brand facts
 * so an email or phone change never has to be chased through three JSON files.
 */
const contactSection = {
  h: "التواصل",
  p: [
    `لأي استفسار بخصوص هذه السياسة، تواصل معنا عبر البريد الإلكتروني ${brand.email} أو واتساب ${brand.phone}.`,
    `${brand.name}: خدمات تصميم جرافيكي في ${brand.country}، يقدّمها الممارس الحر ${licence.holder} بوثيقة عمل حر رقم ${licence.documentId}.`,
  ],
};

export const legal = Object.fromEntries(
  legalOrder.map((slug) => [
    slug,
    {
      slug,
      ...policies[slug],
      sections: [...policies[slug].sections, contactSection],
    },
  ])
);
