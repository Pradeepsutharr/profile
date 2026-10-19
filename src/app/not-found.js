import Link from "next/link";

export const metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-background p-5 text-center">
      <div>
        <span className="text-xs font-semibold uppercase tracking-[.2em] text-primary">
          404
        </span>
        <h1 className="font-display mt-3 text-4xl font-semibold tracking-[-.04em]">
          That page is not here.
        </h1>
        <p className="mt-3 text-muted-foreground">
          It may have moved, or the link could be out of date.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="bg-gradient-accent shadow-glow inline-flex rounded-full px-5 py-3 text-sm font-semibold text-primary-foreground"
          >
            Back home
          </Link>
          <Link
            href="/contact"
            className="inline-flex rounded-full border px-5 py-3 text-sm font-semibold transition hover:border-primary/50 hover:text-primary"
          >
            Contact me
          </Link>
        </div>
      </div>
    </main>
  );
}
