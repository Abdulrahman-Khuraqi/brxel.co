import { Clock, Mail, MessageCircle, Phone } from "lucide-react";
import { brand, contactLinks } from "@/lib/site";

const CHANNELS = [
  { icon: MessageCircle, label: "واتساب", value: brand.phone, href: contactLinks.whatsapp, external: true },
  { icon: Mail, label: "البريد الإلكتروني", value: brand.email, href: contactLinks.email, external: false },
  { icon: Phone, label: "الهاتف", value: brand.phone, href: contactLinks.tel, external: false },
];

const NEXT_STEPS = [
  "نراجع طلبك ونرد عليك خلال يوم عمل واحد.",
  "نتفق على المتطلبات في مكالمة أو محادثة قصيرة.",
  "نرسل لك نطاق عمل مكتوب بالمخرجات والمدة لاعتماده.",
];

/** Direct contact channels and expectations, shown beside the enquiry form. */
export default function ContactChannels() {
  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-hairline bg-surface p-6">
        <h2 className="text-base font-bold text-ice">قنوات التواصل المباشر</h2>
        <ul className="mt-4 space-y-1">
          {CHANNELS.map(({ icon: Icon, label, value, href, external }) => (
            <li key={label}>
              <a
                href={href}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="flex min-h-11 items-center gap-3 rounded-lg text-sm text-ice-muted transition hover:text-brand-bright motion-reduce:transition-none"
              >
                <Icon className="h-4 w-4 shrink-0 text-ice-faint" aria-hidden="true" />
                <span className="text-ice-faint">{label}:</span>
                <span className="latin min-w-0 break-all font-medium">{value}</span>
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-4 flex items-center gap-2.5 border-t border-hairline pt-4 text-xs leading-6 text-ice-faint">
          <Clock className="h-4 w-4 shrink-0" aria-hidden="true" />
          الأحد إلى الخميس، 9 صباحًا – 6 مساءً بتوقيت السعودية.
        </p>
      </section>

      <section className="rounded-2xl border border-hairline bg-surface p-6">
        <h2 className="text-base font-bold text-ice">ماذا يحدث بعد الإرسال؟</h2>
        <ol className="mt-4 space-y-4">
          {NEXT_STEPS.map((step, index) => (
            <li key={step} className="flex gap-3 text-sm leading-7 text-ice-muted">
              <span
                className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-brand/30 bg-brand/10 text-xs font-bold text-brand-bright"
                aria-hidden="true"
              >
                {index + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
