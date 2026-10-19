/* eslint-disable @next/next/no-img-element -- imported legacy project images may use remote storage URLs. */
"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { PageHero, Reveal } from "./motion";

function ProjectImage({ project, className = "", src }) {
  return (
    <img
      src={src || project.image_url || "/images/hero-illustration.png"}
      alt={project.title}
      className={className}
    />
  );
}

function galleryImages(project) {
  const cover = project.image_url?.trim();
  return [
    ...new Set(
      (Array.isArray(project.gallery) ? project.gallery : [])
        .map((image) =>
          typeof image === "string" ? image : image?.url || image?.src,
        )
        .filter((image) => typeof image === "string" && image.trim())
        .map((image) => image.trim())
        .filter((image) => image !== cover),
    ),
  ];
}

function ProjectGallerySlider({ project, images }) {
  const swiperRef = useRef(null);
  const [paginationEl, setPaginationEl] = useState(null);

  useEffect(() => {
    const swiper = swiperRef.current;
    if (!swiper || !paginationEl || !swiper.params.pagination) return;
    swiper.params.pagination.el = paginationEl;
    swiper.pagination?.init();
    swiper.pagination?.render();
    swiper.pagination?.update();
  }, [paginationEl, images.length]);

  if (!images.length) return null;

  return (
    <section className="project-gallery mt-14">
      <div className="mb-6 flex items-end justify-between gap-4">
        <Reveal>
          <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[.25em] text-primary">
            <span className="h-px w-6 bg-primary" />
            Snapshots
          </span>
          <h2 className="font-display mt-3 text-2xl font-semibold tracking-[-.03em] md:text-3xl">
            More from this project
          </h2>
        </Reveal>
        {images.length > 1 && (
          <div className="flex shrink-0 gap-3">
            <button
              type="button"
              name="prev-btn"
              aria-label="Previous snapshot"
              className="project-gallery-prev liquid grid h-10 w-10 place-items-center rounded-xl text-primary transition hover:border-primary/40 hover:scale-105 active:scale-95"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              name="next-btn"
              aria-label="Next snapshot"
              className="project-gallery-next liquid grid h-10 w-10 place-items-center rounded-xl text-primary transition hover:border-primary/40 hover:scale-105 active:scale-95"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
      <Swiper
        slidesPerView="auto"
        spaceBetween={24}
        centeredSlides
        loop={images.length > 2}
        grabCursor
        onBeforeInit={(swiper) => {
          if (typeof swiper.params.pagination === "object") {
            swiper.params.pagination.el = paginationEl;
          }
        }}
        navigation={
          images.length > 1
            ? {
                prevEl: ".project-gallery-prev",
                nextEl: ".project-gallery-next",
              }
            : false
        }
        pagination={
          images.length > 1
            ? {
                el: paginationEl,
                clickable: true,
              }
            : false
        }
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        modules={[Pagination, Navigation]}
        className="project-slider"
      >
        {images.map((image, index) => (
          <SwiperSlide
            key={`${image}-${index}`}
            className="project-slide swiper-slide-project"
          >
            <div className="relative h-full w-full overflow-hidden rounded-xl border bg-secondary shadow-soft group">
              <img
                src={image}
                alt={`${project.title} preview ${index + 1}`}
                className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      {images.length > 1 && (
        <div className="mt-6 flex items-start justify-between">
          <div
            ref={(node) => setPaginationEl(node)}
            className="project-gallery-pagination flex max-w-full cursor-pointer items-center justify-center gap-3 p-0 md:max-w-[50%] md:justify-start"
          />
        </div>
      )}
    </section>
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
        eyebrow="Portfolio"
        title="Selected"
        accent="work"
        description="Products, platforms and websites designed with care — from first sketch to shipped pixels."
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
                className="h-full w-full object-cover object-top transition duration-1000 group-hover:scale-[1.04]"
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
                    className="h-full w-full object-cover object-top transition duration-700 group-hover:scale-105"
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

export function WorkDetail({ project, nextProject }) {
  const gallery = useMemo(() => galleryImages(project), [project]);
  const facts = [
    ["Client", project.client],
    ["Role", project.role],
    ["Category", project.category],
    ["Year", project.year],
  ];
  const sections = [
    ["The challenge", project.challenge],
    ["The approach", project.approach],
    ["The outcome", project.outcome],
  ].filter(([, text]) => text);
  return (
    <article>
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        className="liquid overflow-hidden rounded-3xl"
      >
        <div className="flex max-h-[min(78dvh,720px)] flex-col">
          <div className="shrink-0 px-5 pb-4 pt-5 md:px-7 md:pb-5 md:pt-6">
            <Link
              href="/work"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              All projects
            </Link>
            <span className="mt-4 block text-[11px] uppercase tracking-[.2em] text-muted-foreground">
              {[project.category, project.year].filter(Boolean).join(" · ")}
            </span>
            <h1 className="font-display mt-2 max-w-3xl text-2xl font-semibold leading-tight tracking-[-.035em] md:text-4xl">
              {project.title}
            </h1>
            {(project.excerpt || project.description) && (
              <p className="mt-2 line-clamp-2 max-w-2xl text-sm text-muted-foreground md:text-[15px]">
                {project.excerpt || project.description}
              </p>
            )}
          </div>
          <div className="relative min-h-0 flex-1 px-2 pb-2 md:px-2.5 md:pb-2.5">
            <div className="relative h-[min(34dvh,280px)] overflow-hidden rounded-2xl bg-secondary md:h-[min(38dvh,320px)]">
              <ProjectImage
                project={project}
                className="h-full w-full object-cover object-top"
              />
            </div>
          </div>
        </div>
      </motion.section>
      <div className="mt-6 flex flex-wrap gap-3">
        {facts.map(([label, value]) => (
          <div
            key={label}
            className="glass-card min-w-[45%] flex-1 rounded-2xl p-4 md:min-w-[20%]"
          >
            <div className="text-[11px] uppercase tracking-[.18em] text-muted-foreground">
              {label}
            </div>
            <div className="mt-1.5 text-sm font-medium">{value || "—"}</div>
          </div>
        ))}
      </div>
      {sections.length > 0 && (
        <div className="mt-12 space-y-8">
          {sections.map(([title, text], index) => (
            <Reveal key={title} delay={index * 0.05}>
              <div className="flex flex-col gap-3 md:flex-row md:gap-8">
                <div className="w-48 shrink-0 text-[11px] uppercase tracking-[.2em] text-primary">
                  0{index + 1} — {title}
                </div>
                <p className="font-display text-xl font-semibold leading-relaxed tracking-[-.02em] md:text-2xl">
                  {text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      )}
      {project.metrics?.length > 0 && (
        <div className="mt-12 flex flex-wrap gap-3">
          {project.metrics.map((metric) => (
            <div
              key={metric.label}
              className="glass-card min-w-[30%] flex-1 rounded-2xl p-6"
            >
              <div className="font-display text-3xl font-semibold text-primary">
                {metric.value}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                {metric.label}
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="mt-8 flex flex-wrap items-center gap-2">
        {(project.tech_stack || project.tags || []).map((tool) => (
          <span
            key={tool}
            className="rounded-full border px-3 py-1 text-xs text-muted-foreground"
          >
            {tool}
          </span>
        ))}
        {project.project_url && (
          <a
            href={project.project_url}
            target="_blank"
            rel="noreferrer"
            className="ml-auto inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition hover:border-primary/40 hover:text-primary"
          >
            View original <ArrowUpRight className="h-4 w-4" />
          </a>
        )}
      </div>
      <ProjectGallerySlider project={project} images={gallery} />
      {nextProject && (
        <Link
          href={`/work/${nextProject.slug}`}
          className="liquid group mt-12 flex items-center gap-5 overflow-hidden rounded-3xl p-3"
        >
          <ProjectImage
            project={nextProject}
            className="h-20 w-32 rounded-xl object-cover object-top"
          />
          <div className="min-w-0 flex-1">
            <div className="text-[11px] uppercase tracking-[.2em] text-muted-foreground">
              Next project
            </div>
            <div className="font-display mt-1 truncate text-lg font-semibold">
              {nextProject.title}
            </div>
          </div>
          <ArrowRight className="mr-3 h-5 w-5 transition group-hover:translate-x-1 group-hover:text-primary" />
        </Link>
      )}
    </article>
  );
}
