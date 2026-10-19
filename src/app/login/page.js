"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff, LockKeyhole } from "lucide-react";
import { useState } from "react";
import { Notification } from "@/components/ui/notification";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  async function submit(event) {
    event.preventDefault();
    setPending(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(form)),
    });
    const body = await response.json().catch(() => ({}));
    setPending(false);
    if (!response.ok) return setError(body.error || "Unable to sign in.");
    router.replace("/admin");
    router.refresh();
  }
  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-background p-5">
      {error && (
        <Notification
          key={error}
          message={error}
          variant="error"
          title="Sign-in failed"
        />
      )}
      <div className="aurora pointer-events-none absolute inset-0" />
      <div className="liquid relative w-full max-w-md rounded-3xl p-8 shadow-soft">
        <Link
          href="/"
          className="font-display text-2xl font-semibold tracking-[-.04em]"
        >
          PS<span className="text-primary">.</span>
        </Link>
        <span className="mt-8 grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
          <LockKeyhole size={18} />
        </span>
        <h1 className="font-display mt-5 text-3xl font-semibold tracking-[-.035em]">
          Admin access
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Sign in to manage the portfolio.
        </p>
        <form onSubmit={submit} className="mt-7 space-y-5">
          <label className="block text-xs font-semibold uppercase tracking-[.14em] text-muted-foreground">
            Email
            <input
              name="email"
              required
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className="mt-2 w-full rounded-xl border bg-background px-3 py-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
            />
          </label>
          <label className="block text-xs font-semibold uppercase tracking-[.14em] text-muted-foreground">
            Password
            <span className="relative mt-2 block">
              <input
                name="password"
                required
                type={showPassword ? "text" : "password"}
                minLength="12"
                autoComplete="current-password"
                placeholder="••••••••••••"
                className="w-full rounded-xl border bg-background px-3 py-3 pr-11 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-muted-foreground transition hover:bg-secondary hover:text-foreground"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </span>
          </label>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            className="bg-gradient-accent shadow-glow inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60"
            disabled={pending}
          >
            {pending ? (
              "Signing in…"
            ) : (
              <>
                Sign in <ArrowRight size={15} />
              </>
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
