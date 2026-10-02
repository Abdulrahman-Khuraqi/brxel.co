import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ServiceIcon from "@/components/ui/ServiceIcon";

/** Editorial service tile used in the asymmetric home-page service catalogue. */
export default function ServiceCard({ service, index = 0, featured = false }) {
  const serviceNumber = String(index + 1).padStart(2, "0");

  return (
    <article
      className={`card-hover group relative flex h-full min-h-[22rem] flex-col overflow-hidden rounded-3xl border p-6 sm:p-7 ${
        featured
          ? "service-card-featured border-transparent"
          : "border-hairline bg-surface shadow-card"
      }`}
    >
      <div className="flex items-start justify-between gap-5">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-brand/25 bg-brand/10 text-brand-bright">
            <ServiceIcon name={service.icon} className="h-5 w-5" />
          </span>
          <span className="latin text-xs font-semibold tracking-[0.18em] text-ice-faint" aria-hidden="true">
            {serviceNumber}
          </span>
        </div>

      </div>

      <h3 className={`mt-8 font-bold leading-[1.45] text-ice ${featured ? "text-2xl sm:text-3xl" : "text-xl"}`}>
        {service.title}
      </h3>
      <p className={`mt-3 leading-7 text-ice-muted ${featured ? "max-w-xl text-base" : "text-sm"}`}>
        {service.summary}
      </p>

      <ul className="mt-6 flex flex-wrap gap-2" aria-label="يشمل نطاق الخدمة">
        {service.tags.map((tag) => (
          <li
            key={tag}
            className="rounded-full border border-hairline bg-surface px-3 py-1.5 text-[11px] font-medium text-ice-muted"
          >
            {tag}
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-7">
        <Link
          href={`/services/#${service.id}`}
          className="inline-flex min-h-11 w-full items-center justify-between gap-3 border-t border-hairline pt-5 text-sm font-semibold text-ice transition-colors duration-200 hover:text-brand-bright motion-reduce:transition-none"
        >
          <span>التفاصيل ونطاق الخدمة</span>
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-hairline bg-surface transition-transform duration-200 group-hover:-translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          </span>
        </Link>
      </div>
    </article>
  );
}
