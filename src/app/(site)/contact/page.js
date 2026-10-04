import PageHeader from "@/components/layout/PageHeader";
import ContactSection from "@/components/contact/ContactSection";

export const metadata = {
  title: "تواصل معنا",
  description: "أرسل تفاصيل مشروعك إلى BRXEL في ثلاث خطوات قصيرة، ونعود إليك بعرض ونطاق عمل مكتوب خلال يوم عمل واحد.",
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="تواصل معنا"
        title="احكِ لنا عن مشروعك"
        lead="ثلاث خطوات قصيرة، أو راسلنا مباشرة على القناة التي تناسبك."
      />
      <ContactSection location="contact" title="نحن نستمع" />
    </>
  );
}
