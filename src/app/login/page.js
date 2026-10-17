"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, LockKeyhole } from "lucide-react";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter(); const [error, setError] = useState(""); const [pending, setPending] = useState(false);
  async function submit(event) { event.preventDefault(); setPending(true); setError(""); const form = new FormData(event.currentTarget); const response = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(form)) }); const body = await response.json().catch(() => ({})); setPending(false); if (!response.ok) return setError(body.error || "Unable to sign in."); router.replace("/admin"); router.refresh(); }
  return <main className="login-page"><div className="login-card liquid"><Link href="/" className="login-brand">PS<span>.</span></Link><span className="login-lock"><LockKeyhole size={18} /></span><h1>Admin access</h1><p>Sign in to manage the portfolio.</p><form onSubmit={submit}><label>Email<input name="email" required type="email" autoComplete="email" placeholder="you@example.com" /></label><label>Password<input name="password" required type="password" minLength="12" autoComplete="current-password" placeholder="••••••••••••" /></label>{error && <p className="admin-error">{error}</p>}<button className="admin-button" disabled={pending}>{pending ? "Signing in…" : <>Sign in <ArrowRight size={15} /></>}</button></form></div></main>;
}
