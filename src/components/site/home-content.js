"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Code2,
  LayoutGrid,
  MousePointer2,
  Palette,
  PenTool,
  Quote,
  Search,
  Sparkles,
  Star,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { resolveHomeContent } from "@/lib/profile-home";
import { Reveal } from "./motion";

const ease = [0.16, 1, 0.3, 1];
const serviceIcons = [Search, Palette, LayoutGrid, Code2];
const processIcons = [Search, Palette, Code2];

/** Hero visual composition stays in code so it can be redesigned freely. */
const heroVisual = {
  portraitUrl: "/images/portrait.webp",
  conversionValue: "+24.5%",
  conversionLabel: "Avg. conversion lift",
  process: ["Research", "Design", "Develop"],
  stackFrom: "Figma",
  stackTo: "React",
  chart: [30, 45, 35, 60, 50, 75, 90],
};

function SpotCard({ children }) {
  const [position, setPosition] = useState({ x: 50, y: 50 });
  function updateSpot(event) {
    const box = event.currentTarget.getBoundingClientRect();
    setPosition({ x: event.clientX - box.left, y: event.clientY - box.top });
  }
  return (
    <div
      onMouseMove={updateSpot}
      className="glass-card group relative h-full overflow-hidden rounded-2xl p-6 transition hover:border-primary/50"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 rounded-[inherit] opacity-80 transition-opacity"
        style={{
          background: `radial-gradient(320px circle at ${position.x}px ${position.y}px, color-mix(in srgb, var(--primary) 18%, transparent), transparent 62%)`,
        }}
      />
      <div className="relative z-1">{children}</div>
    </div>
  );
}

function Hero({ profile, home }) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), {
    stiffness: 120,
    damping: 18,
  });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), {
    stiffness: 120,
    damping: 18,
  });
  const px = useTransform(mx, [-0.5, 0.5], [-14, 14]);
  const py = useTransform(my, [-0.5, 0.5], [-10, 10]);
  const words = home.headlineWords;
  const cursorLabel = String(profile.name || "Pradeep").split(/\s+/)[0];
  const intro = profile.intro || "";
  function onMove(event) {
    const box = event.currentTarget.getBoundingClientRect();
    mx.set((event.clientX - box.left) / box.width - 0.5);
    my.set((event.clientY - box.top) / box.height - 0.5);
  }
  return (
    <section
      onMouseMove={onMove}
      onMouseLeave={() => {
        mx.set(0);
        my.set(0);
      }}
      className="relative flex min-h-[calc(100svh-9.5rem)] flex-col justify-center overflow-hidden py-4 xl:min-h-[calc(100svh-8.5rem)] xl:flex-row xl:items-center xl:gap-10"
    >
      <div className="relative z-10 xl:w-[52%]">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 text-xs text-muted-foreground"
        >
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          {home.eyebrow}
        </motion.span>
        <h1 className="font-display mt-5 text-4xl font-semibold leading-[1.08] tracking-[-0.035em] md:text-5xl 2xl:text-[3.4rem]">
          {words.map((word, index) => (
            <motion.span
              key={`${word}-${index}`}
              initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.7, delay: 0.1 + index * 0.05, ease }}
              className="mr-[.25em] inline-block"
            >
              {word}
            </motion.span>
          ))}
          <motion.span
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease }}
            className="text-gradient inline-block"
          >
            {home.highlight}
          </motion.span>{" "}
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            {home.suffix}
          </motion.span>
        </h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-5 max-w-xl leading-relaxed text-muted-foreground"
        >
          Hi, I&apos;m <b className="text-foreground">{profile.name}</b>.{" "}
          {intro}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-7 flex flex-wrap gap-3"
        >
          <Link
            href="/portfolio"
            className="bg-gradient-accent shadow-glow group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:-translate-y-0.5"
          >
            View my work{" "}
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full border bg-background/40 px-6 py-3 text-sm font-semibold backdrop-blur transition hover:border-primary/60 hover:text-primary"
          >
            Let&apos;s talk
          </Link>
        </motion.div>
        <div className="mt-8 flex items-center gap-4">
          <div className="flex -space-x-2">
            {["A", "M", "S", "R"].map((letter, index) => (
              <span
                key={letter}
                aria-hidden="true"
                style={{ zIndex: 4 - index }}
                className="relative flex h-9 w-9 items-center justify-center rounded-full border-2 border-card bg-secondary text-xs font-semibold"
              >
                {letter}
              </span>
            ))}
          </div>
          <div className="text-sm">
            <div className="flex text-primary">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star key={index} className="h-3.5 w-3.5 fill-current" />
              ))}
            </div>
            <span className="text-muted-foreground">{home.socialProof}</span>
          </div>
        </div>
      </div>
      <motion.div
        style={{ rotateX, rotateY, transformPerspective: 1100 }}
        className="relative mx-auto mt-8 aspect-[4/5] w-full max-w-[380px] xl:mt-0 xl:w-[48%] [transform-style:preserve-3d]"
      >
        <div className="absolute inset-x-4 bottom-0 top-10 rounded-[2rem] bg-gradient-to-b from-primary/50 via-primary/20 to-transparent" />
        <div className="spin-slow absolute left-1/2 top-[8%] aspect-square w-[92%] -translate-x-1/2 rounded-full border border-dashed border-primary/40" />
        <div className="absolute left-1/2 top-[14%] aspect-square w-[78%] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_30%_30%,var(--glow),var(--primary)_45%,transparent_72%)] opacity-40 blur-[2px]" />
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease }}
          className="absolute bottom-0 left-1/2 h-[96%] w-[96%] -translate-x-1/2 [filter:drop-shadow(0_30px_40px_rgba(0,0,0,.45))] [mask-image:linear-gradient(to_bottom,black_80%,transparent)] [transform:translateZ(30px)]"
        >
          <Image
            src={heroVisual.portraitUrl}
            alt={profile.name}
            width={900}
            height={1399}
            priority
            sizes="(max-width: 1280px) 70vw, 380px"
            className="h-full w-full object-contain object-bottom"
          />
        </motion.div>
        <motion.div
          style={{ x: px, y: py, translateZ: 70 }}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1 }}
          className="liquid absolute left-0 top-[30%] w-44 rounded-2xl p-3"
        >
          <div className="flex items-center gap-2">
            <span className="bg-gradient-accent flex h-9 w-9 items-center justify-center rounded-xl text-primary-foreground">
              <TrendingUp className="h-4 w-4" />
            </span>
            <div>
              <b className="font-display text-lg">
                {heroVisual.conversionValue}
              </b>
              <small className="block text-[10px] text-muted-foreground">
                {heroVisual.conversionLabel}
              </small>
            </div>
          </div>
          <div className="mt-3 flex h-10 items-end gap-1">
            {heroVisual.chart.map((height, index) => (
              <i
                key={index}
                style={{ height: `${height}%` }}
                className="w-2 rounded-t bg-primary/50"
              />
            ))}
          </div>
        </motion.div>
        <motion.div
          style={{
            x: useTransform(px, (value) => -value),
            y: py,
            translateZ: 90,
          }}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.15 }}
          className="liquid absolute bottom-[17%] right-0 w-40 rounded-2xl p-3"
        >
          <small className="text-[10px] uppercase tracking-widest text-muted-foreground">
            My process
          </small>
          {heroVisual.process.map((label, index) => {
            const Icon = processIcons[index] || Search;
            return (
              <b key={label} className="mt-2 flex items-center gap-2 text-xs">
                <Icon className="h-3.5 w-3.5 text-primary" />
                {label}
                <i
                  style={{ opacity: 1 - index * 0.25 }}
                  className="ml-auto h-1.5 w-1.5 rounded-full bg-primary"
                />
              </b>
            );
          })}
        </motion.div>
        <motion.div
          style={{ x: py, translateZ: 60 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
          className="liquid absolute bottom-1 left-[8%] flex items-center gap-1.5 rounded-full px-3 py-2 text-xs"
        >
          <PenTool className="h-3.5 w-3.5 text-primary" />
          {heroVisual.stackFrom} <ArrowRight className="h-3.5 w-3.5" />{" "}
          {heroVisual.stackTo}
        </motion.div>
        <motion.div
          style={{ translateZ: 100 }}
          animate={{ x: [0, 40, 10, 0], y: [0, -20, 30, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-[13%] top-[9%] text-primary"
        >
          <MousePointer2 className="h-5 w-5 fill-current" />
          <b className="bg-gradient-accent absolute left-5 top-3 rounded px-2 py-1 text-[9px] text-primary-foreground">
            {cursorLabel}
          </b>
        </motion.div>
      </motion.div>
    </section>
  );
}

function Stats({ stats, availability }) {
  return (
    <section className="mt-6 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
      {stats.map(([value, label], index) => (
        <Reveal className="sm:min-w-40 sm:flex-1" delay={index * 0.06} key={label}>
          <div className="glass-card group relative h-full overflow-hidden rounded-2xl p-5">
            <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-primary/10 blur-2xl transition group-hover:bg-primary/30" />
            <div className="font-display text-4xl font-semibold tracking-[-.03em]">
              {value}
            </div>
            <div className="mt-1 text-[11px] uppercase tracking-widest text-muted-foreground">
              {label}
            </div>
          </div>
        </Reveal>
      ))}
      <Reveal className="sm:min-w-40 sm:flex-1" delay={0.18}>
        <Link
          href="/contact"
          className="bg-gradient-accent shadow-glow group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl p-5 text-primary-foreground"
        >
          <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest">
            <span className="h-2 w-2 animate-pulse rounded-full bg-primary-foreground" />
            {availability}
          </span>
          <span className="font-display mt-4 flex items-center justify-between text-xl font-semibold">
            Start a project{" "}
            <ArrowUpRight className="h-5 w-5 transition group-hover:rotate-45" />
          </span>
        </Link>
      </Reveal>
    </section>
  );
}

function Pillars({ pillars }) {
  return (
    <section className="mt-6 flex flex-col gap-4 md:flex-row">
      {pillars.map(([number, title, description], index) => (
        <Reveal className="md:flex-1" key={number} delay={index * 0.08}>
          <div className="glass-card group relative h-full overflow-hidden rounded-2xl p-6 transition hover:border-primary/40">
            <span className="font-display absolute right-5 top-3 text-6xl font-semibold text-transparent [-webkit-text-stroke:1px_var(--border)] transition group-hover:[-webkit-text-stroke:1px_var(--primary)]">
              {number}
            </span>
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
              <span className="bg-gradient-accent h-4 w-1 rounded-full" />
              {title}
            </span>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              {description}
            </p>
          </div>
        </Reveal>
      ))}
    </section>
  );
}

function SectionTitle({ label, title, description, id }) {
  return (
    <Reveal className="mb-8">
      <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[.25em] text-primary">
        <span className="h-px w-6 bg-primary" />
        {label}
      </span>
      <h2
        id={id}
        className="font-display mt-3 text-3xl font-semibold tracking-[-.03em] md:text-4xl"
      >
        {title}
      </h2>
      {description && (
        <p className="mt-3 max-w-2xl text-muted-foreground">{description}</p>
      )}
    </Reveal>
  );
}

function Services({ services, description }) {
  return (
    <section className="mt-16">
      <SectionTitle
        label="Capabilities"
        title={
          <>
            What I <span className="text-gradient">do</span>
          </>
        }
        description={description}
      />
      <div className="flex flex-col justify-between gap-y-7 md:flex-row md:flex-wrap">
        {services.slice(0, 4).map((service, index) => {
          const Icon = serviceIcons[index] || Palette;
          return (
            <Reveal
              className="md:w-[49%] lg:w-[49%] w-full"
              key={service.id}
              delay={index * 0.06}
            >
              <SpotCard>
                <div className="flex gap-5">
                  <span className="liquid relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-primary transition duration-500 group-hover:rotate-[-8deg] group-hover:scale-110 group-hover:bg-gradient-accent group-hover:text-primary-foreground">
                    <Icon className="h-6 w-6" />
                  </span>
                  <div>
                    <h3 className="font-display flex items-center gap-2 text-xl font-semibold tracking-[-.02em]">
                      {service.title}
                      <ArrowUpRight className="h-4 w-4 -translate-x-2 text-primary opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100" />
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {service.description}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {(service.tags || []).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border px-2.5 py-0.5 text-[11px] text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </SpotCard>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

function Voices({ testimonials, philosophy, philosophyHighlight }) {
  return (
    <section className="mt-16">
      <SectionTitle
        label="Testimonials"
        title={
          <>
            Kind <span className="text-gradient">words</span>
          </>
        }
      />
      <div className="flex flex-col gap-4 md:flex-row">
        {testimonials.map(([quote, name, role], index) => (
          <Reveal className="md:flex-1" key={name} delay={index * 0.06}>
            <figure className="glass-card flex h-full flex-col rounded-2xl p-6 transition hover:border-primary/40">
              <Quote className="h-6 w-6 text-primary" />
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed">
                {quote}
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t pt-4">
                <span className="bg-gradient-accent flex h-10 w-10 items-center justify-center rounded-full font-semibold text-primary-foreground">
                  {name[0]}
                </span>
                <span>
                  <span className="block text-sm font-semibold">{name}</span>
                  <span className="text-xs text-muted-foreground">{role}</span>
                </span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
      <Reveal>
        <div className="glass-card relative mt-6 overflow-hidden rounded-2xl p-8">
          <Quote className="absolute -right-4 -top-4 h-32 w-32 text-primary/10" />
          <p className="font-display relative max-w-3xl text-xl font-semibold leading-snug tracking-[-.02em] md:text-2xl">
            “{philosophy}{" "}
            <span className="text-gradient">{philosophyHighlight}</span>.”
          </p>
          <span className="mt-4 block text-xs font-semibold uppercase tracking-widest text-primary">
            Product philosophy
          </span>
        </div>
      </Reveal>
    </section>
  );
}

function Faqs({ faqs }) {
  if (!faqs?.length) return null;
  return (
    <section className="mt-16" id="faq" aria-labelledby="faq-heading">
      <SectionTitle
        label="FAQ"
        id="faq-heading"
        title={
          <>
            Answers, <span className="text-gradient">up front</span>
          </>
        }
        description="Clear answers for teams deciding whether we’re a fit - useful for humans and search engines."
      />
      <div className="space-y-3">
        {faqs.map(([question, answer], index) => (
          <Reveal key={question} delay={index * 0.05}>
            <details className="glass-card group rounded-2xl p-5 open:border-primary/40">
              <summary className="cursor-pointer list-none font-display text-lg font-semibold tracking-[-.02em] marker:content-none [&::-webkit-details-marker]:hidden">
                <span className="flex items-start justify-between gap-4">
                  {question}
                  <span className="text-primary transition group-open:rotate-45">
                    +
                  </span>
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {answer}
              </p>
            </details>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function HomeContent({ profile, services }) {
  const home = resolveHomeContent(profile?.home);
  return (
    <>
      <Hero profile={profile} home={home} />
      <Stats
        stats={home.stats}
        availability={profile?.availability || "Available for work"}
      />
      <Pillars pillars={home.pillars} />
      <Services
        services={services}
        description={home.servicesDescription}
      />
      <Voices
        testimonials={home.testimonials}
        philosophy={home.philosophy}
        philosophyHighlight={home.philosophyHighlight}
      />
      <Faqs faqs={home.faqs} />
    </>
  );
}
