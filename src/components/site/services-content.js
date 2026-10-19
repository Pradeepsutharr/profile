import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { ServiceIcon } from "./icons";
import { PageHero, Reveal } from "./motion";

function parseFitCopy(description) {
  const text = String(description || "");
  const ideal =
    text.match(/Ideal for\s+([^.]+)\./i)?.[1]?.trim() || null;
  const notFor =
    text.match(/Not a fit for\s+([^.]+)\./i)?.[1]?.trim() || null;
  const body = text
    .replace(/\s*Ideal for\s+[^.]+\./i, "")
    .replace(/\s*Not a fit for\s+[^.]+\./i, "")
    .trim();
  return { body, ideal, notFor };
}

export function ServicesContent({ services }) {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="UX, product design &"
        accent="frontend"
        description="UX research, interface design, design systems, and React/Next.js implementation for startups and SaaS teams."
      />
      <div className="grid gap-5 md:grid-cols-2">
        {services.map((service, index) => {
          const { body } = parseFitCopy(service.description);
          return (
            <Reveal key={service.id} delay={index * 0.06}>
              <Link
                href={`/services/${service.slug}`}
                className="liquid group flex h-full flex-col rounded-3xl p-6 transition hover:-translate-y-1 hover:border-primary/40"
              >
                <div className="flex items-start justify-between">
                  <span className="liquid grid h-14 w-14 place-items-center rounded-2xl text-primary transition group-hover:border-primary/50 group-hover:text-primary-foreground group-hover:[background:var(--gradient-accent)]">
                    <ServiceIcon name={service.icon} />
                  </span>
                  <small
                    aria-hidden="true"
                    className="font-display text-3xl font-semibold text-primary/55"
                  >
                    0{index + 1}
                  </small>
                </div>
                <h2 className="font-display mt-7 text-2xl font-semibold tracking-[-.03em]">
                  {service.title}
                </h2>
                <p className="mt-3 flex-1 leading-relaxed text-muted-foreground">
                  {body || service.description}
                </p>
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {(service.tags || []).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border px-2.5 py-0.5 text-[11px] text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="mt-7 inline-flex items-center gap-2 text-sm font-medium">
                  Explore capability{" "}
                  <ArrowUpRight className="h-4 w-4 transition group-hover:rotate-45 group-hover:text-primary" />
                </span>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </>
  );
}

export function ServiceDetail({ service }) {
  const deliverables = service.tags?.length
    ? service.tags
    : ["Clear product thinking", "Thoughtful execution", "Close collaboration"];
  const { body, ideal, notFor } = parseFitCopy(service.description);

  return (
    <article>
      <Link
        href="/services"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        All capabilities
      </Link>
      <Reveal>
        <div className="liquid mt-6 flex flex-col gap-6 rounded-3xl p-6 md:flex-row md:items-center">
          <span className="liquid grid h-16 w-16 shrink-0 place-items-center rounded-2xl text-primary shadow-soft">
            <ServiceIcon name={service.icon} size={28} />
          </span>
          <div>
            <span className="text-[11px] uppercase tracking-[.2em] text-primary">
              Capability
            </span>
            <h1 className="font-display mt-2 text-3xl font-semibold tracking-[-.035em] md:text-5xl">
              {service.title}
            </h1>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              {body || service.description}
            </p>
          </div>
        </div>
      </Reveal>
      {(ideal || notFor) && (
        <Reveal>
          <div className="mt-8 grid gap-3 md:grid-cols-2">
            {ideal && (
              <div className="liquid rounded-2xl p-5">
                <div className="text-[11px] font-semibold uppercase tracking-[.2em] text-primary">
                  Ideal for
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {ideal}
                </p>
              </div>
            )}
            {notFor && (
              <div className="liquid rounded-2xl p-5">
                <div className="text-[11px] font-semibold uppercase tracking-[.2em] text-muted-foreground">
                  Not for
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {notFor}
                </p>
              </div>
            )}
          </div>
        </Reveal>
      )}
      <Reveal>
        <section className="mt-12">
          <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[.25em] text-primary">
            <span className="h-px w-6 bg-primary" />
            How I help
          </span>
          <h2 className="font-display mt-3 text-3xl font-semibold tracking-[-.03em]">
            What you can expect
          </h2>
          <div className="mt-6 grid gap-3">
            {deliverables.map((deliverable, index) => (
              <p
                key={deliverable}
                className="liquid flex items-center gap-4 rounded-2xl p-5"
              >
                <span className="font-display text-xl font-semibold text-primary">
                  0{index + 1}
                </span>
                {deliverable}
              </p>
            ))}
          </div>
        </section>
      </Reveal>
      <Link
        href="/contact"
        className="bg-gradient-accent shadow-glow mt-10 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:-translate-y-0.5"
      >
        Book a discovery call <ArrowRight className="h-4 w-4" />
      </Link>
    </article>
  );
}
