/* eslint-disable @next/next/no-img-element -- remote legacy URLs fall back to <img>. */
"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useMemo, useState } from "react";
import { PageHero, Reveal } from "./motion";

function isOptimizableSrc(src) {
  return typeof src === "string" && src.startsWith("/") && !src.startsWith("//");
}

function ProjectImage({
  project,
  className = "",
  src,
  priority = false,
  sizes = "(max-width: 768px) 100vw, 50vw",
}) {
  const url = src || project.image_url || "/images/hero-illustration.png";
  if (isOptimizableSrc(url)) {
    return (
      <Image
        src={url}
        alt={project.title}
        fill
        sizes={sizes}
        priority={priority}
        className={className}
      />
    );
  }
  return (
    <img
      src={url}
      alt={project.title}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={priority ? "high" : undefined}
      className={className}
    />
  );
}

export function WorkContent({ projects }) {
  const categories = [
    "All",
    ...new Set(projects.map((project) => project.category).filter(Boolean)),
  ];
  const [selected, setSelected] = useState("All");
  const list = useMemo(
    () =>
      selected === "All"
        ? projects
        : projects.filter((project) => project.category === selected),
    [projects, selected],
  );
  const [first, ...rest] = list;
  return (
    <>
      <PageHero
        eyebrow="Case studies"
        title="UI/UX & product"
        accent="design work"
        description="SaaS and digital product case studies - research, interface design, and React/Next.js builds with clear outcomes."
      />
      <div className="mb-8 flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            type="button"
            key={category}
            onClick={() => setSelected(category)}
            className={`relative rounded-full border px-4 py-2 text-xs font-medium transition ${selected === category ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            {selected === category && (
              <motion.span
                layoutId="portfolio-filter"
                className="absolute inset-0 rounded-full bg-foreground/[.07]"
              />
            )}
            <span className="relative">{category}</span>
          </button>
        ))}
      </div>
      {first && (
        <motion.div
          key={first.slug}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            href={`/work/${first.slug}`}
            className="glass-card group mb-5 flex flex-col overflow-hidden rounded-3xl p-3 md:flex-row"
          >
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-secondary md:w-[58%]">
              <ProjectImage
                project={first}
                priority
                sizes="(max-width: 768px) 100vw, 58vw"
                className="object-cover object-top transition duration-1000 group-hover:scale-[1.04]"
              />
            </div>
            <div className="flex flex-col p-5 md:w-[42%] md:p-7">
              <span className="text-[11px] uppercase tracking-[.2em] text-muted-foreground">
                {first.featured ? "Featured" : "Selected"} ·{" "}
                {first.year || first.category}
              </span>
              <h2 className="font-display mt-3 text-2xl font-semibold leading-tight tracking-[-.03em] md:text-3xl">
                {first.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {first.excerpt || first.description}
              </p>
              {first.metrics?.length > 0 && (
                <div className="mt-6 flex gap-4 border-t pt-5">
                  {first.metrics.slice(0, 3).map((metric) => (
                    <div className="min-w-0 flex-1" key={metric.label}>
                      <div className="font-display text-lg font-semibold text-primary">
                        {metric.value}
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        {metric.label}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-medium">
                View case study{" "}
                <ArrowUpRight className="h-4 w-4 transition group-hover:rotate-45 group-hover:text-primary" />
              </span>
            </div>
          </Link>
        </motion.div>
      )}
      {!first && (
        <p className="py-12 text-center text-muted-foreground">
          No projects in this category yet.
        </p>
      )}
      <motion.div
        layout
        className="flex flex-col gap-y-7 md:flex-row md:flex-wrap justify-between"
      >
        <AnimatePresence mode="popLayout">
          {rest.map((project, index) => (
            <motion.div
              className="md:w-[45%] lg:w-[32%] "
              layout
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.4, delay: index * 0.04 }}
            >
              <Link
                href={`/work/${project.slug}`}
                className="glass-card group block h-full overflow-hidden rounded-2xl p-3 transition hover:-translate-y-1"
              >
                <div className="relative aspect-3/2 overflow-hidden rounded-xl bg-secondary">
                  <ProjectImage
                    project={project}
                    sizes="(max-width: 768px) 100vw, 32vw"
                    className="object-cover object-top transition duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="flex items-start justify-between gap-3 px-1 pb-1 pt-4">
                  <div className="min-w-0">
                    <span className="text-[11px] uppercase tracking-[.18em] text-muted-foreground">
                      {project.category} · {project.year}
                    </span>
                    <h3 className="font-display mt-1.5 truncate text-base font-semibold tracking-[-.02em]">
                      {project.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                      {project.excerpt || project.description}
                    </p>
                  </div>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition group-hover:border-primary/40 group-hover:text-primary">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </>
  );
}

