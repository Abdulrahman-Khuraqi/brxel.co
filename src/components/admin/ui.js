import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/*
 * Presentational pieces for the dashboard. No hooks, so they render on the
 * server; the interactive pieces live in form.js and the *Field components.
 */

export function PageHead({ title, description, actions, back }) {
  return (
    <div className="flex flex-col gap-4 border-b border-hairline pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {back ? (
          <Link href={back.href} className="mb-2 inline-flex items-center gap-1 text-sm text-ice-faint hover:text-brand-bright">
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
            {back.label}
          </Link>
        ) : null}
        <h1 className="text-2xl font-bold leading-10 text-ice">{title}</h1>
        {description ? <p className="mt-1 max-w-2xl text-sm leading-7 text-ice-muted">{description}</p> : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}

export function Card({ title, description, children, className = "", actions }) {
  return (
    <section className={cn("rounded-2xl border border-hairline bg-surface p-5 sm:p-6", className)}>
      {title ? (
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-ice">{title}</h2>
            {description ? <p className="mt-1 text-sm leading-6 text-ice-muted">{description}</p> : null}
          </div>
          {actions}
        </div>
      ) : null}
      {children}
    </section>
  );
}

const BADGE_TONES = {
  green: "border-success/30 bg-success/10 text-success",
  gold: "border-brand/30 bg-brand/10 text-brand-bright",
  grey: "border-hairline-strong bg-surface text-ice-muted",
  red: "border-error/30 bg-error/10 text-error",
};

export function Badge({ tone = "grey", children }) {
  return (
    <span className={cn("inline-flex items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold", BADGE_TONES[tone])}>
      {children}
    </span>
  );
}

export const STATUS_BADGE = {
  published: { tone: "green", label: "منشور" },
  draft: { tone: "grey", label: "مسودة" },
  review: { tone: "gold", label: "بانتظار المراجعة" },
  active: { tone: "green", label: "نشط" },
  disabled: { tone: "red", label: "معطّل" },
};

export function StatusBadge({ status }) {
  const badge = STATUS_BADGE[status] || { tone: "grey", label: status };
  return <Badge tone={badge.tone}>{badge.label}</Badge>;
}

export function EmptyState({ title, children, action }) {
  return (
    <div className="rounded-2xl border border-dashed border-hairline-strong p-10 text-center">
      <p className="text-base font-bold text-ice">{title}</p>
      {children ? <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-ice-muted">{children}</p> : null}
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </div>
  );
}

export function Table({ head, children }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-hairline">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead className="bg-surface text-xs text-ice-faint">
          <tr>
            {head.map((cell, index) => (
              <th key={index} scope="col" className="px-4 py-3 text-start font-semibold">
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-hairline">{children}</tbody>
      </table>
    </div>
  );
}

export function Td({ children, className = "" }) {
  return <td className={cn("px-4 py-3 align-middle text-ice-muted", className)}>{children}</td>;
}

/** Previous / next links that keep the current filters. */
export function Pagination({ page, pages, hrefFor }) {
  if (pages <= 1) return null;
  const link = "inline-flex min-h-9 items-center gap-1 rounded-lg border border-hairline px-3 text-sm text-ice-muted hover:border-brand hover:text-brand-bright";
  return (
    <nav aria-label="الصفحات" className="mt-5 flex items-center justify-center gap-3">
      {page > 1 ? (
        <Link className={link} href={hrefFor(page - 1)}>
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
          السابق
        </Link>
      ) : null}
      <span className="latin text-sm text-ice-faint">
        {page} / {pages}
      </span>
      {page < pages ? (
        <Link className={link} href={hrefFor(page + 1)}>
          التالي
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        </Link>
      ) : null}
    </nav>
  );
}

const BUTTON = {
  primary: "bg-brand text-[#150C09] font-bold hover:bg-brand-bright",
  secondary: "border border-hairline-strong bg-surface text-ice hover:border-brand hover:text-brand-bright",
  danger: "border border-error/40 text-error hover:bg-error/10",
  ghost: "text-ice-muted hover:bg-surface hover:text-ice",
};

export const buttonClass = (variant = "primary", className = "") =>
  cn(
    "inline-flex min-h-10 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none",
    BUTTON[variant],
    className
  );

export function ButtonLink({ href, variant = "primary", className = "", children }) {
  return (
    <Link href={href} className={buttonClass(variant, className)}>
      {children}
    </Link>
  );
}

/** Builds a URL with the given query values, dropping empty ones. */
export function withQuery(path, query) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) if (value !== undefined && value !== null && value !== "" && value !== 1) params.set(key, String(value));
  const text = params.toString();
  return text ? `${path}?${text}` : path;
}

/** Date and time in UTC calendar form, identical on server and client. */
export function formatDateTime(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  const pad = (number) => String(number).padStart(2, "0");
  return `${date.getUTCFullYear()}/${pad(date.getUTCMonth() + 1)}/${pad(date.getUTCDate())} ${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}`;
}
