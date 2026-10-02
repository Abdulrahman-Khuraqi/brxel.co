import Link from "next/link";
import { FileText, ReceiptText, ShieldCheck } from "lucide-react";

const POINTS = [
  {
    icon: ReceiptText,
    title: "أسعار واضحة بالريال السعودي",
    body: "كل خدمة معروضة بسعر يبدأ منه، وتوضح بجانبه ما يشمله ذلك السعر.",
  },
  {
    icon: FileText,
    title: "السعر النهائي مكتوب قبل الدفع",
    body: "بعد فهم مشروعك نرسل عرض سعر ونطاق عمل مكتوبًا، ولا تدفع إلا بعد اعتماده.",
  },
  {
    icon: ShieldCheck,
    title: "إلغاء واسترداد واضح",
    body: "استرداد كامل قبل بدء التنفيذ، وحسب المراحل المنجزة بعده، خلال 14 يوم عمل.",
  },
];

/** How pricing and payment work, with the three policies one click away. */
export default function PricingNote() {
  return (
    <section aria-labelledby="pricing-note-title" className="rounded-2xl border border-hairline bg-surface p-6 sm:p-8">
      <h2 id="pricing-note-title" className="text-lg font-bold text-ice">
        الأسعار والدفع
      </h2>
      <ul className="mt-6 grid gap-5 sm:grid-cols-3">
        {POINTS.map(({ icon: Icon, title, body }) => (
          <li key={title}>
            <Icon className="h-5 w-5 text-brand-bright" aria-hidden="true" />
            <p className="mt-3 text-sm font-bold text-ice">{title}</p>
            <p className="mt-1.5 text-sm leading-7 text-ice-muted">{body}</p>
          </li>
        ))}
      </ul>
      <p className="mt-6 border-t border-hairline pt-5 text-xs leading-6 text-ice-faint">
        الأسعار المعروضة أسعار ابتدائية وقد تختلف حسب حجم المشروع. تُذكر أي ضريبة مستحقة نظامًا في الفاتورة. بطلبك
        للخدمة فأنت توافق على{" "}
        <Link href="/terms/" className="font-semibold text-ice underline underline-offset-4 hover:text-brand-bright">
          الشروط والأحكام
        </Link>{" "}
        و
        <Link href="/refunds/" className="font-semibold text-ice underline underline-offset-4 hover:text-brand-bright">
          سياسة الإلغاء والاسترداد
        </Link>{" "}
        و
        <Link href="/privacy/" className="font-semibold text-ice underline underline-offset-4 hover:text-brand-bright">
          سياسة الخصوصية
        </Link>
        .
      </p>
    </section>
  );
}
