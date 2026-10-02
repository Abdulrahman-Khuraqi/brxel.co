import PageHeader from "@/components/layout/PageHeader";
import ContactForm from "@/components/contact/ContactForm";
import ContactChannels from "@/components/contact/ContactChannels";
import Reveal from "@/components/ui/Reveal";

export const metadata = {
  title: "تواصل معنا",
  description:
    "أرسل تفاصيل مشروعك إلى BRXEL، ونعود إليك بنطاق عمل مكتوب وواضح خلال يوم عمل واحد.",
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="تواصل معنا"
        title="احكِ لنا عن مشروعك"
        lead="املأ النموذج بتفاصيل مشروعك، أو راسلنا مباشرة على القناة التي تناسبك."
      />

      <div className="on-light">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-16 sm:px-6 sm:py-20 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-12">
          <Reveal>
            <ContactForm />
          </Reveal>
          <Reveal delay={100}>
            <ContactChannels />
          </Reveal>
        </div>
      </div>
    </>
  );
}
