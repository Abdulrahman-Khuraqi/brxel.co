import { ArrowLeft } from "lucide-react";
import Button from "@/components/ui/Button";

export const metadata = {
  title: "الصفحة غير موجودة",
};

export default function NotFound() {
  return (
    <section className="relative overflow-hidden bg-navy">
      <div className="aurora absolute inset-0" aria-hidden="true" />
      <div className="tech-grid absolute inset-0" aria-hidden="true" />

      <div className="relative mx-auto max-w-xl px-5 py-28 text-center sm:px-6 sm:py-36">
        <p className="brand-gradient-text latin text-6xl font-bold sm:text-7xl">404</p>
        <h1 className="mt-5 text-2xl font-bold leading-[1.35] text-ice sm:text-3xl">
          الصفحة التي تبحث عنها غير موجودة
        </h1>
        <p className="mt-4 text-base leading-8 text-ice-muted">
          ربما تغيّر الرابط أو حُذفت الصفحة. يمكنك العودة إلى الرئيسية أو تصفّح خدماتنا.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button href="/">
            العودة إلى الرئيسية
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          </Button>
          <Button href="/services/" variant="secondary">
            تصفّح الخدمات
          </Button>
        </div>
      </div>
    </section>
  );
}
