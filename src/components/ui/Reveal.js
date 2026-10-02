"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Fades its children in once they scroll into view.
 *
 * The initial hidden state lives in CSS (`.reveal`), and `prefers-reduced-motion`
 * neutralises it there, so nothing is ever left invisible when animation is off.
 * A timeout fallback also reveals the content if IntersectionObserver never
 * fires (throttled background tabs, some embedded webviews), so the page can
 * never get stuck blank.
 */
export default function Reveal({ children, delay = 0, className = "", as: Tag = "div" }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setVisible(true);
        observer.disconnect();
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.05 }
    );

    observer.observe(node);

    // Safety net: if the observer hasn't fired by now, show the content anyway.
    const fallback = window.setTimeout(() => setVisible(true), 1400);

    return () => {
      observer.disconnect();
      window.clearTimeout(fallback);
    };
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal ${className}`}
      data-visible={visible ? "true" : "false"}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
