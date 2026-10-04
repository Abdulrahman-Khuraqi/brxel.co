"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Field, useFieldError } from "@/components/admin/form";
import { LibraryButton, UploadButton } from "@/components/admin/MediaPicker";
import { buttonClass } from "@/components/admin/ui";

/**
 * One image (cover, thumbnail): preview, upload, pick from the library, or paste a URL.
 * `stacked` puts the preview above the controls, for narrow side columns.
 */
export default function ImageField({ name, label, defaultValue = "", hint, optional = false, aspect = "aspect-square", disabled = false, stacked = false }) {
  const [value, setValue] = useState(defaultValue);
  const error = useFieldError(name);

  return (
    <Field name={name} label={label} hint={hint} optional={optional}>
      <input type="hidden" name={name} value={value} />
      <div className={`flex flex-col gap-3 rounded-xl border p-3 ${stacked ? "" : "sm:flex-row sm:items-center"} ${error ? "border-error/60" : "border-hairline-strong"}`}>
        <div className={`relative w-full overflow-hidden rounded-lg bg-navy-raised ${stacked ? "" : "sm:w-36"} ${aspect}`}>
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <span className="absolute inset-0 flex items-center justify-center text-xs text-ice-faint">لا توجد صورة</span>
          )}
        </div>
        <div className="grid flex-1 gap-2">
          <div className="flex flex-wrap gap-2">
            <UploadButton disabled={disabled} onUploaded={([url]) => setValue(url)} />
            <LibraryButton disabled={disabled} onPick={([url]) => setValue(url)} />
            {value && !disabled ? (
              <button type="button" onClick={() => setValue("")} className={buttonClass("ghost")}>
                <Trash2 className="h-4 w-4" aria-hidden="true" />
                إزالة
              </button>
            ) : null}
          </div>
          <input
            id={`f-${name}`}
            type="text"
            dir="ltr"
            value={value}
            disabled={disabled}
            onChange={(event) => setValue(event.target.value)}
            placeholder="/uploads/… أو https://…"
            aria-label={`${label}: الرابط`}
            className="min-h-10 w-full rounded-lg border border-hairline bg-field px-3 text-xs text-ice-muted focus:border-brand focus:outline-none"
          />
        </div>
      </div>
    </Field>
  );
}
