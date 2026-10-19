import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function CtaBanner({
  title = "Have a similar project in mind?",
  description = "Tell me about your goals and I’ll reply with clear next steps within 12-24 hours.",
  href = "/contact",
  label = "Start a project",
}) {
  return (
    <aside className="bg-gradient-accent shadow-glow mt-12 overflow-hidden rounded-3xl p-6 text-primary-foreground md:p-8">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div className="max-w-xl">
          <h2 className="font-display text-2xl font-semibold tracking-[-.03em] md:text-3xl">
            {title}
          </h2>
          <p className="mt-2 text-sm text-primary-foreground/85 md:text-base">
            {description}
          </p>
        </div>
        <Link
          href={href}
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-primary-foreground px-5 py-3 text-sm font-semibold text-primary transition hover:-translate-y-0.5"
        >
          {label} <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </aside>
  );
}
