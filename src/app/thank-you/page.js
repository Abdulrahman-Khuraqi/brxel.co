import { Suspense } from "react";
import ThankYou from "@/components/contact/ThankYou";

export const metadata = {
  title: "شكرًا لك",
  description: "تم استلام طلبك، وسنعود إليك خلال يوم عمل واحد.",
  robots: { index: false, follow: false },
};

export default function ThankYouPage() {
  return (
    // The request id is read from the query string, which only exists in the browser.
    <Suspense fallback={<div className="min-h-[70vh] bg-void" />}>
      <ThankYou />
    </Suspense>
  );
}
