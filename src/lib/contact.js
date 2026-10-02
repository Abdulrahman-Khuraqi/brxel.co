import { brand } from "@/lib/site";
import { services } from "@/lib/services";

export const TIMELINES = [
  "في أقرب وقت ممكن",
  "خلال شهر",
  "خلال شهر إلى ثلاثة أشهر",
  "خلال أكثر من ثلاثة أشهر",
  "لم أحدد بعد",
];

export const SERVICE_OPTIONS = [
  ...services.map((service) => service.title),
  "باقة من الباقات",
  "غير متأكد — أحتاج استشارة",
];

export const EMPTY_FORM = {
  name: "",
  company: "",
  email: "",
  phone: "",
  service: "",
  timeline: "",
  details: "",
  consent: false,
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MIN_DETAILS = 20;

/**
 * Validates the enquiry form.
 *
 * Returns a map of field name to Arabic message; an empty object means valid.
 */
export function validate(values) {
  const errors = {};

  if (values.name.trim().length < 2) {
    errors.name = "اكتب اسمك كاملًا.";
  }

  if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = "أدخل بريدًا إلكترونيًا صحيحًا.";
  }

  // Optional, but if given it has to look like a phone number.
  if (values.phone.trim() && !/^[+\d][\d\s-]{7,}$/.test(values.phone.trim())) {
    errors.phone = "أدخل رقم جوال صحيحًا، أو اترك الحقل فارغًا.";
  }

  if (!values.service) {
    errors.service = "اختر الخدمة المطلوبة.";
  }

  if (values.details.trim().length < MIN_DETAILS) {
    errors.details = `اشرح مشروعك في ${MIN_DETAILS} حرفًا على الأقل.`;
  }

  if (!values.consent) {
    errors.consent = "يلزم الموافقة على سياسة الخصوصية للمتابعة.";
  }

  return errors;
}

/** Formats the enquiry as plain text for WhatsApp and email alike. */
export function buildMessage(values) {
  const lines = [
    `طلب خدمة جديد — ${brand.name}`,
    "",
    `الاسم: ${values.name.trim()}`,
  ];

  if (values.company.trim()) lines.push(`المنشأة: ${values.company.trim()}`);

  lines.push(`البريد الإلكتروني: ${values.email.trim()}`);

  if (values.phone.trim()) lines.push(`رقم الجوال: ${values.phone.trim()}`);

  lines.push("", `الخدمة المطلوبة: ${values.service}`);

  if (values.timeline) lines.push(`الإطار الزمني: ${values.timeline}`);

  lines.push("", "تفاصيل المشروع:", values.details.trim());

  return lines.join("\n");
}

export function whatsappUrl(message) {
  return `https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function mailtoUrl(values, message) {
  const subject = `طلب خدمة: ${values.service} — ${values.name.trim()}`;
  return `mailto:${brand.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
}
