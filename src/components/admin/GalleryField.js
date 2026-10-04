"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, X } from "lucide-react";
import { Field } from "@/components/admin/form";
import { LibraryButton, UploadButton } from "@/components/admin/MediaPicker";

/** An ordered list of images, submitted as JSON in one hidden field. Reordering uses buttons, so it works by keyboard. */
export default function GalleryField({ name, label, hint, defaultValue = [], disabled = false }) {
  const [items, setItems] = useState(defaultValue);

  const add = (urls) => setItems((list) => [...list, ...urls.filter((url) => !list.includes(url))]);
  const move = (index, delta) =>
    setItems((list) => {
      const next = [...list];
      const target = index + delta;
      if (target < 0 || target >= next.length) return list;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  const remove = (index) => setItems((list) => list.filter((_, position) => position !== index));

  return (
    <Field name={name} label={label} hint={hint} optional>
      <input type="hidden" name={name} value={JSON.stringify(items)} />
      <div className="rounded-xl border border-hairline-strong p-3">
        {items.length ? (
          <ol className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
            {items.map((url, index) => (
              <li key={url} className="group relative overflow-hidden rounded-lg border border-hairline bg-navy-raised">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" loading="lazy" className="aspect-square w-full object-cover" />
                <span className="latin absolute start-1.5 top-1.5 rounded-full bg-black/70 px-2 text-xs text-white">{index + 1}</span>
                {disabled ? null : (
                  <div className="absolute inset-x-1.5 bottom-1.5 flex justify-between gap-1">
                    <div className="flex gap-1">
                      <button type="button" onClick={() => move(index, -1)} disabled={index === 0} className="rounded-md bg-black/70 p-1.5 text-white disabled:opacity-30" aria-label={`تقديم الصورة ${index + 1}`}>
                        <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                      <button type="button" onClick={() => move(index, 1)} disabled={index === items.length - 1} className="rounded-md bg-black/70 p-1.5 text-white disabled:opacity-30" aria-label={`تأخير الصورة ${index + 1}`}>
                        <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                    </div>
                    <button type="button" onClick={() => remove(index)} className="rounded-md bg-black/70 p-1.5 text-white hover:bg-error" aria-label={`إزالة الصورة ${index + 1}`}>
                      <X className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ol>
        ) : (
          <p className="py-6 text-center text-sm text-ice-faint">لا توجد صور في المعرض بعد.</p>
        )}
        {disabled ? null : (
          <div className="mt-3 flex flex-wrap gap-2 border-t border-hairline pt-3">
            <UploadButton multiple label="رفع صور" onUploaded={add} />
            <LibraryButton multiple onPick={add} />
          </div>
        )}
      </div>
    </Field>
  );
}
