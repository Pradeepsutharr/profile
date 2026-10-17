"use client";

import { useState } from "react";
import { ArrowUpRight, CheckCircle2, Paperclip } from "lucide-react";

const topics = ["Project inquiry", "Freelance work", "Full-time opportunity", "Collaboration", "Just saying hi"];

export function ContactForm({ profile }) {
  const [status, setStatus] = useState({ type: "", message: "" });
  const [sending, setSending] = useState(false);
  async function submit(event) {
    event.preventDefault(); setSending(true); setStatus({ type: "", message: "" });
    const response = await fetch("/api/contact", { method: "POST", body: new FormData(event.currentTarget) });
    const body = await response.json().catch(() => ({}));
    setSending(false);
    if (!response.ok) return setStatus({ type: "error", message: body.error || "Message could not be sent. Please try again." });
    event.currentTarget.reset(); setStatus({ type: "success", message: "Thanks—your message is on its way. I’ll reply soon." });
  }
  return <form className="contact-form liquid" onSubmit={submit}>
    <div className="form-grid"><label>Full name <em>*</em><input name="name" required maxLength="120" placeholder="Alex Johnson" /></label><label>Email address <em>*</em><input name="email" required type="email" maxLength="160" placeholder="alex@example.com" /></label><label>Phone<input name="phone" maxLength="40" placeholder="+91 98765 43210" /></label><label>Topic<select name="topic" defaultValue={topics[0]}>{topics.map((topic) => <option key={topic}>{topic}</option>)}</select></label></div><label>Message <em>*</em><textarea name="message" required minLength="10" maxLength="3000" rows="7" placeholder="Tell me a little about your project, timeline, and goals…" /></label><label className="file-field"><Paperclip size={15} />Attach brief <small>JPG, PNG, WebP, GIF or PDF · max 8 MB</small><input name="attachment" type="file" accept="image/jpeg,image/png,image/webp,image/gif,application/pdf" /></label>{status.message && <p className={`form-status ${status.type}`}>{status.type === "success" && <CheckCircle2 size={16} />}{status.message}</p>}<button className="primary-button" disabled={sending}>{sending ? "Sending…" : <>Send message <ArrowUpRight size={17} /></>}</button>
  </form>;
}
