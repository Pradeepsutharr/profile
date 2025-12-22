// pages/api/admin/reply.js
import { google } from "googleapis";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE
);

// Helper: create raw MIME email
function createRawEmail({ from, to, subject, html }) {
  const message = [
    `From: ${from}`,
    `To: ${to}`,
    `Subject: ${subject}`,
    "MIME-Version: 1.0",
    "Content-Type: text/html; charset=UTF-8",
    "",
    html,
  ].join("\n");

  return Buffer.from(message)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false });
  }

  try {
    const { threadId, to, subject, html } = req.body;

    if (!threadId || !to || !html) {
      return res.status(400).json({
        ok: false,
        error: "Missing required fields",
      });
    }

    // Gmail OAuth
    const auth = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );

    auth.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    });

    const gmail = google.gmail({ version: "v1", auth });

    // Create raw email
    const raw = createRawEmail({
      from: process.env.ADMIN_GMAIL,
      to,
      subject,
      html,
    });

    // Send reply in SAME THREAD
    const sent = await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw,
        threadId,
      },
    });

    // Save reply in Supabase
    await supabase.from("emails").insert({
      gmail_message_id: sent.data.id,
      gmail_thread_id: threadId,
      direction: "outbound",
      from_email: process.env.ADMIN_GMAIL,
      to_email: to,
      subject,
      body_html: html,
      is_read: true,
    });

    return res.json({ ok: true });
  } catch (err) {
    console.error("REPLY ERROR:", err);
    return res.status(500).json({
      ok: false,
      error: err.message,
    });
  }
}
