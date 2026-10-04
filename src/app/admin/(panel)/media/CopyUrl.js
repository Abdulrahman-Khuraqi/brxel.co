"use client";

import { Copy } from "lucide-react";
import { toast } from "sonner";

export default function CopyUrl({ url }) {
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("نُسخ الرابط.");
    } catch {
      toast.error("تعذّر النسخ.");
    }
  };
  return (
    <button type="button" onClick={copy} className="rounded-md p-1.5 text-ice-faint hover:bg-surface-hover hover:text-ice" aria-label="نسخ الرابط" title="نسخ الرابط">
      <Copy className="h-3.5 w-3.5" aria-hidden="true" />
    </button>
  );
}
