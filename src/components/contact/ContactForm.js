"use client";

import Link from "next/link";
import { useId, useRef, useState } from "react";
import { AlertCircle, CheckCircle2, Mail, MessageCircle } from "lucide-react";
import Button from "@/components/ui/Button";
import {
  EMPTY_FORM,
  SERVICE_OPTIONS,
  TIMELINES,
  buildMessage,
  mailtoUrl,
  validate,
  whatsappUrl,
} from "@/lib/contact";

function Field({ id, label, error, required, hint, children }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-ice">
        {label}
        {required ? (
          <span className="text-brand-bright" aria-hidden="true">
            {" "}
            *
          </span>
        ) : (
          <span className="text-ice-faint"> (اختياري)</span>
        )}
      </label>
      <div className="mt-2">{children}</div>
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-2 flex items-center gap-1.5 text-xs text-red-400">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-2 text-xs text-ice-faint">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export default function ContactForm() {
  const uid = useId();
  const formRef = useRef(null);
  const [values, setValues] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [sentVia, setSentVia] = useState(null);

  const fieldId = (name) => `${uid}-${name}`;

  const update = (name) => (event) => {
    const { type, checked, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    // Clear the error as soon as the visitor starts fixing the field.
    setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));
  };

  /**
   * There is no server behind this static site, so a valid enquiry is formatted
   * as plain text and handed to WhatsApp or the visitor's mail client.
   */
  const submit = (channel) => (event) => {
    event.preventDefault();

    const found = validate(values);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      const firstInvalid = formRef.current?.querySelector("[aria-invalid='true']");
      firstInvalid?.focus();
      return;
    }

    const message = buildMessage(values);
    const url = channel === "whatsapp" ? whatsappUrl(message) : mailtoUrl(values, message);

    if (channel === "whatsapp") {
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      window.location.href = url;
    }

    setErrors({});
    setSentVia(channel);
  };

  const inputProps = (name) => ({
    id: fieldId(name),
    name,
    value: values[name],
    onChange: update(name),
    className: "field",
    "aria-invalid": errors[name] ? "true" : undefined,
    "aria-describedby": errors[name] ? `${fieldId(name)}-error` : undefined,
  });

  if (sentVia) {
    return (
      <div className="rounded-2xl border border-brand/30 bg-brand/10 p-8 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-brand-bright" aria-hidden="true" strokeWidth={1.5} />
        <h2 className="mt-4 text-lg font-bold text-ice">تم تجهيز طلبك</h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-ice-muted">
          {sentVia === "whatsapp"
            ? "فتحنا محادثة واتساب تحتوي على تفاصيل طلبك. أرسل الرسالة لتصلنا، وسنرد عليك خلال يوم عمل واحد."
            : "فتحنا برنامج البريد لديك برسالة تحتوي على تفاصيل طلبك. أرسل الرسالة لتصلنا، وسنرد عليك خلال يوم عمل واحد."}
        </p>
        <button
          type="button"
          onClick={() => {
            setValues(EMPTY_FORM);
            setSentVia(null);
          }}
          className="mt-6 min-h-11 rounded-xl border border-hairline-strong px-5 text-sm font-semibold text-ice transition hover:border-brand hover:text-brand-bright motion-reduce:transition-none"
        >
          إرسال طلب آخر
        </button>
      </div>
    );
  }

  return (
    <form ref={formRef} noValidate className="rounded-2xl border border-hairline bg-surface p-6 sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id={fieldId("name")} label="الاسم" error={errors.name} required>
          <input type="text" autoComplete="name" placeholder="محمد عبدالله" {...inputProps("name")} />
        </Field>

        <Field id={fieldId("company")} label="اسم المنشأة" error={errors.company}>
          <input type="text" autoComplete="organization" placeholder="اسم شركتك أو نشاطك" {...inputProps("company")} />
        </Field>

        <Field id={fieldId("email")} label="البريد الإلكتروني" error={errors.email} required>
          <input
            type="email"
            inputMode="email"
            autoComplete="email"
            dir="ltr"
            placeholder="you@example.com"
            {...inputProps("email")}
          />
        </Field>

        <Field id={fieldId("phone")} label="رقم الجوال" error={errors.phone}>
          <input
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            dir="ltr"
            placeholder="05XXXXXXXX"
            {...inputProps("phone")}
          />
        </Field>

        <Field id={fieldId("service")} label="الخدمة المطلوبة" error={errors.service} required>
          <select {...inputProps("service")}>
            <option value="">اختر الخدمة…</option>
            {SERVICE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </Field>

        <div>
          <Field id={fieldId("timeline")} label="الإطار الزمني" error={errors.timeline}>
            <select {...inputProps("timeline")}>
              <option value="">اختر الإطار الزمني…</option>
              {TIMELINES.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div className="sm:col-span-2">
          <Field
            id={fieldId("details")}
            label="تفاصيل المشروع"
            error={errors.details}
            required
            hint="اذكر نوع العلامة، وما تحتاج تصميمه، وأي مراجع بصرية أو روابط تفيدنا."
          >
            <textarea
              rows={6}
              placeholder="أطلق علامة قهوة جديدة وأحتاج شعارًا وهوية بصرية وقوالب سوشيال ميديا…"
              {...inputProps("details")}
            />
          </Field>
        </div>
      </div>

      <div className="mt-6 border-t border-hairline pt-6">
        <label htmlFor={fieldId("consent")} className="flex cursor-pointer items-start gap-3 text-sm leading-7 text-ice-muted">
          <input
            type="checkbox"
            id={fieldId("consent")}
            name="consent"
            checked={values.consent}
            onChange={update("consent")}
            aria-invalid={errors.consent ? "true" : undefined}
            aria-describedby={errors.consent ? `${fieldId("consent")}-error` : undefined}
            className="mt-1.5 h-4 w-4 shrink-0 accent-[#f2a12c]"
          />
          <span>
            أوافق على معالجة بياناتي للرد على طلبي وفق{" "}
            <Link href="/privacy/" className="font-medium text-brand-bright underline underline-offset-4">
              سياسة الخصوصية
            </Link>
            .
          </span>
        </label>
        {errors.consent ? (
          <p
            id={`${fieldId("consent")}-error`}
            role="alert"
            className="mt-2 flex items-center gap-1.5 text-xs text-red-400"
          >
            <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            {errors.consent}
          </p>
        ) : null}
      </div>

      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <Button onClick={submit("whatsapp")} className="flex-1">
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
          إرسال عبر واتساب
        </Button>
        <Button onClick={submit("email")} variant="secondary" className="flex-1">
          <Mail className="h-4 w-4" aria-hidden="true" />
          إرسال عبر البريد
        </Button>
      </div>

      <p className="mt-4 text-xs leading-6 text-ice-faint">
        نراجع طلبك ونعود إليك بنطاق عمل مكتوب وواضح قبل أي التزام.
      </p>
    </form>
  );
}
