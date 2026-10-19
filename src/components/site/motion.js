"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Lightweight reveal — CSS only, no framer-motion on the critical path.
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
  as = "div",
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const Tag = as;

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "-40px", threshold: 0.12 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal ${visible ? "reveal-in" : ""} ${className}`.trim()}
      style={{ transitionDelay: visible ? `${Math.min(delay, 0.2)}s` : undefined }}
    >
      {children}
    </Tag>
  );
}

export function PageHero({ eyebrow, title, accent, description }) {
  return (
    <Reveal className="mb-10">
      <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[.25em] text-primary">
        {/* <span className="h-px w-6 bg-primary" /> */}
        {eyebrow}
      </span>
      <h1 className="font-display mt-3 text-3xl font-semibold tracking-[-.03em] md:text-4xl">
        {title}{" "}
        {accent && <span className="text-gradient">{accent}</span>}
      </h1>
      {description && (
        <p className="mt-3 max-w-2xl text-muted-foreground">{description}</p>
      )}
    </Reveal>
  );
}
