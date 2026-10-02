import { formatAmount } from "@/lib/format";
import { CURRENCY } from "@/lib/services";

/**
 * A price as the site shows it everywhere: an optional lead-in ("يبدأ من"), the amount in
 * Latin digits, the currency, and an optional note on what the amount covers.
 */
export default function Price({ amount, lead = "يبدأ من", note, size = "md", className = "" }) {
  const amountClass = { sm: "text-base", md: "text-2xl sm:text-3xl", lg: "text-4xl sm:text-5xl" }[size];

  return (
    <p className={`flex flex-wrap items-baseline gap-x-2 gap-y-1 ${className}`}>
      {lead ? <span className="text-xs font-semibold text-ice-faint">{lead}</span> : null}
      <span className={`latin font-extrabold tracking-tight text-ice ${amountClass}`}>{formatAmount(amount)}</span>
      <span className="text-sm font-bold text-brand-bright">{CURRENCY}</span>
      {note ? <span className="text-xs text-ice-muted">/ {note}</span> : null}
    </p>
  );
}
