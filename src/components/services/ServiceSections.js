import Link from "next/link";
import { ArrowLeft, ChevronDown, Clock, Minus, RefreshCw, UserRound } from "lucide-react";
import Section from "@/components/ui/Section";
import Reveal from "@/components/ui/Reveal";
import ServiceIcon from "@/components/ui/ServiceIcon";
import ProjectCard from "@/components/work/ProjectCard";
import { CATEGORIES } from "@/lib/projects";
import { getPortfolio } from "@/server/content/portfolio";
import { serviceHref, services } from "@/lib/services";

/*
 * The bands of a single service page (/services/<id>/). Each takes `tone`, so
 * the page can alternate dark and light whichever optional bands it shows.
 */

/** What the service includes, what it leaves out, and how long it takes. */
export function ServiceScope({ service, tone }) {
  return (
    <Section
      id="scope"
      eyebrow="نطاق الخدمة"
      title="ما تشمله الخدمة وما لا تشمله"
      lead="هذا النطاق المعتاد. نثبّته لمشروعك في عرض مكتوب تعتمده قبل البدء، ويبقى مرجعًا للطرفين حتى التسليم."
      align="start"
      tone={tone}
    >
      <div className="mt-12 grid gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        <Reveal className="h-full">
          <div className="h-full rounded-2xl border border-hairline bg-surface p-6 sm:p-8">
            <h3 className="text-h3 font-bold text-ice">تشمل الخدمة</h3>
            <ol className="mt-5 space-y-4">
              {service.deliverables.map((item, index) => (
                <li key={item} className="flex gap-3 text-base leading-8 text-ice-muted">
                  <span className="latin mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand/10 text-xs font-bold text-brand-bright">
                    {index + 1}
                  </span>
                  {item}
                </li>
              ))}
            </ol>
          </div>
        </Reveal>

        <div className="grid content-start gap-5">
          <Reveal delay={80}>
            <div className="space-y-3 rounded-2xl border border-hairline bg-surface p-6 sm:p-8">
              <p className="flex items-center gap-2.5 text-sm">
                <Clock className="h-4 w-4 shrink-0 text-ice-faint" aria-hidden="true" />
                <span className="text-ice-faint">مدة التنفيذ:</span>
                <span className="font-medium text-ice">{service.timeline}</span>
              </p>
              <p className="flex items-center gap-2.5 text-sm">
                <RefreshCw className="h-4 w-4 shrink-0 text-ice-faint" aria-hidden="true" />
                <span className="text-ice-faint">المراجعات:</span>
                <span className="font-medium text-ice">{service.revisions}</span>
              </p>
            </div>
          </Reveal>

          <Reveal delay={140}>
            <div className="rounded-2xl border border-hairline bg-surface p-6 sm:p-8">
              <h3 className="text-h3 font-bold text-ice">خارج نطاق الخدمة</h3>
              <ul className="mt-5 space-y-3">
                {service.excludes.map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm leading-7 text-ice-faint">
                    <Minus className="mt-1.5 h-4 w-4 shrink-0" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}

/** Who the service is for, so a visitor can tell quickly whether it fits. */
export function ServiceAudience({ service, tone }) {
  return (
    <Section id="audience" eyebrow="لمن هذه الخدمة" title="تناسبك إذا كنت…" align="start" tone={tone}>
      <ul className="mt-12 grid gap-4 md:grid-cols-3">
        {service.audience.map((item, index) => (
          <Reveal key={item} as="li" delay={index * 60} className="h-full">
            <div className="flex h-full gap-3 rounded-2xl border border-hairline bg-surface p-6">
              <UserRound className="mt-1 h-5 w-5 shrink-0 text-brand-bright" aria-hidden="true" strokeWidth={1.75} />
              <p className="text-base leading-8 text-ice">{item}</p>
            </div>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}

/** A few delivered projects from the matching portfolio discipline. */
export async function ServiceWork({ service, tone }) {
  const work = (await getPortfolio()).projectsByCategory[service.work] || [];
  if (!work.length) return null;

  return (
    <Section
      id="work"
      eyebrow="من أعمالنا"
      title={`نماذج من أعمال ${CATEGORIES[service.work]}`}
      align="start"
      tone={tone}
      action={
        <Link
          href={`/work/#work-${service.work}`}
          className="group inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-ice transition hover:text-brand-bright motion-reduce:transition-none"
        >
          كل الأعمال
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1 motion-reduce:transition-none" aria-hidden="true" />
        </Link>
      }
    >
      <ul className="mt-12 grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4">
        {work.slice(0, 4).map((project, index) => (
          <Reveal key={project.id} as="li" delay={index * 60} className="h-full">
            <ProjectCard project={project} showCategory={false} />
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}

/** Common questions, as native disclosure widgets: no script, keyboard-ready. */
export function ServiceFaq({ service, tone }) {
  return (
    <Section id="faq" eyebrow="أسئلة شائعة" title="قبل أن تسأل" align="start" tone={tone}>
      <div className="mt-12 divide-y divide-hairline border-y border-hairline">
        {service.faq.map((item) => (
          <details key={item.q} className="group">
            <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 py-4 text-base font-bold text-ice transition-colors hover:text-brand-bright sm:text-lg [&::-webkit-details-marker]:hidden">
              {item.q}
              <ChevronDown
                className="h-5 w-5 shrink-0 text-ice-faint transition-transform group-open:rotate-180 motion-reduce:transition-none"
                aria-hidden="true"
              />
            </summary>
            <p className="max-w-3xl pb-6 text-base leading-8 text-ice-muted">{item.a}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}

/** Every other service, so the visitor can move sideways without going back. */
export function OtherServices({ service, tone }) {
  const others = services.filter((item) => item.id !== service.id);

  return (
    <Section id="other-services" eyebrow="خدمات أخرى" title="خدمات تكمّل بعضها" align="start" tone={tone}>
      <ul className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {others.map((item) => (
          <li key={item.id}>
            <Link
              href={serviceHref(item.id)}
              className="group flex min-h-16 items-center gap-3 rounded-xl border border-hairline bg-surface px-4 py-3 text-sm font-semibold text-ice transition hover:border-brand hover:text-brand-bright motion-reduce:transition-none"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand-bright">
                <ServiceIcon name={item.icon} className="h-4 w-4" />
              </span>
              {item.title}
              <ArrowLeft
                className="ms-auto h-4 w-4 shrink-0 text-ice-faint transition-transform group-hover:-translate-x-1 group-hover:text-brand-bright motion-reduce:transition-none"
                aria-hidden="true"
              />
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}
