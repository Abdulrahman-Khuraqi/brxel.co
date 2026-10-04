"use client";

import { useRef, useState, useTransition } from "react";
import { Bold, Heading2, Heading3, ImagePlus, Italic, Link2, List, ListOrdered, Loader2, Quote } from "lucide-react";
import Markdown from "@/components/blog/Markdown";
import { Field, useFieldError } from "@/components/admin/form";
import { uploadFiles } from "@/components/admin/MediaPicker";
import { cn } from "@/lib/utils";

/** Wraps the selection, or inserts a line prefix, and keeps the caret where the writer expects it. */
function applyFormat(textarea, value, setValue, { wrap, prefix, placeholder = "" }) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selected = value.slice(start, end) || placeholder;
  let insert;
  if (wrap) insert = `${wrap[0]}${selected}${wrap[1]}`;
  else {
    const lineStart = value.lastIndexOf("\n", start - 1) + 1;
    const before = value.slice(0, lineStart);
    const lines = value.slice(lineStart, end || start).split("\n");
    const body = lines.map((line, index) => `${typeof prefix === "function" ? prefix(index) : prefix}${line || placeholder}`).join("\n");
    const next = before + body + value.slice(end);
    setValue(next);
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(before.length + body.length, before.length + body.length);
    });
    return;
  }
  const next = value.slice(0, start) + insert + value.slice(end);
  setValue(next);
  requestAnimationFrame(() => {
    textarea.focus();
    const offset = wrap ? wrap[0].length : 0;
    textarea.setSelectionRange(start + offset, start + offset + selected.length);
  });
}

const TOOLS = [
  { icon: Bold, label: "عريض", options: { wrap: ["**", "**"], placeholder: "نص عريض" } },
  { icon: Italic, label: "مائل", options: { wrap: ["_", "_"], placeholder: "نص مائل" } },
  { icon: Heading2, label: "عنوان رئيسي", options: { prefix: "## ", placeholder: "عنوان" } },
  { icon: Heading3, label: "عنوان فرعي", options: { prefix: "### ", placeholder: "عنوان فرعي" } },
  { icon: List, label: "قائمة نقطية", options: { prefix: "- ", placeholder: "عنصر" } },
  { icon: ListOrdered, label: "قائمة مرقّمة", options: { prefix: (index) => `${index + 1}. `, placeholder: "عنصر" } },
  { icon: Quote, label: "اقتباس", options: { prefix: "> ", placeholder: "اقتباس" } },
  { icon: Link2, label: "رابط", options: { wrap: ["[", "](https://)"], placeholder: "نص الرابط" } },
];

/** Markdown editor for posts: a formatting toolbar, image upload into the text, and a live preview. */
export default function MarkdownField({ name, label, defaultValue = "", disabled = false }) {
  const [value, setValue] = useState(defaultValue);
  const [tab, setTab] = useState("write");
  const [uploading, startUpload] = useTransition();
  const textareaRef = useRef(null);
  const fileRef = useRef(null);
  const error = useFieldError(name);

  const onToolClick = (event) => {
    const tool = TOOLS[Number(event.currentTarget.dataset.tool)];
    if (textareaRef.current) applyFormat(textareaRef.current, value, setValue, tool.options);
  };

  const insertImages = (event) => {
    const files = Array.from(event.target.files || []);
    event.target.value = "";
    if (!files.length) return;
    startUpload(async () => {
      const urls = await uploadFiles(files);
      if (!urls.length) return;
      const textarea = textareaRef.current;
      const at = textarea ? textarea.selectionEnd : value.length;
      const snippet = urls.map((url) => `\n![](${url})\n`).join("");
      setValue((current) => current.slice(0, at) + snippet + current.slice(at));
    });
  };

  const tabClass = (active) =>
    cn("min-h-9 rounded-lg px-3 text-sm font-semibold", active ? "bg-surface-hover text-ice" : "text-ice-faint hover:text-ice");

  return (
    <Field name={name} label={label} hint="يدعم Markdown: ## للعناوين، - للقوائم، **نص** للعريض.">
      <div className={cn("overflow-hidden rounded-xl border", error ? "border-error/60" : "border-hairline-strong")}>
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-hairline bg-surface px-2 py-1.5">
          <div className="flex gap-1" role="tablist" aria-label="وضع المحرر">
            <button type="button" role="tab" aria-selected={tab === "write"} onClick={() => setTab("write")} className={tabClass(tab === "write")}>
              كتابة
            </button>
            <button type="button" role="tab" aria-selected={tab === "preview"} onClick={() => setTab("preview")} className={tabClass(tab === "preview")}>
              معاينة
            </button>
          </div>
          {tab === "write" && !disabled ? (
            <div className="flex flex-wrap gap-0.5" role="toolbar" aria-label="تنسيق">
              {TOOLS.map(({ icon: Icon, label: toolLabel }, index) => (
                <button key={toolLabel} type="button" data-tool={index} onClick={onToolClick} title={toolLabel} aria-label={toolLabel} className="rounded-md p-2 text-ice-muted hover:bg-surface-hover hover:text-ice">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </button>
              ))}
              <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={insertImages} />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                title="إدراج صورة"
                aria-label="إدراج صورة"
                className="rounded-md p-2 text-ice-muted hover:bg-surface-hover hover:text-ice"
              >
                {uploading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <ImagePlus className="h-4 w-4" aria-hidden="true" />}
              </button>
            </div>
          ) : null}
        </div>

        <textarea
          ref={textareaRef}
          id={`f-${name}`}
          name={name}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          disabled={disabled}
          rows={22}
          aria-invalid={error ? true : undefined}
          className={cn("block w-full resize-y bg-field px-4 py-4 text-[15px] leading-8 text-ice focus:outline-none", tab !== "write" && "hidden")}
          placeholder="ابدأ الكتابة هنا…"
        />
        {tab === "preview" ? (
          <div className="min-h-[24rem] bg-void px-5 py-6">
            {value.trim() ? <Markdown>{value}</Markdown> : <p className="text-sm text-ice-faint">لا يوجد نص للمعاينة.</p>}
          </div>
        ) : null}
      </div>
    </Field>
  );
}
