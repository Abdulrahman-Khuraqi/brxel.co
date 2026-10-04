import PageHeader from "@/components/layout/PageHeader";
import WorkGallery from "@/components/work/WorkGallery";
import ContactSection from "@/components/contact/ContactSection";
import { getPortfolio } from "@/server/content/portfolio";

// Reads the portfolio from the database (cached; see src/server/content/portfolio.js).
export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const { projectCount } = await getPortfolio();
  return {
    title: "أعمالنا",
    description: `${projectCount} مشروعًا صمّمناه لعلامات حقيقية: هويات بصرية، حملات سوشيال ميديا، واجهات مواقع ومتاجر، ومطبوعات.`,
  };
}

export default async function WorkPage() {
  const { projects, projectsByCategory, categoryCounts, projectCount } = await getPortfolio();

  return (
    <>
      <PageHeader
        eyebrow="أعمالنا"
        title="أعمال صمّمناها لعلامات حقيقية"
        lead={`${projectCount} مشروعًا بين هويات وحملات وواجهات ومطبوعات، مرتّبة من الأبرز. اختر تخصصًا لتصفية النتائج.`}
        align="start"
      />

      <div className="bg-void">
        <div className="mx-auto max-w-6xl px-5 pb-20 sm:px-8 sm:pb-28">
          <WorkGallery projects={projects} projectsByCategory={projectsByCategory} categoryCounts={categoryCounts} />
        </div>
      </div>

      <ContactSection location="work" />
    </>
  );
}
