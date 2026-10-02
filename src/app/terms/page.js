import LegalPage from "@/components/legal/LegalPage";
import { legal } from "@/lib/legal";

export const metadata = {
  title: legal.terms.title,
  description:
    "الشروط والأحكام لخدمات BRXEL للتصميم: نطاق الخدمات، التعاقد، الدفع، الملكية الفكرية، السرية، الضمان وحدود المسؤولية، وتسوية النزاعات.",
};

export default function TermsPage() {
  return <LegalPage slug="terms" />;
}
