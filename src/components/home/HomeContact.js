import Link from "next/link";
import { ArrowLeft, Mail, MessageCircle, Phone } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import { brand, contactLinks } from "@/lib/site";

/** Closing call to action: one gold panel, three direct ways to reach us, and the full brief form one click away. */
export default function HomeContact() {
  const channels = [
    { href: contactLinks.whatsapp, icon: MessageCircle, label: "واتساب", value: brand.phone, external: true, primary: true },
    { href: contactLinks.email, icon: Mail, label: "البريد", value: brand.email },
    { href: contactLinks.tel, icon: Phone, label: "اتصال", value: brand.phone },
  ];

  return (
    <section id="contact" aria-labelledby="contact-title" className="bg-void px-5 py-16 sm:px-6 sm:py-24">
      <Reveal>
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-brand px-6 py-14 text-[#150C09] sm:px-12 sm:py-20">
          <div
            className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(114deg,rgb(21_12_9/0.07)_0_1px,transparent_1px_56px)]"
            aria-hidden="true"
          />
          <div className="relative grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-end">
            <div>
              <h2 id="contact-title" className="text-[clamp(2.4rem,7vw,5rem)] font-bold leading-[1.25]">
                عندك مشروع؟
                <br />
                لنبدأ اليوم.
              </h2>
              <p className="mt-5 max-w-md text-base leading-8 text-[#150C09]/75">
                أرسل فكرتك، ونعود إليك بنطاق عمل مكتوب وواضح خلال يوم عمل واحد.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              {channels.map(({ href, icon: Icon, label, value, external, primary }) => (
                <a
                  key={label}
                  href={href}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className={`group flex min-h-16 items-center justify-between gap-4 rounded-2xl px-5 transition duration-200 motion-reduce:transition-none ${
                    primary ? "bg-[#150C09] text-[#F7F1E6] hover:bg-[#22140e]" : "bg-[#150C09]/[0.08] hover:bg-[#150C09]/[0.14]"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                    <span className="text-sm font-bold">{label}</span>
                  </span>
                  <span className="latin truncate text-sm font-semibold opacity-80">{value}</span>
                </a>
              ))}
              <Link
                href="/contact/"
                className="mt-1 inline-flex min-h-11 items-center gap-2 self-start text-sm font-bold underline decoration-[#150C09]/40 underline-offset-4 hover:decoration-[#150C09]"
              >
                أو املأ نموذج الطلب الكامل
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
