"use client";

import { useState } from "react";
import {
  ArrowUpRight,
  CheckCircle2,
  ChevronDown,
  Mail,
  MessageCircle,
  Paperclip,
} from "lucide-react";

const topics = [
  "Project Inquiry",
  "Freelance Work",
  "Full-time Opportunity",
  "Collaboration",
  "Just saying hi",
];

const budgetRanges = [
  "",
  "Under $2k",
  "$2k - $5k",
  "$5k - $10k",
  "$10k - $25k",
  "$25k+",
  "Not sure yet",
];

const maxMessageLength = 3000;
const inputClass =
  "liquid w-full rounded-xl px-4 py-3 text-sm outline-none transition placeholder:text-muted-foreground/60 focus:border-primary/60 focus:ring-4 focus:ring-primary/10";
const labelClass =
  "mb-2 block text-[10px] font-bold uppercase tracking-[.2em] text-muted-foreground";

export function ContactForm({ email, phone }) {
  const [message, setMessage] = useState("");
  const [fileName, setFileName] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });
  const [sending, setSending] = useState(false);
  const [succeeded, setSucceeded] = useState(false);

  const whatsappHref = phone
    ? `https://wa.me/${String(phone).replace(/\D/g, "")}`
    : null;

  async function submit(event) {
    event.preventDefault();
    setSending(true);
    setStatus({ type: "", message: "" });
    const response = await fetch("/api/contact", {
      method: "POST",
      body: new FormData(event.currentTarget),
    });
    const body = await response.json().catch(() => ({}));
    setSending(false);
    if (!response.ok) {
      return setStatus({
        type: "error",
        message: body.error || "Message could not be sent. Please try again.",
      });
    }
    event.currentTarget.reset();
    setMessage("");
    setFileName("");
    setSucceeded(true);
    setStatus({
      type: "success",
      message: "Message sent - I’ll review your brief and reply within 12-24 hours.",
    });
  }

  if (succeeded) {
    return (
      <div className="liquid space-y-5 rounded-2xl p-6">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <div>
            <p className="font-display text-lg font-semibold tracking-[-.02em]">
              You’re on my radar
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{status.message}</p>
          </div>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[.2em] text-muted-foreground">
            What to expect
          </p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>1. I’ll read your brief and any attachment</li>
            <li>2. You’ll get a clear reply with next steps or clarifying questions</li>
            <li>3. If it’s a fit, we’ll book a short discovery call</li>
          </ul>
        </div>
        <div className="flex flex-wrap gap-3">
          {email && (
            <a
              href={`mailto:${email}`}
              className="liquid inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition hover:border-primary/40"
            >
              <Mail className="h-4 w-4 text-primary" />
              Email me
            </a>
          )}
          {whatsappHref && (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="liquid inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition hover:border-primary/40"
            >
              <MessageCircle className="h-4 w-4 text-primary" />
              WhatsApp
            </a>
          )}
          <button
            type="button"
            onClick={() => {
              setSucceeded(false);
              setStatus({ type: "", message: "" });
            }}
            className="text-sm text-muted-foreground underline-offset-4 hover:underline"
          >
            Send another message
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="liquid space-y-5 rounded-2xl p-6">
      <input
        type="text"
        name="company_website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] h-px w-px opacity-0"
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className={labelClass}>
            Full name <span className="text-primary">*</span>
          </label>
          <input
            id="contact-name"
            required
            name="name"
            autoComplete="name"
            maxLength="120"
            placeholder="Alex Johnson"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="contact-email" className={labelClass}>
            Email address <span className="text-primary">*</span>
          </label>
          <input
            id="contact-email"
            required
            name="email"
            type="email"
            autoComplete="email"
            maxLength="160"
            placeholder="alex@example.com"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="contact-phone" className={labelClass}>
            Phone
          </label>
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            maxLength="40"
            placeholder="+91 98765 43210"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="contact-topic" className={labelClass}>
            Topic
          </label>
          <div className="relative">
            <select
              id="contact-topic"
              name="topic"
              defaultValue={topics[0]}
              className={`${inputClass} appearance-none pr-10`}
            >
              {topics.map((topic) => (
                <option key={topic}>{topic}</option>
              ))}
            </select>
            <ChevronDown
              aria-hidden="true"
              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary"
            />
          </div>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="contact-budget" className={labelClass}>
            Budget range{" "}
            <span className="normal-case tracking-normal text-muted-foreground">
              (optional)
            </span>
          </label>
          <div className="relative">
            <select
              id="contact-budget"
              name="budget"
              defaultValue=""
              className={`${inputClass} appearance-none pr-10`}
            >
              <option value="">Prefer not to say</option>
              {budgetRanges.filter(Boolean).map((range) => (
                <option key={range} value={range}>
                  {range}
                </option>
              ))}
            </select>
            <ChevronDown
              aria-hidden="true"
              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary"
            />
          </div>
        </div>
      </div>
      <div>
        <label htmlFor="contact-message" className={labelClass}>
          Message <span className="text-primary">*</span>
        </label>
        <div className="relative">
          <textarea
            id="contact-message"
            required
            name="message"
            minLength="10"
            maxLength={maxMessageLength}
            rows="6"
            value={message}
            onChange={(event) =>
              setMessage(event.target.value.slice(0, maxMessageLength))
            }
            placeholder="What's the goal, who is it for, and what's your ideal timeline? Links or constraints help."
            className={`${inputClass} resize-none`}
          />
          <span className="absolute bottom-3 right-3 text-[10px] text-muted-foreground">
            {message.length}/{maxMessageLength}
          </span>
        </div>
      </div>
      <label
        htmlFor="contact-attachment"
        className="liquid inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition hover:border-primary/50"
      >
        <Paperclip aria-hidden="true" className="h-4 w-4 text-primary" />
        {fileName ? (
          <span className="max-w-[180px] truncate">{fileName}</span>
        ) : (
          <>
            Attach brief{" "}
            <span className="text-[10px] text-muted-foreground">
              JPG, PNG, WebP, GIF or PDF · max 8 MB
            </span>
          </>
        )}
        <input
          id="contact-attachment"
          name="attachment"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,application/pdf"
          className="sr-only"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file && file.size > 8 * 1024 * 1024) {
              event.target.value = "";
              setFileName("");
              setStatus({
                type: "error",
                message: "File is larger than 8 MB.",
              });
            } else {
              setFileName(file?.name || "");
            }
          }}
        />
      </label>
      <ul className="space-y-1.5 text-xs text-muted-foreground">
        <li>Typical reply within 12-24 hours</li>
        <li>You’ll get a clear next step - not a sales pitch</li>
        <li>Discovery call only if there’s a mutual fit</li>
      </ul>
      {status.message && status.type === "error" && (
        <p className="text-sm text-red-500">{status.message}</p>
      )}
      <button
        disabled={sending}
        className="bg-gradient-accent shadow-glow group inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {sending ? (
          "Sending…"
        ) : (
          <>
            Send message{" "}
            <ArrowUpRight className="h-4 w-4 transition group-hover:rotate-45" />
          </>
        )}
      </button>
    </form>
  );
}
