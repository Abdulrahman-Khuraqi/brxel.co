import LegalPage from "@/components/legal/LegalPage";
import { legal } from "@/lib/legal";

export const metadata = {
  title: legal.privacy.title,
  description:
    "سياسة خصوصية BRXEL: البيانات التي نجمعها عند طلب الخدمة، كيف نستخدمها ونحميها، مع من نشاركها، ومدة الاحتفاظ بها، وحقوقك تجاهها.",
};

export default function PrivacyPage() {
  return <LegalPage slug="privacy" />;
}
