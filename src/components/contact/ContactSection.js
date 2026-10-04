import { Clock, Mail, MessageCircle, Phone } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import EnquiryForm from "@/components/contact/EnquiryForm";
import { brand, contactLinks } from "@/lib/site";

const CHANNELS = [
  { icon: MessageCircle, label: "واتساب", value: brand.phone, href: contactLinks.whatsapp, external: true },
  { icon: Mail, label: "البريد الإلكتروني", value: brand.email, href: contactLinks.email },
  { icon: Phone, label: "اتصال", value: brand.phone, href: contactLinks.tel },
];

/**
 * The closing band on every main page: a short pitch and the direct channels
 * on one side, the step-by-step enquiry form on the other.
 */
export default function ContactSection({ id = "contact", location = "footer", title = "لنصنع شيئًا يُشبهك" }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="relative isolate scroll-mt-20 overflow-hidden border-t border-hairline bg-void">
      <div
        className="absolute inset-0 -z-10 bg-[radial-gradient(50%_45%_at_85%_0%,rgb(242_161_44/0.12),transparent_70%)]"
        aria-hidden="true"
      />
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
        <Reveal>
          <div className="lg:sticky lg:top-28">
            <p className="text-sm font-semibold text-brand-bright">ابدأ مشروعك</p>
            <h2 id={`${id}-title`} className="mt-3 text-[2rem] font-bold leading-[1.35] text-ice sm:text-[2.5rem]">
              {title}
            </h2>
            <p className="mt-4 max-w-md text-base leading-8 text-ice-muted">
              أجب عن ثلاثة أسئلة قصيرة، ونعود إليك خلال يوم عمل واحد بنطاق عمل مكتوب وعرض واضح.
            </p>

            <ul className="mt-9 divide-y divide-hairline border-y border-hairline">
              {CHANNELS.map(({ icon: Icon, label, value, href, external }) => (
                <li key={label}>
                  <a
                    href={href}
                    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="group flex min-h-15 items-center justify-between gap-4 py-3 transition-colors motion-reduce:transition-none"
                  >
                    <span className="flex items-center gap-3 text-sm text-ice-muted">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full border border-hairline text-ice-faint transition-colors group-hover:border-brand group-hover:text-brand-bright">
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      {label}
                    </span>
                    <span className="latin truncate text-sm font-semibold text-ice transition-colors group-hover:text-brand-bright">
                      {value}
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            <p className="mt-5 flex items-center gap-2 text-xs leading-6 text-ice-faint">
              <Clock className="h-4 w-4 shrink-0" aria-hidden="true" />
              نرد خلال يوم عمل واحد، من الأحد إلى الخميس.
            </p>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <EnquiryForm location={location} />
        </Reveal>
      </div>
    </section>
  );
}
