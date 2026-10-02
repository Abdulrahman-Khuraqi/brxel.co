"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import Reveal from "@/components/ui/Reveal";

export default function SocialProjectGallery({ project }) {
  const [activeIndex, setActiveIndex] = useState(null);
  const closeButtonRef = useRef(null);
  const triggerRefs = useRef([]);

  const close = useCallback(() => {
    const index = activeIndex;
    setActiveIndex(null);
    window.requestAnimationFrame(() => triggerRefs.current[index]?.focus());
  }, [activeIndex]);

  const previous = useCallback(
    () => setActiveIndex((current) => (current - 1 + project.gallery.length) % project.gallery.length),
    [project.gallery.length]
  );
  const next = useCallback(
    () => setActiveIndex((current) => (current + 1) % project.gallery.length),
    [project.gallery.length]
  );

  useEffect(() => {
    if (activeIndex === null) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft") next();
      if (event.key === "ArrowRight") previous();
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [activeIndex, close, next, previous]);

  return (
    <>
      <section className="bg-void" aria-labelledby="gallery-title">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-6 sm:py-20">
          <Reveal>
            <div className="flex flex-col gap-3 border-b border-hairline pb-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold tracking-[0.22em] text-brand-bright">المعرض الكامل</p>
                <h2 id="gallery-title" className="mt-2 text-2xl font-bold text-ice sm:text-3xl">
                  {project.gallery.length} تصميمًا لعلامة {project.title}
                </h2>
              </div>
              <p className="text-sm leading-7 text-ice-muted">اضغط على أي تصميم لعرضه بحجمه الكامل.</p>
            </div>
          </Reveal>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
            {project.gallery.map((image, index) => (
              <Reveal key={image} delay={Math.min(index, 8) * 35}>
                <button
                  ref={(node) => {
                    triggerRefs.current[index] = node;
                  }}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className="group relative aspect-square w-full cursor-zoom-in overflow-hidden rounded-2xl border border-hairline bg-navy-raised"
                  aria-label={`عرض التصميم ${index + 1} من ${project.gallery.length} بالحجم الكامل`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image}
                    alt={`تصميم ${index + 1} من مشروع ${project.title}`}
                    loading={index < 4 ? "eager" : "lazy"}
                    decoding="async"
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.025] group-hover:brightness-75 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  />
                  <span className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition duration-200 group-hover:bg-black/20 group-hover:opacity-100 group-focus-visible:bg-black/20 group-focus-visible:opacity-100 motion-reduce:transition-none">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-black/55 text-white backdrop-blur-sm">
                      <Maximize2 className="h-5 w-5" aria-hidden="true" />
                    </span>
                  </span>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {activeIndex !== null ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-3 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={`التصميم ${activeIndex + 1} من مشروع ${project.title}`}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) close();
          }}
        >
          <button
            ref={closeButtonRef}
            type="button"
            onClick={close}
            className="absolute end-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20 motion-reduce:transition-none sm:end-6 sm:top-6"
            aria-label="إغلاق عارض الصور"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>

          {project.gallery.length > 1 ? (
            <>
              <button
                type="button"
                onClick={previous}
                className="absolute start-3 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white transition hover:bg-white/15 motion-reduce:transition-none sm:start-6"
                aria-label="التصميم السابق"
              >
                <ChevronRight className="h-6 w-6" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={next}
                className="absolute end-3 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white transition hover:bg-white/15 motion-reduce:transition-none sm:end-6"
                aria-label="التصميم التالي"
              >
                <ChevronLeft className="h-6 w-6" aria-hidden="true" />
              </button>
            </>
          ) : null}

          <figure className="flex max-h-full max-w-full flex-col items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.gallery[activeIndex]}
              alt={`تصميم ${activeIndex + 1} من مشروع ${project.title} بالحجم الكامل`}
              className="max-h-[82vh] max-w-[calc(100vw-1.5rem)] object-contain sm:max-w-[calc(100vw-10rem)]"
            />
            <figcaption className="rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-white/80">
              {activeIndex + 1} / {project.gallery.length}
            </figcaption>
          </figure>
        </div>
      ) : null}
    </>
  );
}
