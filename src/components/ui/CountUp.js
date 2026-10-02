"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Counts from zero to `value` the first time it scrolls into view.
 *
 * The digits are wrapped LTR so "+35" and "100%" keep their order inside the
 * RTL page, and reduced-motion users get the final number with no animation.
 */
export default function CountUp({
  value,
  prefix = "",
  suffix = "",
  duration = 1700,
  delay = 0,
  className = "",
}) {
  const ref = useRef(null);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || typeof IntersectionObserver === "undefined") {
      setDisplay(value);
      return;
    }

    let frame = 0;
    let timer = 0;

    const run = () => {
      const start = performance.now();
      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        // easeOutExpo: quick off the mark, long soft landing on the number.
        const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        setDisplay(Math.round(value * eased));
        if (progress < 1) frame = requestAnimationFrame(step);
      };
      frame = requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        timer = window.setTimeout(run, delay);
      },
      { threshold: 0.35 }
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      clearTimeout(timer);
    };
  }, [value, duration, delay]);

  return (
    <span ref={ref} dir="ltr" className={`tabular-nums ${className}`}>
      <span aria-hidden="true">{`${prefix}${display}${suffix}`}</span>
      <span className="sr-only">{`${prefix}${value}${suffix}`}</span>
    </span>
  );
}
