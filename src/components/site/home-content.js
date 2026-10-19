import Link from "next/link";
import {
  ArrowUpRight,
  Code2,
  LayoutGrid,
  Palette,
  Quote,
  Search,
} from "lucide-react";
import { resolveHomeContent } from "@/lib/profile-home";
import { SpotCard } from "./spot-card";

const serviceIcons = [Search, Palette, LayoutGrid, Code2];

function Stats({ stats, availability }) {
  return (
    <section className="mt-6 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
      {stats.map(([value, label], index) => (
        <div className="sm:min-w-40 sm:flex-1" key={label}>
          <div className="glass-card group relative h-full overflow-hidden rounded-2xl p-5">
            <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-primary/10 blur-2xl transition group-hover:bg-primary/30" />
            <div className="font-display text-4xl font-semibold tracking-[-.03em]">
              {value}
            </div>
            <div className="mt-1 text-[11px] uppercase tracking-widest text-muted-foreground">
              {label}
            </div>
          </div>
        </div>
      ))}
      <div className="sm:min-w-40 sm:flex-1">
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
      </div>
    </section>
  );
}

function Pillars({ pillars }) {
  return (
    <section className="mt-6 flex flex-col gap-4 md:flex-row">
      {pillars.map(([number, title, description], index) => (
        <div className="md:flex-1" key={number}>
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
        </div>
      ))}
    </section>
  );
}

function SectionTitle({ label, title, description, id }) {
  return (
    <div className="mb-8">
      <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[.25em] text-primary">
        {/* <span className="h-px w-6 bg-primary" /> */}
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
    </div>
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
            <div
              className="md:w-[49%] lg:w-[49%] w-full"
              key={service.id}
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
            </div>
          );
        })}
      </div>
    </section>
  );
}

function normalizeTestimonials(items = []) {
  return items
    .map((item, index) => {
      if (Array.isArray(item)) {
        const [quote, author_name, author_role] = item;
        return { id: `legacy-${index}`, quote, author_name, author_role };
      }
      return item;
    })
    .filter((item) => item?.quote && item?.author_name);
}

function Voices({ testimonials, philosophy, philosophyHighlight }) {
  const voices = normalizeTestimonials(testimonials);
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
        {voices.map(({ id, quote, author_name: name, author_role: role }) => (
          <div className="md:flex-1" key={id || name}>
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
          </div>
        ))}
      </div>
      <div>
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
      </div>
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
          <div key={question}>
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
          </div>
        ))}
      </div>
    </section>
  );
}

/** Below-the-fold home sections. Hero is rendered separately as a server component. */
export function HomeContent({ profile, services, testimonials }) {
  const home = resolveHomeContent(profile?.home);
  const voices =
    Array.isArray(testimonials) && testimonials.length
      ? testimonials
      : home.testimonials;
  return (
    <>
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
        testimonials={voices}
        philosophy={home.philosophy}
        philosophyHighlight={home.philosophyHighlight}
      />
      <Faqs faqs={home.faqs} />
    </>
  );
}
