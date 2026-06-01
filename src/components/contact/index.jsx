// pages/contact.jsx
import React, { useState, useEffect, useRef } from "react";
import { Send, Paperclip, CheckCircle, X, ArrowUpRight, Mail, Phone, MapPin } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

const BUCKET = "portfolio";
const MAX_FILE_MB = 8;

const topics = [
  "Project Inquiry",
  "Collaboration Request",
  "UI/UX Consultation",
  "Hiring / Job Opportunity",
  "Other",
];

/* ── tiny util ── */
const cx = (...classes) => classes.filter(Boolean).join(" ");

function FloatingInput({ label, error, children, required }) {
  return (
    <div className="relative group">
      <label
        className={cx(
          "block text-[10px] font-bold tracking-[0.18em] uppercase mb-2 transition-colors duration-200",
          error ? "text-red-400" : "text-[#979798] group-focus-within:text-primary"
        )}
      >
        {label}
        {required && <span className="text-primary ml-0.5">*</span>}
      </label>
      {children}
      {error && (
        <p className="flex items-center gap-1 text-[11px] text-red-400 mt-1.5 animate-[fadeIn_0.2s_ease]">
          <span className="inline-block w-1 h-1 rounded-full bg-red-400 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

const inputClass = (hasError) =>
  cx(
    "w-full px-4 py-3.5 rounded-xl text-[14px] text-main placeholder:text-[#4a4a4b]",
    "bg-[#252527] border transition-all duration-200 outline-none",
    "focus:bg-[#2a2a2c] focus:ring-2 focus:ring-primary/20",
    hasError
      ? "border-red-500/60 focus:border-red-400"
      : "border-[#2e2e30] focus:border-primary/50"
  );

/* ── Animated line ── */
function AnimLine({ delay = 0 }) {
  return (
    <div
      className="absolute left-0 top-0 h-px bg-gradient-to-r from-primary/60 via-primary/20 to-transparent"
      style={{
        animation: `slideRight 2.4s ease-in-out infinite`,
        animationDelay: `${delay}s`,
        width: "100%",
      }}
    />
  );
}

/* ── Glow orb ── */
function GlowOrb({ className }) {
  return (
    <div
      className={cx(
        "absolute rounded-full pointer-events-none",
        className
      )}
      style={{ filter: "blur(80px)" }}
    />
  );
}

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "", email: "", phone: "", topic: "Project Inquiry", message: "", website: "",
  });
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [focused, setFocused] = useState(null);
  const [charCount, setCharCount] = useState(0);
  const fileRef = useRef(null);

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActiveUser();
  }, []);

  async function loadActiveUser() {
    setLoading(true);

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("is_active", true)
      .single();

    if (error) {
      console.error("Failed to load active user:", error);
      setUser(null);
      setLoading(false);
      return;
    }

    let avatar_url = data.avatar_url;

    // If we only stored avatar_path, convert it to a public URL
    if (data.avatar_path) {
      const { data: publicData } = supabase.storage
        .from(BUCKET)
        .getPublicUrl(data.avatar_path);

      avatar_url = publicData?.publicUrl || avatar_url || null;
    }

    setUser({ ...data, avatar_url });
    setLoading(false);
  }




  const set = (k) => (e) => setForm((s) => ({ ...s, [k]: e.target.value }));

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required.";
    if (!form.email.trim()) e.email = "Email is required.";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email.";
    if (!form.message.trim()) e.message = "Message is required.";
    if (form.phone?.trim()) {
      const d = form.phone.replace(/[^\d]/g, "");
      if (d.length < 7 || d.length > 15) e.phone = "Enter a valid phone (7–15 digits).";
    }
    return e;
  }

  async function uploadAttachment(f) {
    if (f.size > MAX_FILE_MB * 1024 * 1024)
      return { publicUrl: null, error: `Max ${MAX_FILE_MB} MB allowed.` };
    try {
      const fd = new FormData();
      fd.append("file", f);
      const res = await fetch("/api/upload-attachment", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) return { publicUrl: null, error: json?.error || "Upload failed" };
      return { publicUrl: json.publicUrl || null, error: null, filename: json.filename || f.name };
    } catch (err) {
      return { publicUrl: null, error: String(err) };
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors({});
    const eobj = validate();
    if (Object.keys(eobj).length) { setErrors(eobj); return; }
    if (form.website?.trim()) return;
    setSubmitting(true);
    try {
      let attachment_url = null, attachment_name = null;
      if (file) {
        const { publicUrl, error, filename } = await uploadAttachment(file);
        if (error) { setErrors({ form: `Attachment error: ${error}` }); setSubmitting(false); return; }
        attachment_url = publicUrl;
        attachment_name = filename || file.name;
      }
      const payload = {
        name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim(),
        topic: form.topic, message: form.message.trim(),
        website: form.website || "", attachment_url, attachment_name,
      };
      const res = await fetch("/api/send-contact", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) {
        setErrors({ form: json?.error || "Failed to send. Please try again." });
      } else {
        setForm({ name: "", email: "", phone: "", topic: "Project Inquiry", message: "", website: "" });
        setFile(null); setCharCount(0); setSuccess(true);
      }
    } catch {
      setErrors({ form: "Network error. Please try again." });
    } finally {
      setSubmitting(false);
      setTimeout(() => setSuccess(false), 5000);
    }
  }

  return (
    <section className="relative overflow-hidden">

      {/* ambient glow orbs */}
      <GlowOrb className="w-96 h-96 bg-primary/6 -top-24 -right-32" />
      <GlowOrb className="w-64 h-64 bg-primary/4 bottom-20 -left-16" />

      {/* ── Header ── */}
      <div className="relative mb-10">
        <div className="flex items-baseline gap-4 mb-1">
          <span className="text-3xl text-primary font-bold">Get in touch</span>
        </div>
        <h1 className="text-4xl md:text-5xl text-main font-semibold capitalize leading-[1.1] mt-7">
          Let's build something {" "}
          <span className="text-primary">remarkable.</span>
        </h1>

        <div className="mt-5 h-px w-full bg-gradient-to-r from-stroke via-stroke/30 to-transparent relative overflow-hidden">
          <AnimLine delay={0} />
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-12 items-start">
        {/* ── LEFT — Form ── */}
        <div>
          <p className="text-subtle/70 text-[14px] leading-relaxed mb-8 max-w-lg">
            Have a project or just want to say hi? I typically reply within{" "}
            <span className="text-primary font-semibold">12–24 hours</span>.
            Share a brief and I'll get back with next steps.
          </p>

          <form onSubmit={handleSubmit} noValidate>

            {/* Row 1 */}
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <FloatingInput label="Full name" error={errors.name} required>
                <input
                  value={form.name} onChange={set("name")} type="text"
                  placeholder="Alex Johnson"
                  onFocus={() => setFocused("name")} onBlur={() => setFocused(null)}
                  className={inputClass(errors.name)}
                  aria-invalid={!!errors.name}
                />
              </FloatingInput>

              <FloatingInput label="Email address" error={errors.email} required>
                <input
                  value={form.email} onChange={set("email")} type="email"
                  placeholder="alex@example.com"
                  onFocus={() => setFocused("email")} onBlur={() => setFocused(null)}
                  className={inputClass(errors.email)}
                  aria-invalid={!!errors.email}
                />
              </FloatingInput>
            </div>

            {/* Row 2 */}
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <FloatingInput label="Phone" error={errors.phone}>
                <input
                  value={form.phone || ""} onChange={set("phone")} type="tel"
                  placeholder="+91 98765 43210"
                  onFocus={() => setFocused("phone")} onBlur={() => setFocused(null)}
                  className={inputClass(errors.phone)}
                  aria-invalid={!!errors.phone}
                />
              </FloatingInput>

              <FloatingInput label="Topic">
                <select
                  value={form.topic} onChange={set("topic")}
                  className={cx(inputClass(false), "cursor-pointer appearance-none")}
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23ffdb70' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 14px center",
                  }}
                >
                  {topics.map((t) => (
                    <option key={t} value={t} className="bg-[#1e1e1f] text-main">{t}</option>
                  ))}
                </select>
              </FloatingInput>
            </div>

            {/* Message */}
            <div className="mb-5">
              <FloatingInput label="Message" error={errors.message} required>
                <div className="relative">
                  <textarea
                    value={form.message}
                    onChange={(e) => { set("message")(e); setCharCount(e.target.value.length); }}
                    rows={5}
                    placeholder="Describe your project, timeline, and budget (if any)…"
                    onFocus={() => setFocused("message")} onBlur={() => setFocused(null)}
                    className={cx(inputClass(errors.message), "resize-none")}
                    aria-invalid={!!errors.message}
                  />
                  <span className={cx(
                    "absolute bottom-3 right-3.5 text-[10px] tabular-nums transition-colors",
                    charCount > 800 ? "text-primary" : "text-[#4a4a4b]"
                  )}>
                    {charCount}
                  </span>
                </div>
              </FloatingInput>
            </div>

            {/* Attachment */}
            <div className="mb-6">
              <input
                ref={fileRef} id="attachment" type="file"
                accept=".pdf,.doc,.docx,.zip,.png,.jpg,.jpeg"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="hidden"
              />
              {file ? (
                <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-primary/20 bg-primary/5 w-fit">
                  <Paperclip size={13} className="text-primary shrink-0" />
                  <span className="text-[13px] text-main truncate max-w-[200px]">{file.name}</span>
                  <span className="text-[11px] text-subtle/50">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                  <button
                    type="button" onClick={() => setFile(null)}
                    className="ml-1 text-[#5a5a5c] hover:text-red-400 transition-colors"
                    aria-label="Remove attachment"
                  >
                    <X size={13} />
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="attachment"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#2e2e30] text-subtle hover:border-primary/30 hover:text-primary cursor-pointer transition-all duration-200 text-[13px] font-medium"
                >
                  <Paperclip size={13} />
                  Attach file
                  <span className="text-[#4a4a4b] text-[11px]">(max {MAX_FILE_MB} MB)</span>
                </label>
              )}
            </div>

            {/* honeypot */}
            <input type="text" name="website" value={form.website} onChange={set("website")}
              style={{ display: "none" }} autoComplete="off" tabIndex={-1} />

            {errors.form && (
              <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/8 border border-red-500/20 text-[13px] text-red-400 animate-[fadeIn_0.2s_ease]">
                {errors.form}
              </div>
            )}

            {/* Submit row */}
            <div className="flex flex-wrap items-center gap-4 mt-2">
              <button
                type="submit" disabled={submitting} aria-busy={submitting}
                className={cx(
                  "relative group flex items-center gap-2.5 px-7 py-3.5 rounded-full font-semibold text-[14px] text-background overflow-hidden",
                  "bg-primary transition-all duration-300",
                  submitting ? "opacity-70 cursor-not-allowed" : "hover:scale-[1.03] active:scale-[0.97] hover:shadow-[0_0_24px_rgba(255,219,112,0.25)]"
                )}
              >
                {submitting ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                    Sending…
                  </>
                ) : (
                  <>
                    Send Message
                    <ArrowUpRight size={15} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </>
                )}
                {/* shimmer sweep */}
                {!submitting && (
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                )}
              </button>

              {success && (
                <div
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-primary/8 border border-primary/20"
                  style={{ animation: "scaleIn 0.3s ease" }}
                >
                  <CheckCircle size={16} className="text-primary shrink-0" />
                  <div>
                    <div className="text-[13px] text-main font-semibold">Message sent!</div>
                    <div className="text-[11px] text-subtle/70">I'll reply within 12–24 hours.</div>
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* ── RIGHT — Info panel ── */}
        <aside className="space-y-3 pt-1 lg:pt-16">
          {[
            {
              Icon: Mail,
              label: "Email",
              value: user?.email,
              href: `mailto:${user?.email}`,
            },
            {
              Icon: Phone,
              label: "Phone",
              value: user?.phone,
              href: `tel:${user?.phone}`,
            },
            {
              Icon: MapPin,
              label: "Location",
              value: user?.location ? `${user?.location?.city}, ${user?.location?.state}, ${user?.location?.country}` : null,
              href: null,
            },
          ].map(({ Icon, label, value, href }) => (
            <div
              key={label}
              className="group flex items-start gap-4 px-4 py-4 rounded-xl border border-[#2a2a2c] bg-[#212123]/40 hover:border-primary/20 hover:bg-[#252527]/60 transition-all duration-300"
            >
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors">
                <Icon size={15} className="text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#5a5a5c] mb-0.5">{label}</p>
                {href ? (
                  <a href={href} className="text-[13px] text-subtle hover:text-primary transition-colors truncate block">{value}</a>
                ) : (
                  <span className="text-[13px] text-subtle capitalize">{value}</span>
                )}
              </div>
            </div>
          ))}

          {/* availability badge */}
          <div className="mt-5 px-4 py-3.5 rounded-xl border border-[#2a2a2c] bg-[#212123]/40">
            <div className="flex items-center gap-2 mb-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
              </span>
              <span className="text-[11px] font-semibold text-green-400 tracking-wide uppercase">Available for work</span>
            </div>
            {/* <p className="text-[12px] text-subtle/60 leading-snug">
              Currently taking on select projects for Q3 2025.
            </p> */}
          </div>
        </aside>
      </div>
    </section>
  );
}