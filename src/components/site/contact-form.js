"use client";

import { useState } from "react";
import { ArrowUpRight, CheckCircle2, ChevronDown, Paperclip } from "lucide-react";

const topics = ["Project Inquiry", "Freelance Work", "Full-time Opportunity", "Collaboration", "Just saying hi"];
const maxMessageLength = 1000;
const inputClass = "liquid w-full rounded-xl px-4 py-3 text-sm outline-none transition placeholder:text-muted-foreground/60 focus:border-primary/60 focus:ring-4 focus:ring-primary/10";
const labelClass = "mb-2 block text-[10px] font-bold uppercase tracking-[.2em] text-muted-foreground";

export function ContactForm() {
  const [message, setMessage] = useState("");
  const [fileName, setFileName] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });
  const [sending, setSending] = useState(false);
  async function submit(event) {
    event.preventDefault();
    setSending(true); setStatus({ type: "", message: "" });
    const response = await fetch("/api/contact", { method: "POST", body: new FormData(event.currentTarget) });
    const body = await response.json().catch(() => ({}));
    setSending(false);
    if (!response.ok) return setStatus({ type: "error", message: body.error || "Message could not be sent. Please try again." });
    event.currentTarget.reset(); setMessage(""); setFileName(""); setStatus({ type: "success", message: "Thanks—your message is on its way. I’ll reply soon." });
  }
  return <form onSubmit={submit} className="liquid space-y-5 rounded-2xl p-6"><div className="grid gap-5 sm:grid-cols-2"><div><label className={labelClass}>Full name <span className="text-primary">*</span></label><input required name="name" maxLength="120" placeholder="Alex Johnson" className={inputClass} /></div><div><label className={labelClass}>Email address <span className="text-primary">*</span></label><input required name="email" type="email" maxLength="160" placeholder="alex@example.com" className={inputClass} /></div><div><label className={labelClass}>Phone</label><input name="phone" maxLength="40" placeholder="+91 98765 43210" className={inputClass} /></div><div><label className={labelClass}>Topic</label><div className="relative"><select name="topic" defaultValue={topics[0]} className={`${inputClass} appearance-none pr-10`}>{topics.map((topic) => <option key={topic}>{topic}</option>)}</select><ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" /></div></div></div><div><label className={labelClass}>Message <span className="text-primary">*</span></label><div className="relative"><textarea required name="message" minLength="10" maxLength={maxMessageLength} rows="6" value={message} onChange={(event) => setMessage(event.target.value.slice(0, maxMessageLength))} placeholder="Describe your project, timeline, and budget (if any)…" className={`${inputClass} resize-none`} /><span className="absolute bottom-3 right-3 text-[10px] text-muted-foreground">{message.length}/{maxMessageLength}</span></div></div><label className="liquid inline-flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition hover:border-primary/50"><Paperclip className="h-4 w-4 text-primary" />{fileName ? <span className="max-w-[180px] truncate">{fileName}</span> : <>Attach brief <span className="text-[10px] text-muted-foreground">JPG, PNG, WebP, GIF or PDF · max 8 MB</span></>}<input name="attachment" type="file" accept="image/jpeg,image/png,image/webp,image/gif,application/pdf" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file && file.size > 8 * 1024 * 1024) { event.target.value = ""; setFileName(""); setStatus({ type: "error", message: "File is larger than 8 MB." }); } else { setFileName(file?.name || ""); } }} /></label>{status.message && <p className={`flex items-center gap-2 text-sm ${status.type === "success" ? "text-primary" : "text-red-500"}`}>{status.type === "success" && <CheckCircle2 className="h-4 w-4" />}{status.message}</p>}<button disabled={sending} className="bg-gradient-accent shadow-glow group inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70">{sending ? "Sending…" : <>Send message <ArrowUpRight className="h-4 w-4 transition group-hover:rotate-45" /></>}</button></form>;
}
