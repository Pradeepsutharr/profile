// pages/api/send-contact.js
import nodemailer from "nodemailer";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE =
  process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE env");
}

// create a server-side supabase client (service role)
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE, {
  auth: { persistSession: false },
});

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ ok: false, error: "Method not allowed" });

  const GMAIL_USER = process.env.GMAIL_USER;
  const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;
  const CONTACT_TO = process.env.CONTACT_TO;

  if (!GMAIL_USER || !GMAIL_APP_PASSWORD || !CONTACT_TO) {
    console.error("Missing email envs");
    return res
      .status(500)
      .json({ ok: false, error: "Server not configured to send emails" });
  }

  try {
    const body = req.body || {};
    // optional honeypot check
    if (body.website && body.website.trim() !== "") {
      return res.status(200).json({ ok: true }); // silently accept bots
    }

    const name = (body.name || "").trim();
    const email = (body.email || "").trim();
    const phone = (body.phone || "").trim();
    const topic = (body.topic || "Contact").trim();
    const message = (body.message || "").trim();
    const attachment_url = body.attachment_url || null;
    const attachment_name = body.attachment_name || null;

    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ ok: false, error: "name, email and message are required" });
    }

    // 1) Insert into Supabase table
    const row = {
      name,
      email,
      phone,
      topic,
      message,
      attachment_url,
      attachment_name,
      status: "new",
      created_at: new Date().toISOString(),
    };

    const { data: insertData, error: insertError } = await supabase
      .from("contacts")
      .insert([row])
      .select()
      .single();

    if (insertError) {
      console.error("[supabase] insert error:", insertError);
      // don't block sending mail if DB fails — up to you. We'll still try to send mail but return DB error info.
    } else {
      console.log("[supabase] inserted contact id:", insertData?.id);
    }

    // 2) Send email notification
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: GMAIL_USER,
        pass: GMAIL_APP_PASSWORD,
      },
    });

    // replace your existing `html = `...`` with this:
    const html = `
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>New contact message</title>
  <style>
    /* basic reset */
    body { margin:0; padding:0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial; background:#f4f6f8; color:#0f1720; }
    a { color: #2563eb; text-decoration: none; }
    .container { width:100%; max-width:680px; margin:28px auto; background:#ffffff; border-radius:12px; box-shadow:0 6px 18px rgba(15,23,32,0.06); overflow:hidden; }
    .header { padding:20px 24px; display:flex; align-items:center; gap:12px; background: linear-gradient(90deg,#0ea5a5 0%, #7c3aed 100%); color:white; }
    .brand { width:46px; height:46px; border-radius:8px; background:rgba(255,255,255,0.12); display:flex; align-items:center; justify-content:center; font-weight:700; font-size:18px; }
    .title { font-size:16px; font-weight:700; letter-spacing:-0.2px; }
    .content { padding:22px 24px; }
    .lead { color:#374151; font-size:14px; margin:0 0 12px 0; }
    .grid { display:grid; grid-template-columns: 1fr 1fr; gap:12px; margin:14px 0 18px; }
    .field { background:#f8fafc; padding:10px 12px; border-radius:8px; font-size:14px; color:#0f1720; }
    .label { font-size:12px; color:#6b7280; margin-bottom:6px; display:block; }
    .message { background:#f8fafc; padding:14px; border-radius:8px; font-size:14px; line-height:1.45; color:#111827; white-space:pre-wrap; }
    .btn { display:inline-block; padding:10px 16px; border-radius:8px; background:#0ea5a5; color:#fff; text-decoration:none; font-weight:600; }
    .meta { margin-top:18px; font-size:12px; color:#6b7280; }
    .footer { padding:18px 24px; font-size:12px; color:#9ca3af; text-align:center; background:#fbfdff; }
    @media (max-width:520px) {
      .grid { grid-template-columns: 1fr; }
      .header { padding:16px; gap:10px; }
      .content { padding:16px; }
    }
  </style>
</head>
<body>
  <div class="container" role="article" aria-label="New contact message">
    <div class="header" role="banner" style="width:36px;height:36px;border-radius:6px; overflow:hidden;">
      <div class="brand"><img src="https://pradeep-suthar.vercel.app/favicon.svg" alt="logo"  />
</div>
      <div>
        <div class="title">New message from your portfolio</div>
        <div style="font-size:12px; opacity:0.92;">Contact form — ${escapeHtml(
          topic
        )}</div>
      </div>
    </div>

    <div class="content">
      <p class="lead">Hey — you received a new message via the contact form. Details are below.</p>

      <div class="grid" role="table">
        <div>
          <div class="label">Name</div>
          <div class="field">${escapeHtml(name)}</div>
        </div>

        <div>
          <div class="label">Email</div>
          <div class="field"><a href="mailto:${escapeHtml(email)}">${escapeHtml(
      email
    )}</a></div>
        </div>

        <div>
          <div class="label">Phone</div>
          <div class="field">${escapeHtml(phone || "—")}</div>
        </div>

        <div>
          <div class="label">Topic</div>
          <div class="field">${escapeHtml(topic)}</div>
        </div>
      </div>

      <div>
        <div class="label">Message</div>
        <div class="message">${nl2br(escapeHtml(message))}</div>
      </div>

      <!-- Attachment button -->
      ${
        attachment_url
          ? `
      <div style="margin-top:16px;">
        <a class="btn" href="${escapeHtml(
          attachment_url
        )}" target="_blank" rel="noreferrer">Download attachment</a>
        <div style="margin-top:8px; font-size:12px; color:#6b7280;">Filename: ${escapeHtml(
          attachment_name || "attachment"
        )}</div>
      </div>
      `
          : ""
      }

      <div class="meta">Received: ${new Date().toISOString()}</div>
    </div>

    <div class="footer">
      This message was sent from your portfolio contact form — reply directly to the sender or visit your dashboard to manage messages.
    </div>
  </div>

  <!-- Plain-text fallback for mail clients that prefer text (nodemailer will use this if you supply a "text" body too) -->
</body>
</html>
`;

    const mailOptions = {
      from: `"Portfolio" <${GMAIL_USER}>`,
      to: CONTACT_TO,
      replyTo: email,
      subject: `Portfolio Inquiry — ${topic} — ${name}`,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info?.messageId);

    // Return success — include DB insert id if available
    return res.status(200).json({
      ok: true,
      inserted: insertData ? { id: insertData.id } : null,
      mail: !!info?.messageId,
      db_error: insertError ? insertError.message || insertError : null,
    });
  } catch (err) {
    console.error("send contact handler error:", err);
    return res
      .status(500)
      .json({ ok: false, error: "Failed to process contact" });
  }
}

// small helpers
function escapeHtml(str = "") {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
function nl2br(str = "") {
  return str.replace(/\n/g, "<br/>");
}
