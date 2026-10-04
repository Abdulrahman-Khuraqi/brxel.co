"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { ImagePlus, Images, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { browseMedia, uploadImages } from "@/app/admin/(panel)/media/actions";
import { buttonClass } from "@/components/admin/ui";

/** Uploads files through the media action and resolves to their public URLs. */
export async function uploadFiles(fileList) {
  const data = new FormData();
  for (const file of fileList) data.append("files", file);
  const result = await uploadImages(null, data);
  if (!result?.ok) {
    toast.error(result?.error || "تعذّر رفع الصورة.");
    return [];
  }
  toast.success(result.message);
  return result.uploaded.map((item) => item.url);
}

/** An "upload" button that opens the file dialog and hands back URLs. */
export function UploadButton({ multiple = false, onUploaded, label = "رفع صورة", disabled = false }) {
  const inputRef = useRef(null);
  const [pending, startTransition] = useTransition();

  const onChange = (event) => {
    const files = Array.from(event.target.files || []);
    event.target.value = "";
    if (!files.length) return;
    startTransition(async () => {
      const urls = await uploadFiles(files);
      if (urls.length) onUploaded(urls);
    });
  };

  return (
    <>
      <input ref={inputRef} type="file" accept="image/*" multiple={multiple} hidden onChange={onChange} />
      <button type="button" disabled={disabled || pending} onClick={() => inputRef.current?.click()} className={buttonClass("secondary")}>
        {pending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <ImagePlus className="h-4 w-4" aria-hidden="true" />}
        {pending ? "جارٍ الرفع…" : label}
      </button>
    </>
  );
}

/** A dialog listing the media library; picking an image calls onPick(url). */
export function LibraryButton({ onPick, multiple = false, label = "من المكتبة", disabled = false }) {
  const dialogRef = useRef(null);
  const [state, setState] = useState({ items: [], page: 1, pages: 1 });
  const [chosen, setChosen] = useState([]);
  const [loading, startLoading] = useTransition();

  const load = (page) =>
    startLoading(async () => {
      const result = await browseMedia(page);
      if (result?.ok) setState({ items: result.items, page, pages: result.pages });
      else toast.error(result?.error || "تعذّر تحميل المكتبة.");
    });

  const open = () => {
    setChosen([]);
    dialogRef.current?.showModal();
    load(1);
  };

  const pick = (url) => {
    if (!multiple) {
      onPick([url]);
      dialogRef.current?.close();
      return;
    }
    setChosen((list) => (list.includes(url) ? list.filter((item) => item !== url) : [...list, url]));
  };

  useEffect(() => {
    const dialog = dialogRef.current;
    const onClick = (event) => {
      if (event.target === dialog) dialog.close();
    };
    dialog?.addEventListener("click", onClick);
    return () => dialog?.removeEventListener("click", onClick);
  }, []);

  return (
    <>
      <button type="button" onClick={open} disabled={disabled} className={buttonClass("secondary")}>
        <Images className="h-4 w-4" aria-hidden="true" />
        {label}
      </button>
      <dialog
        ref={dialogRef}
        dir="rtl"
        className="m-auto w-[min(56rem,calc(100vw-2rem))] rounded-2xl border border-hairline-strong bg-navy p-0 text-ice backdrop:bg-black/70"
        aria-label="مكتبة الوسائط"
      >
        <div className="flex items-center justify-between border-b border-hairline px-5 py-4">
          <p className="font-bold">مكتبة الوسائط</p>
          <button type="button" onClick={() => dialogRef.current?.close()} className={buttonClass("ghost", "min-h-9 px-2")} aria-label="إغلاق">
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto p-5">
          {loading && !state.items.length ? (
            <p className="py-10 text-center text-sm text-ice-muted">جارٍ التحميل…</p>
          ) : state.items.length ? (
            <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
              {state.items.map((item) => {
                const selected = chosen.includes(item.url);
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => pick(item.url)}
                      aria-pressed={multiple ? selected : undefined}
                      className={`block aspect-square w-full overflow-hidden rounded-xl border-2 bg-navy-raised ${selected ? "border-brand" : "border-transparent hover:border-hairline-strong"}`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.url} alt={item.alt || ""} loading="lazy" className="h-full w-full object-cover" />
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="py-10 text-center text-sm text-ice-muted">المكتبة فارغة. ارفع صورة أولًا.</p>
          )}
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-hairline px-5 py-4">
          <div className="flex items-center gap-2">
            <button type="button" disabled={state.page <= 1 || loading} onClick={() => load(state.page - 1)} className={buttonClass("ghost")}>
              السابق
            </button>
            <span className="latin text-xs text-ice-faint">
              {state.page} / {state.pages}
            </span>
            <button type="button" disabled={state.page >= state.pages || loading} onClick={() => load(state.page + 1)} className={buttonClass("ghost")}>
              التالي
            </button>
          </div>
          {multiple ? (
            <button
              type="button"
              disabled={!chosen.length}
              onClick={() => {
                onPick(chosen);
                dialogRef.current?.close();
              }}
              className={buttonClass("primary")}
            >
              إضافة {chosen.length ? <span className="latin">{chosen.length}</span> : null}
            </button>
          ) : null}
        </div>
      </dialog>
    </>
  );
}
