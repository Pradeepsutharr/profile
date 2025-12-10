// pages/contact.jsx  (or wherever your contact page lives)
import React, { useState } from "react";
import { Send, Paperclip, CheckCircle } from "lucide-react";
// IMPORTANT: import the singleton supabase client (adjust path if necessary)
import { supabase } from "@/lib/supabaseClient";

/**
 * ContactPage
 * - Layout/design preserved exactly
 * - Uses shared supabase client (no createClient inside component)
 *
 * Requirements:
 * - NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local
 * - Storage bucket named "contact-attachments" exists in Supabase (or change BUCKET_NAME)
 * - pages/api/send-contact exists and proxies to your Supabase Edge Function
 */

const BUCKET_NAME = "portfolio"; // change if your bucket name differs
const MAX_FILE_MB = 8; // client-side file size limit

function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    topic: "Project Inquiry",
    message: "",
    website: "", // honeypot (hidden)
  });
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const topics = [
    "Project Inquiry",
    "Collaboration Request",
    "UI/UX Consultation",
    "Hiring / Job Opportunity",
    "Other",
  ];

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Please enter your name.";
    if (!form.email.trim()) e.email = "Please enter your email.";
    else if (!/^\S+@\S+\.\S+$/.test(form.email))
      e.email = "Please enter a valid email.";
    if (!form.message.trim()) e.message = "Please write a short message.";

    if (form.phone && form.phone.trim()) {
      const cleaned = form.phone.replace(/[^\d]/g, "");
      if (cleaned.length < 7 || cleaned.length > 15) {
        e.phone = "Please enter a valid phone number (7–15 digits).";
      } else if (!/^\+?[0-9\s\-()]+$/.test(form.phone)) {
        e.phone =
          "Phone may include only numbers, spaces, dashes and an optional +.";
      }
    }
    return e;
  }

  async function uploadAttachment(fileToUpload) {
    // client-side size check
    if (fileToUpload.size > MAX_FILE_MB * 1024 * 1024) {
      return {
        publicUrl: null,
        error: `File is too large (max ${MAX_FILE_MB} MB).`,
      };
    }

    try {
      const fd = new FormData();
      fd.append("file", fileToUpload);

      const res = await fetch("/api/upload-attachment", {
        method: "POST",
        body: fd,
      });

      const json = await res.json();
      if (!res.ok) {
        return { publicUrl: null, error: json?.error || "Upload failed" };
      }

      return {
        publicUrl: json.publicUrl || null,
        error: null,
        filename: json.filename || fileToUpload.name,
      };
    } catch (err) {
      return { publicUrl: null, error: String(err) };
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors({});
    const eobj = validate();
    if (Object.keys(eobj).length) {
      setErrors(eobj);
      return;
    }

    // honeypot client check
    if (form.website && form.website.trim() !== "") return;

    setSubmitting(true);
    setSuccess(false);

    try {
      let attachment_url = null;
      let attachment_name = null;

      if (file) {
        const { publicUrl, error, filename } = await uploadAttachment(file);
        if (error) {
          console.error("Attachment upload error:", error);
          setErrors({ form: `Attachment upload error: ${error}` });
          setSubmitting(false);
          return;
        }
        attachment_url = publicUrl;
        attachment_name = filename || file.name;
      }

      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        topic: form.topic,
        message: form.message.trim(),
        website: form.website || "",
        attachment_url,
        attachment_name,
      };

      const res = await fetch("/api/send-contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok) {
        console.error("submit error", json);
        setErrors({
          form: json?.error || "Failed to send message. Please try again.",
        });
      } else {
        setForm({
          name: "",
          email: "",
          phone: "",
          topic: "Project Inquiry",
          message: "",
          website: "",
        });
        setFile(null);
        setSuccess(true);
      }
    } catch (err) {
      console.error("submit exception", err);
      setErrors({ form: "Network error. Please try again." });
    } finally {
      setSubmitting(false);
      setTimeout(() => setSuccess(false), 4500);
    }
  }

  function handleFileChange(e) {
    const f = e.target.files?.[0] || null;
    setFile(f);
  }

  return (
    <section className="">
      <span className="text-3xl text-main font-semibold block">Contact</span>
      <div className="bg-primary w-10 h-[5px] rounded-full my-5"></div>
      <div className="flex items-start gap-8">
        <div className="flex-1">
          <h1 className="text-subtle leading-loose">
            Have a project or just want to say hi? I typically reply within{" "}
            <strong>12-24 hours</strong>. Share a short brief and I’ll get back
            with next steps.
          </h1>

          <form onSubmit={handleSubmit} className="mt-6">
            <div className="flex flex-wrap -m-3">
              <div className="col-12 md:col-6 lg:col-6">
                <label className="block text-subtle text-sm mb-2">
                  Full name
                </label>
                <input
                  value={form.name}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, name: e.target.value }))
                  }
                  type="text"
                  placeholder="Full name"
                  className={`w-full p-3 rounded-xl bg-transparent border ${
                    errors.name ? "border-red-500" : "border-stroke"
                  } text-main focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary`}
                  aria-invalid={!!errors.name}
                />
                {errors.name && (
                  <p className="text-xs text-red-400 mt-2">{errors.name}</p>
                )}
              </div>

              <div className="col-12 md:col-6 lg:col-6">
                <label className="block text-subtle text-sm mb-2">
                  Email address
                </label>
                <input
                  value={form.email}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, email: e.target.value }))
                  }
                  type="email"
                  placeholder="Email address"
                  className={`w-full p-3 rounded-xl bg-transparent border ${
                    errors.email ? "border-red-500" : "border-stroke"
                  } text-main focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary`}
                  aria-invalid={!!errors.email}
                />
                {errors.email && (
                  <p className="text-xs text-red-400 mt-2">{errors.email}</p>
                )}
              </div>
            </div>

            <div className="flex -m-3 mt-4">
              <div className="col-12 md:col-6 lg:col-6">
                <label className="block text-subtle text-sm mb-2">
                  Phone (optional)
                </label>
                <input
                  value={form.phone || ""}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, phone: e.target.value }))
                  }
                  type="tel"
                  placeholder="e.g. +91 98765 43210"
                  className={`w-full p-3 rounded-xl bg-transparent border ${
                    errors.phone ? "border-red-500" : "border-stroke"
                  } text-main focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary`}
                  aria-invalid={!!errors.phone}
                />
                {errors.phone && (
                  <p className="text-xs text-red-400 mt-2">{errors.phone}</p>
                )}
              </div>

              <div className="col-12 md:col-6 lg:col-6">
                <label className="block text-subtle text-sm mb-2">Topic</label>
                <select
                  value={form.topic}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, topic: e.target.value }))
                  }
                  className="w-full p-3  rounded-xl bg-transparent border border-stroke text-main focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                >
                  {topics.map((t) => (
                    <option key={t} value={t} className="bg-background">
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-7">
              <label className="block text-subtle text-sm mb-2">Message</label>
              <textarea
                value={form.message}
                onChange={(e) =>
                  setForm((s) => ({ ...s, message: e.target.value }))
                }
                rows={3}
                placeholder="Describe your project, timeline and budget (if any)..."
                className={`w-full p-3 rounded-xl bg-transparent border ${
                  errors.message ? "border-red-500" : "border-stroke"
                } text-main focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary resize-none`}
                aria-invalid={!!errors.message}
              />
              {errors.message && (
                <p className="text-xs text-red-400 mt-2">{errors.message}</p>
              )}
            </div>

            <div className="mt-5 flex items-center gap-4">
              <input
                id="attachment"
                type="file"
                accept=".pdf,.doc,.docx,.zip,.png,.jpg,.jpeg"
                onChange={handleFileChange}
                className="hidden"
              />
              <label htmlFor="attachment" className="ml-0">
                <div className="icon-box px-3 py-2 rounded-xl bg-transparent text-main cursor-pointer inline-flex items-center gap-3">
                  <Paperclip color="#ffdb70" size={16} />
                  <span className="text-sm">Choose file</span>
                </div>
              </label>

              {file && (
                <div className="ml-3 text-sm text-subtle truncate max-w-xs">
                  {file.name}{" "}
                  <span className="text-xs text-subtle">
                    • {(file.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
              )}
            </div>

            {/* hidden honeypot */}
            <input
              type="text"
              name="website"
              value={form.website}
              onChange={(e) =>
                setForm((s) => ({ ...s, website: e.target.value }))
              }
              style={{ display: "none" }}
              autoComplete="off"
              tabIndex={-1}
            />

            {/* server/form error */}
            {errors.form && (
              <p className="text-xs text-red-400 mt-3">{errors.form}</p>
            )}

            <div className="mt-6 flex items-center gap-3">
              <button
                type="submit"
                className="icon-box py-4 px-6 rounded-full text-primary flex gap-3 items-center ml-auto"
                disabled={submitting}
                aria-busy={submitting}
              >
                <Send size={18} />
                <span>{submitting ? "Sending..." : "Send Message"}</span>
              </button>

              {/* success indicator */}
              {success && (
                <div className="flex items-center gap-2 ml-4 rounded-lg px-3 py-2 bg-[rgba(255,219,112,0.08)] border border-stroke">
                  <CheckCircle size={18} className="text-primary" />
                  <div className="text-sm">
                    <div className="text-main font-medium">Message sent</div>
                    <div className="text-subtle text-xs">
                      I’ll be in touch soon — thanks!
                    </div>
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default ContactPage;
