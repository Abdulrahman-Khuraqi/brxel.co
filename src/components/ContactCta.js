import { ArrowLeft, Mail, MessageCircle } from "lucide-react";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import { brand, contactLinks } from "@/lib/site";

/** Closing call to action, shared by the home, services and about pages. */
export default function ContactCta() {
  return (
    <section className="relative overflow-hidden border-t border-hairline bg-navy">
      <div className="aurora absolute inset-0" aria-hidden="true" />

      <div className="relative mx-auto max-w-3xl px-5 py-20 text-center sm:px-6 sm:py-28">
        <Reveal>
          <h2 className="text-2xl font-bold leading-[1.35] tracking-tight text-ice sm:text-4xl">
            جاهز تبدأ مشروعك؟
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-8 text-ice-muted">
            أرسل لنا تفاصيل مشروعك، ونعود إليك بنطاق عمل مكتوب وواضح خلال يوم عمل واحد.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Button href="/contact/">
              افتح نموذج الطلب
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button href={contactLinks.whatsapp} external variant="secondary">
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              واتساب
            </Button>
          </div>

          <a
            href={contactLinks.email}
            className="mt-8 inline-flex min-h-11 items-center gap-2.5 rounded-lg text-sm text-ice-muted transition hover:text-brand-bright motion-reduce:transition-none"
          >
            <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="latin">{brand.email}</span>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
