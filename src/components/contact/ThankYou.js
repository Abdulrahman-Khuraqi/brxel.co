"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Check, Copy, Mail, MessageCircle } from "lucide-react";
import { pushDataLayer } from "@/lib/analytics";
import { mailtoUrl, parseEnquiry, readEnquiry, whatsappUrl } from "@/lib/contact";
import { brand, contactLinks } from "@/lib/site";

const ID_PATTERN = /^BRX-\d{6}-[A-Z0-9]{4}$/;

const NEXT_STEPS = [
  { title: "نراجع طلبك", body: "نقرأ تفاصيل مشروعك ونجهّز أسئلتنا." },
  { title: "نتواصل معك", body: "خلال يوم عمل واحد عبر البريد أو واتساب." },
  { title: "نرسل عرضك", body: "نطاق عمل مكتوب بالمخرجات والمدة والتكلفة." },
];

/** The stored request never changes while the page is open. */
const subscribeNever = () => () => {};

export default function ThankYou() {
  const params = useSearchParams();
  const rawId = (params.get("id") || "").toUpperCase();
  const requestId = ID_PATTERN.test(rawId) ? rawId : "";
  // sessionStorage only exists in the browser; the server render sees no stored request.
  const rawEnquiry = useSyncExternalStore(
    subscribeNever,
    () => (requestId ? readEnquiry(requestId) : null),
    () => null
  );
  const enquiry = useMemo(() => parseEnquiry(rawEnquiry), [rawEnquiry]);
  const [copied, setCopied] = useState(false);
  const tracked = useRef(false);

  useEffect(() => {
    if (!requestId || tracked.current) return;
    tracked.current = true;
    pushDataLayer("thank_you_view", { form_id: "brxel_enquiry", request_id: requestId });
  }, [requestId]);

  // Not delivered to a backend yet: the visitor sends the prepared message themselves.
  const needsHandoff = Boolean(enquiry && !enquiry.delivered);
  const firstName = enquiry?.name?.split(/\s+/)[0];
  const followUp = enquiry?.message || (requestId ? `مرحبًا، أتابع طلبي رقم ${requestId}` : "مرحبًا، أرغب في طلب خدمة تصميم.");

  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(requestId);
      setCopied(true);
      toast.success("تم نسخ رقم الطلب");
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("تعذّر النسخ، انسخ الرقم يدويًا.");
    }
  };

  return (
    <section className="relative isolate overflow-hidden bg-void">
      <div
        className="absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,rgb(242_161_44/0.16),transparent_70%)]"
        aria-hidden="true"
      />
      <div className="mx-auto max-w-2xl px-5 py-20 text-center sm:px-8 sm:py-28">
        <span className="success-pop mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand text-[#150C09] shadow-[0_20px_50px_-20px_rgb(242_161_44/0.8)]">
          <Check className="h-10 w-10" strokeWidth={2.75} aria-hidden="true" />
        </span>

        <h1 className="mt-8 text-h1 font-bold text-ice">
          {needsHandoff ? "طلبك جاهز" : "شكرًا لك"}
          {firstName ? `، ${firstName}` : ""}!
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-lead text-ice-muted">
          {needsHandoff
            ? "خطوة أخيرة: أرسل الطلب عبر واتساب أو البريد ليصلنا فورًا، وسنعود إليك خلال يوم عمل واحد."
            : "تم استلام طلبك بنجاح ✅ وسنعود إليك خلال يوم عمل واحد بنطاق عمل مكتوب وواضح."}
        </p>

        {requestId ? (
          <div className="mx-auto mt-9 flex max-w-sm items-center justify-between gap-3 rounded-2xl border border-hairline-strong bg-surface p-2 ps-5">
            <div className="text-start">
              <p className="text-xs font-semibold text-ice-faint">رقم الطلب</p>
              <p className="latin mt-0.5 text-xl font-bold tracking-wide text-ice">{requestId}</p>
            </div>
            <button
              type="button"
              onClick={copyId}
              className="inline-flex min-h-11 items-center gap-2 rounded-xl px-4 text-sm font-semibold text-ice-muted transition hover:bg-surface-hover hover:text-ice motion-reduce:transition-none"
            >
              {copied ? <Check className="h-4 w-4 text-success" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
              {copied ? "تم النسخ" : "نسخ"}
            </button>
          </div>
        ) : null}

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href={whatsappUrl(followUp)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => pushDataLayer("contact_click", { channel: "whatsapp", request_id: requestId || undefined })}
            className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-brand px-6 text-base font-bold text-[#150C09] transition hover:bg-brand-bright motion-reduce:transition-none"
          >
            <MessageCircle className="h-5 w-5" aria-hidden="true" />
            {needsHandoff ? "أرسل الطلب عبر واتساب" : "تابع معنا على واتساب"}
          </a>
          {needsHandoff ? (
            <a
              href={mailtoUrl(`طلب خدمة ${requestId}: ${enquiry.service}`, followUp)}
              onClick={() => pushDataLayer("contact_click", { channel: "email", request_id: requestId || undefined })}
              className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-hairline-strong px-6 text-sm font-semibold text-ice transition hover:border-brand hover:text-brand-bright motion-reduce:transition-none"
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
              أو عبر البريد
            </a>
          ) : (
            <Link
              href="/work/"
              className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-hairline-strong px-6 text-sm font-semibold text-ice transition hover:border-brand hover:text-brand-bright motion-reduce:transition-none"
            >
              تصفّح أعمالنا
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            </Link>
          )}
        </div>

        <ol className="mt-14 grid gap-3 text-start sm:grid-cols-3">
          {NEXT_STEPS.map((item, index) => (
            <li key={item.title} className="rounded-2xl border border-hairline bg-surface p-5">
              <span className="latin text-xs font-bold text-brand-bright">{String(index + 1).padStart(2, "0")}</span>
              <p className="mt-2 text-base font-bold text-ice">{item.title}</p>
              <p className="mt-1 text-sm text-ice-muted">{item.body}</p>
            </li>
          ))}
        </ol>

        <p className="mt-10 text-sm text-ice-faint">
          لأي استفسار:{" "}
          <a href={contactLinks.email} className="latin font-semibold text-ice-muted hover:text-brand-bright">
            {brand.email}
          </a>
        </p>
        <Link href="/" className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-ice-muted hover:text-brand-bright">
          العودة إلى الرئيسية
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
