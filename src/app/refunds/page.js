import LegalPage from "@/components/legal/LegalPage";
import { legal } from "@/lib/legal";

export const metadata = {
  title: legal.refunds.title,
  description:
    "سياسة الإلغاء والاسترداد في BRXEL: متى يحق لك الإلغاء، كيف يُحتسب المبلغ المسترد، مدة المعالجة، وحالات لا يشملها الاسترداد.",
};

export default function RefundsPage() {
  return <LegalPage slug="refunds" />;
}
