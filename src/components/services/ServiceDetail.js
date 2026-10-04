import { ArrowLeft, Check, Clock, Minus, RefreshCw } from "lucide-react";
import Button from "@/components/ui/Button";
import ServiceIcon from "@/components/ui/ServiceIcon";

function Meta({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-2.5 text-sm">
      <Icon className="h-4 w-4 shrink-0 text-ice-faint" aria-hidden="true" />
      <span className="text-ice-faint">{label}:</span>
      <span className="font-medium text-ice">{value}</span>
    </div>
  );
}

/** Full service entry on the services page: scope, exclusions and timeline. */
export default function ServiceDetail({ service }) {
  return (
    <article
      id={service.id}
      className="scroll-mt-28 rounded-2xl border border-hairline bg-surface p-6 sm:p-10"
    >
      <div className="grid gap-9 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-14">
        <div>
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-brand/25 bg-brand/10 text-brand-bright">
            <ServiceIcon name={service.icon} className="h-6 w-6" />
          </span>

          <h2 className="mt-5 text-xl font-bold leading-9 text-ice sm:text-2xl">{service.title}</h2>

          <p className="mt-3 text-base text-ice-muted">{service.summary}</p>

          <div className="mt-7 space-y-2.5 rounded-xl border border-hairline p-5">
            <Meta icon={Clock} label="مدة التنفيذ" value={service.timeline} />
            <Meta icon={RefreshCw} label="المراجعات" value={service.revisions} />
          </div>

          <Button href="#contact" className="mt-6 w-full sm:w-auto">
            اطلب عرض سعر
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>

        <div className="grid content-start gap-8">
          <div>
            <h3 className="text-base font-bold text-ice">تشمل الخدمة</h3>
            <ul className="mt-4 space-y-3">
              {service.deliverables.map((item) => (
                <li key={item} className="flex gap-2.5 text-sm leading-7 text-ice-muted">
                  <Check className="mt-1.5 h-4 w-4 shrink-0 text-brand-bright" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-hairline pt-7">
            <h3 className="text-base font-bold text-ice">خارج نطاق الخدمة</h3>
            <ul className="mt-4 space-y-3">
              {service.excludes.map((item) => (
                <li key={item} className="flex gap-2.5 text-sm leading-7 text-ice-faint">
                  <Minus className="mt-1.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </article>
  );
}
