import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { notFound } from "next/navigation";
import PageHeader from "@/components/layout/PageHeader";
import SocialProjectGallery from "@/components/work/SocialProjectGallery";
import ContactCta from "@/components/ContactCta";
import { socialProjects } from "@/lib/projects";

export function generateStaticParams() {
  return socialProjects.map((project) => ({ id: project.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const project = socialProjects.find((item) => item.id === id);

  if (!project) return {};

  return {
    title: `${project.title} — أعمال السوشيال ميديا`,
    description: `${project.summary} شاهد ${project.gallery.length} تصميمًا من المشروع.`,
  };
}

export default async function SocialProjectPage({ params }) {
  const { id } = await params;
  const project = socialProjects.find((item) => item.id === id);

  if (!project) notFound();

  return (
    <>
      <PageHeader eyebrow="مشروع سوشيال ميديا" title={project.title} lead={project.summary}>
        <Link
          href="/work/#work-social"
          className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-xl border border-hairline-strong bg-surface px-5 py-3 text-sm font-semibold text-ice transition hover:border-brand hover:text-brand-bright motion-reduce:transition-none"
        >
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
          العودة إلى أعمال السوشيال
        </Link>
      </PageHeader>

      <SocialProjectGallery project={project} />
      <ContactCta />
    </>
  );
}
