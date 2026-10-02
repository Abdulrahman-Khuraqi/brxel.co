import Reveal from "@/components/ui/Reveal";
import { Spark } from "@/components/ui/Logo";
import WorkGallery from "@/components/work/WorkGallery";
import HomeContact from "@/components/home/HomeContact";
import { projectCount, categoryOrder, CATEGORIES, categoryCounts } from "@/lib/projects";

export const metadata = {
  title: "أعمالنا",
  description: `${projectCount} مشروعًا صمّمناه لعملاء في السعودية والخليج: هويات بصرية، حملات سوشيال ميديا، مطبوعات، وواجهات مواقع ومتاجر.`,
};

export default function WorkPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden bg-void">
        <div
          className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_-10%,rgb(242_161_44/0.18),transparent_70%)]"
          aria-hidden="true"
        />
        <div className="slash-rules absolute inset-0 opacity-60" aria-hidden="true" />

        <div className="relative mx-auto max-w-6xl px-5 pb-14 pt-16 sm:px-6 sm:pb-20 sm:pt-24">
          <Reveal>
            <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.28em] text-brand-bright">
              <Spark className="h-3 w-3" />
              أعمالنا
            </p>
          </Reveal>

          <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <Reveal delay={80}>
              <h1 className="text-[clamp(2.8rem,8vw,6.5rem)] font-bold leading-[1.25] tracking-[-0.01em] text-ice">
                أعمال تتحدث
                <br />
                <span className="headline-accent">عنّا</span>
              </h1>
              <p className="mt-6 max-w-xl text-base leading-8 text-ice-muted sm:text-lg">
                هويات، حملات، مطبوعات، وواجهات صمّمناها لعلامات حقيقية في السعودية والخليج.
              </p>
            </Reveal>

            <Reveal delay={160}>
              <p className="text-start lg:text-end">
                <span className="latin headline-accent inline-block text-[clamp(5rem,14vw,10rem)] font-extrabold leading-none tracking-[-0.05em]">
                  {projectCount}
                </span>
                <span className="block text-sm font-semibold text-ice-muted">مشروعًا مُسلّمًا</span>
              </p>
            </Reveal>
          </div>

          <Reveal delay={220}>
            <ul className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {categoryOrder.map((key, index) => (
                <li key={key}>
                  <a
                    href={`#work-${key}`}
                    className="group flex h-full flex-col justify-between gap-6 rounded-2xl border border-hairline bg-surface p-5 transition duration-300 hover:border-brand hover:bg-brand motion-reduce:transition-none"
                  >
                    <span className="latin text-xs font-semibold text-ice-faint group-hover:text-[#150C09]/60">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span>
                      <span className="block text-base font-bold text-ice group-hover:text-[#150C09]">{CATEGORIES[key]}</span>
                      <span className="mt-1 block text-xs text-ice-muted group-hover:text-[#150C09]/70">
                        <span className="latin">{categoryCounts[key]}</span> مشروعًا
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <div className="bg-void">
        <div className="mx-auto max-w-6xl px-5 pb-8 sm:px-6">
          <WorkGallery />
        </div>
      </div>

      <HomeContact />
    </>
  );
}
