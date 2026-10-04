import { z } from "zod";
import { brand } from "@/lib/site";
import { services } from "@/lib/services";

export const TIMELINES = ["في أقرب وقت", "خلال شهر", "من شهر إلى ثلاثة", "لم أحدد بعد"];

export const NOT_SURE = "لست متأكدًا";

/** A service title without the repeated "تصميم" prefix, so the choices scan quickly two per row. */
export const serviceOption = (service) => service.title.replace(/^تصميم\s+/, "");

export const SERVICE_OPTIONS = [...services.map(serviceOption), NOT_SURE];

export const MIN_DETAILS = 20;
export const MAX_DETAILS = 1500;

/**
 * One schema for the whole enquiry. Each step validates its own slice of it,
 * so the "next" and "submit" buttons unlock from the same rules the final
 * submission is checked against.
 */
export const enquirySchema = z.object({
  service: z.string().min(1, "اختر الخدمة التي تحتاجها."),
  timeline: z.string().optional(),
  details: z
    .string()
    .trim()
    .min(MIN_DETAILS, `اكتب ${MIN_DETAILS} حرفًا على الأقل حتى نفهم مشروعك.`)
    .max(MAX_DETAILS, `الحد الأقصى ${MAX_DETAILS} حرف.`),
  name: z.string().trim().min(2, "اكتب اسمك كما تحب أن نناديك."),
  email: z.string().trim().email("تأكد من صيغة البريد، مثل name@example.com"),
  phone: z
    .string()
    .trim()
    .refine((value) => value === "" || /^\+?[\d\s-]{8,18}$/.test(value), "أدخل رقمًا صحيحًا مع رمز الدولة، أو اتركه فارغًا."),
});

export const EMPTY_ENQUIRY = {
  service: "",
  timeline: "",
  details: "",
  name: "",
  email: "",
  phone: "",
};

/** Easy questions first, contact details last: builds momentum before asking for anything personal. */
export const STEPS = [
  { id: "service", label: "الخدمة", title: "ما الذي تحتاجه؟", fields: ["service", "timeline"] },
  { id: "project", label: "المشروع", title: "حدّثنا عن مشروعك", fields: ["details"] },
  { id: "contact", label: "بياناتك", title: "كيف نتواصل معك؟", fields: ["name", "email", "phone"] },
];

/** True when every field of the given step passes the schema. */
export function isStepValid(stepIndex, values) {
  const shape = Object.fromEntries(STEPS[stepIndex].fields.map((field) => [field, true]));
  return enquirySchema.pick(shape).safeParse(values).success;
}

/** Short, readable, unique-enough reference: BRX-YYMMDD-XXXX. */
export function createRequestId(date = new Date()) {
  const stamp = [date.getFullYear() % 100, date.getMonth() + 1, date.getDate()]
    .map((part) => String(part).padStart(2, "0"))
    .join("");
  const random = Math.random().toString(36).slice(2, 6).toUpperCase().padEnd(4, "0");
  return `BRX-${stamp}-${random}`;
}

/** Formats the enquiry as plain text for WhatsApp and email alike. */
export function buildMessage(values, requestId) {
  const lines = [`طلب خدمة جديد — ${brand.name}`, `رقم الطلب: ${requestId}`, "", `الاسم: ${values.name.trim()}`];

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

export function mailtoUrl(subject, message) {
  return `mailto:${brand.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
}

/**
 * Where submissions are POSTed as JSON. Leave unset until the mailbox / form
 * backend is ready: the thank-you page then hands the request to WhatsApp or
 * email instead, so no enquiry is ever silently lost.
 */
export const FORM_ENDPOINT = process.env.NEXT_PUBLIC_FORM_ENDPOINT || "";

const storageKey = (requestId) => `brxel:enquiry:${requestId}`;

/** Keeps the request for the thank-you page (same tab only, never sent anywhere). */
export function saveEnquiry(requestId, record) {
  try {
    window.sessionStorage.setItem(storageKey(requestId), JSON.stringify(record));
  } catch {
    // Private mode or storage disabled: the thank-you page still works without it.
  }
}

export function loadEnquiry(requestId) {
  try {
    const raw = window.sessionStorage.getItem(storageKey(requestId));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Sends the enquiry to FORM_ENDPOINT when one is configured.
 * Resolves to `true` when delivered, `false` when there is no endpoint.
 * Throws when the endpoint rejects the request, so the form can stay open.
 */
export async function submitEnquiry(values, requestId) {
  if (!FORM_ENDPOINT) return false;

  const response = await fetch(FORM_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      requestId,
      ...values,
      message: buildMessage(values, requestId),
      source: typeof window !== "undefined" ? window.location.pathname : "",
    }),
  });

  if (!response.ok) throw new Error(`Form endpoint responded ${response.status}`);
  return true;
}
