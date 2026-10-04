"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { ActionForm, SubmitButton, useFieldError } from "@/components/admin/form";
import { buttonClass } from "@/components/admin/ui";

const input = "min-h-11 w-full rounded-xl border border-hairline-strong bg-field px-3.5 text-sm text-ice focus:border-brand focus:outline-none";

function RowError({ index }) {
  const value = useFieldError(`${index}.value`);
  const label = useFieldError(`${index}.label`);
  return value || label ? <p className="text-xs text-error">{value || label}</p> : null;
}

function Rows({ rows, setRows }) {
  const listError = useFieldError("");
  const update = (index, key, value) => setRows((list) => list.map((row, position) => (position === index ? { ...row, [key]: value } : row)));
  return (
    <>
      <input type="hidden" name="stats" value={JSON.stringify(rows)} />
      <ol className="grid gap-3">
        {rows.map((row, index) => (
          <li key={index} className="grid gap-1.5">
            <div className="flex items-center gap-2">
              <span className="latin w-6 text-center text-sm text-ice-faint">{index + 1}</span>
              <input value={row.value} onChange={(event) => update(index, "value", event.target.value)} dir="ltr" placeholder="+1000" aria-label={`الرقم ${index + 1}`} className={`${input} latin max-w-32 text-center font-bold`} maxLength={12} />
              <input value={row.label} onChange={(event) => update(index, "label", event.target.value)} placeholder="مشروع مُنجز" aria-label={`وصف الرقم ${index + 1}`} className={input} maxLength={40} />
              <button type="button" onClick={() => setRows((list) => list.filter((_, position) => position !== index))} disabled={rows.length <= 1} className={buttonClass("ghost", "px-2")} aria-label={`حذف الرقم ${index + 1}`}>
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            <RowError index={index} />
          </li>
        ))}
      </ol>
      {listError ? <p className="text-xs text-error">{listError}</p> : null}
    </>
  );
}

/** The hero numbers: up to four rows of value + label, saved together. */
export default function StatsForm({ action, defaultValue }) {
  const [rows, setRows] = useState(defaultValue);
  return (
    <ActionForm action={action} className="grid gap-4">
      <Rows rows={rows} setRows={setRows} />
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-hairline pt-4">
        <button type="button" onClick={() => setRows((list) => [...list, { value: "", label: "" }])} disabled={rows.length >= 4} className={buttonClass("secondary")}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          إضافة رقم
        </button>
        <SubmitButton>حفظ ونشر</SubmitButton>
      </div>
    </ActionForm>
  );
}
