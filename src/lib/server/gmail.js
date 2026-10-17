import "server-only";

import { google } from "googleapis";
import { ApiError } from "./errors";
import { query } from "./db";

function gmail() {
  const required = ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "GOOGLE_REFRESH_TOKEN", "ADMIN_GMAIL"];
  if (required.some((key) => !process.env[key])) throw new ApiError(503, "Gmail integration is not configured");
  const auth = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);
  auth.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
  return google.gmail({ version: "v1", auth });
}

function decode(value = "") { return Buffer.from(value.replaceAll("-", "+").replaceAll("_", "/"), "base64").toString("utf8"); }

function content(parts, type) {
  for (const part of parts || []) {
    if (part.mimeType === type && part.body?.data) return decode(part.body.data);
    const nested = content(part.parts, type);
    if (nested) return nested;
  }
  return "";
}

function parse(message) {
  const headers = Object.fromEntries((message.payload?.headers || []).map((header) => [header.name.toLowerCase(), header.value]));
  const from = headers.from || "";
  const match = from.match(/(.*)<(.+)>/);
  return {
    gmail_message_id: message.id, gmail_thread_id: message.threadId,
    direction: (match ? match[2].trim() : from.trim()).toLowerCase() === process.env.ADMIN_GMAIL?.toLowerCase() ? "outbound" : "inbound",
    from_name: match ? match[1].trim().replace(/(^\"|\"$)/g, "") : null,
    from_email: match ? match[2].trim() : from.trim(), to_email: headers.to || "", subject: headers.subject || "(no subject)",
    body_text: content(message.payload?.parts, "text/plain") || message.snippet || "", body_html: content(message.payload?.parts, "text/html") || null,
    snippet: message.snippet || "", is_read: !message.labelIds?.includes("UNREAD"), is_starred: message.labelIds?.includes("STARRED"),
    created_at: new Date(Number(message.internalDate)),
  };
}

export async function syncEmail() {
  const api = gmail();
  const response = await api.users.messages.list({ userId: "me", q: "in:anywhere -in:trash", maxResults: 50 });
  const threadIds = [...new Set((response.data.messages || []).map((message) => message.threadId).filter(Boolean))];
  for (const threadId of threadIds) {
    const thread = await api.users.threads.get({ userId: "me", id: threadId });
    for (const message of thread.data.messages || []) {
      if (message.labelIds?.some((label) => label === "TRASH" || label === "SPAM")) continue;
      const email = parse(message);
      await query(`INSERT INTO emails (gmail_message_id, gmail_thread_id, direction, from_name, from_email, to_email, subject, body_text, body_html, snippet, is_read, is_starred, created_at)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) ON CONFLICT (gmail_message_id) DO UPDATE SET is_read = EXCLUDED.is_read, is_starred = EXCLUDED.is_starred`,
      [email.gmail_message_id, email.gmail_thread_id, email.direction, email.from_name, email.from_email, email.to_email, email.subject, email.body_text, email.body_html, email.snippet, email.is_read, email.is_starred, email.created_at]);
    }
  }
  return { threadsSynced: threadIds.length };
}

function rawMessage({ to, subject, html }) {
  return Buffer.from([`From: ${process.env.ADMIN_GMAIL}`, `To: ${to}`, `Subject: ${subject}`, "MIME-Version: 1.0", "Content-Type: text/html; charset=UTF-8", "", html].join("\r\n")).toString("base64url");
}

export async function reply({ threadId, to, subject, html }) {
  if (!threadId || !to || !subject || !html) throw new ApiError(400, "Thread, recipient, subject, and message are required");
  const sent = await gmail().users.messages.send({ userId: "me", requestBody: { raw: rawMessage({ to, subject, html }), threadId } });
  const { rows } = await query("INSERT INTO emails (gmail_message_id, gmail_thread_id, direction, from_email, to_email, subject, body_html, body_text, is_read) VALUES ($1,$2,'outbound',$3,$4,$5,$6,$6,true) RETURNING *", [sent.data.id, threadId, process.env.ADMIN_GMAIL, to, subject, html]);
  return rows[0];
}

export async function markRead(messageIds) {
  if (!Array.isArray(messageIds) || !messageIds.length) throw new ApiError(400, "Message ids are required");
  const api = gmail();
  await Promise.all(messageIds.map((id) => api.users.messages.modify({ userId: "me", id, requestBody: { removeLabelIds: ["UNREAD"] } })));
  await query("UPDATE emails SET is_read = true, updated_at = now() WHERE gmail_message_id = ANY($1::text[])", [messageIds]);
}

export async function star(messageId, enabled) {
  if (!messageId) throw new ApiError(400, "Message id is required");
  await gmail().users.messages.modify({ userId: "me", id: messageId, requestBody: enabled ? { addLabelIds: ["STARRED"] } : { removeLabelIds: ["STARRED"] } });
  await query("UPDATE emails SET is_starred = $1, updated_at = now() WHERE gmail_message_id = $2", [Boolean(enabled), messageId]);
}

export async function archive(threadId) {
  if (!threadId) throw new ApiError(400, "Thread id is required");
  await gmail().users.threads.trash({ userId: "me", id: threadId });
  await query("DELETE FROM emails WHERE gmail_thread_id = $1", [threadId]);
}
