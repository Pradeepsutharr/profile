/* eslint-disable @next/next/no-img-element -- LCP portrait is a static webp; skip optimizer hop. */
import Link from "next/link";
import { preload } from "react-dom";
import {
  ArrowRight,
  MousePointer2,
  PenTool,
  Search,
  Sparkles,
  Star,
  TrendingUp,
  Code2,
  Palette,
} from "lucide-react";

const processIcons = [Search, Palette, Code2];

const heroVisual = {
  portraitUrl: "/images/portrait-lcp.webp",
  conversionValue: "+24.5%",
  conversionLabel: "Avg. conversion lift",
  process: ["Research", "Design", "Develop"],
  stackFrom: "Figma",
  stackTo: "React",
  chart: [30, 45, 35, 60, 50, 75, 90],
};

/** Server-rendered hero so LCP text/image paint without waiting on client JS. */
export function HomeHero({ profile, home }) {
  const words = home.headlineWords;
  const cursorLabel = String(profile.name || "Pradeep").split(/\s+/)[0];
  const intro = profile.intro || "";
  preload(heroVisual.portraitUrl, { as: "image", type: "image/webp", fetchPriority: "high" });

  return (
    <section className="relative flex min-h-[calc(100svh-9.5rem)] flex-col justify-center overflow-hidden py-4 xl:min-h-[calc(100svh-8.5rem)] xl:flex-row xl:items-center xl:gap-10">
      {/* Text-first: with font-display:optional, LCP lands with FCP (~0.9s) for a 100 lab score. */}
      <div className="relative z-10 xl:w-[52%]">
        <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          {home.eyebrow}
        </span>
        <h1 className="font-display mt-5 text-4xl font-semibold leading-[1.08] tracking-[-0.035em] md:text-5xl 2xl:text-[3.4rem]">
          {words.map((word, index) => (
            <span key={`${word}-${index}`} className="mr-[.25em] inline-block">
              {word}
            </span>
          ))}
          <span className="text-gradient inline-block">{home.highlight}</span>{" "}
          <span>{home.suffix}</span>
        </h1>
        <p className="mt-5 max-w-xl leading-relaxed text-muted-foreground">
          Hi, I&apos;m <b className="text-foreground">{profile.name}</b>.{" "}
          {intro}
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            href="/portfolio"
            prefetch={false}
            className="bg-gradient-accent shadow-glow group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:-translate-y-0.5"
          >
            View my work{" "}
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </Link>
          <Link
            href="/contact"
            prefetch={false}
            className="inline-flex items-center gap-2 rounded-full border bg-background/40 px-6 py-3 text-sm font-semibold backdrop-blur transition hover:border-primary/60 hover:text-primary"
          >
            Let&apos;s talk
          </Link>
        </div>
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
      <div className="relative mx-auto mt-8 aspect-[4/5] w-full max-w-[380px] xl:mt-0 xl:w-[48%]">
        <div className="absolute inset-x-4 bottom-0 top-10 rounded-[2rem] bg-gradient-to-b from-primary/50 via-primary/20 to-transparent" />
        <div className="hero-orbit absolute left-1/2 top-[8%] aspect-square w-[92%] -translate-x-1/2 rounded-full border border-dashed border-primary/40" />
        <div className="absolute left-1/2 top-[14%] aspect-square w-[78%] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_30%_30%,var(--glow),var(--primary)_45%,transparent_72%)] opacity-40 blur-[2px]" />
        <div className="absolute bottom-0 left-1/2 h-[96%] w-[96%] -translate-x-1/2">
          <img
            src={heroVisual.portraitUrl}
            alt={profile.name}
            width={760}
            height={1181}
            decoding="async"
            fetchPriority="high"
            className="h-full w-full object-contain object-bottom"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-1/5 bg-gradient-to-t from-[var(--shell)] to-transparent"
          />
        </div>
        <div className="hero-float-a liquid absolute left-0 top-[30%] w-40 rounded-2xl p-3 sm:w-44">
          <div className="flex items-center gap-2">
            <span className="bg-gradient-accent flex h-9 w-9 items-center justify-center rounded-xl text-primary-foreground">
              <TrendingUp className="h-4 w-4" />
            </span>
            <div>
              <b className="font-display text-lg">{heroVisual.conversionValue}</b>
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
        </div>
        <div className="hero-float-b liquid absolute bottom-[17%] right-0 w-36 rounded-2xl p-3 sm:w-40">
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
        </div>
        <div className="hero-float-c liquid absolute bottom-1 left-[8%] flex items-center gap-1.5 rounded-full px-3 py-2 text-xs">
          <PenTool className="h-3.5 w-3.5 text-primary" />
          {heroVisual.stackFrom} <ArrowRight className="h-3.5 w-3.5" />{" "}
          {heroVisual.stackTo}
        </div>
        <div className="hero-cursor absolute right-[13%] top-[9%] text-primary">
          <MousePointer2 className="h-5 w-5 fill-current" />
          <b className="bg-gradient-accent absolute left-5 top-3 rounded px-2 py-1 text-[9px] text-primary-foreground">
            {cursorLabel}
          </b>
        </div>
      </div>
    </section>
  );
}
