"use client";

import * as LabelPrimitive from "@radix-ui/react-label";
import { cn } from "@/lib/utils";

/** shadcn/ui Label, styled with the site tokens. */
function Label({ className, ...props }) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "flex select-none items-center gap-2 text-base font-semibold leading-7 text-ice peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

export { Label };
