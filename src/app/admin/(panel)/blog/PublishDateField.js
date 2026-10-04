"use client";

import { useState } from "react";
import { Field } from "@/components/admin/form";

const pad = (number) => String(number).padStart(2, "0");
const toLocalInput = (value) => {
  if (!value) return "";
  const date = new Date(value);
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

/** Publish date in the writer's own time zone; submitted as UTC so the server never guesses. */
export default function PublishDateField({ defaultValue }) {
  const [local, setLocal] = useState(() => toLocalInput(defaultValue));
  const iso = local ? new Date(local).toISOString() : "";
  return (
    <Field name="publishedAt" label="تاريخ النشر" optional hint="اتركه فارغًا للنشر الآن، أو اختر موعدًا لاحقًا لجدولة المقال.">
      <input type="hidden" name="publishedAt" value={iso} />
      <input
        id="f-publishedAt"
        type="datetime-local"
        dir="ltr"
        value={local}
        onChange={(event) => setLocal(event.target.value)}
        className="min-h-11 w-full rounded-xl border border-hairline-strong bg-field px-3.5 text-sm text-ice focus:border-brand focus:outline-none"
      />
    </Field>
  );
}
