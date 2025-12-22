import { google } from "googleapis";
import { createClient } from "@supabase/supabase-js";
import { parseGmailMessage } from "@/lib/gmailParser";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE
);

function parseFromHeader(from = "") {
  // Example: "John Doe <john@gmail.com>"
  const match = from.match(/(.*)<(.+)>/);

  if (!match) {
    return {
      name: null,
      email: from.trim(),
    };
  }

  return {
    name: match[1].trim().replace(/(^"|"$)/g, ""),
    email: match[2].trim(),
  };
}

export default async function handler(req, res) {
  try {
    const auth = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );

    auth.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    });

    const gmail = google.gmail({ version: "v1", auth });

    // Fetch recent messages from anywhere
    const listRes = await gmail.users.messages.list({
      userId: "me",
      q: "in:anywhere -in:trash",
      maxResults: 20,
    });

    const messages = listRes.data.messages || [];
    const processedThreads = new Set();

    for (const msg of messages) {
      // Avoid fetching same thread multiple times
      if (processedThreads.has(msg.threadId)) continue;
      processedThreads.add(msg.threadId);

      const thread = await gmail.users.threads.get({
        userId: "me",
        id: msg.threadId,
      });

      // 🔥 THREAD-LEVEL GUARD (CRITICAL)
      const allMessagesTrashed = thread.data.messages.every((m) =>
        m.labelIds?.includes("TRASH")
      );

      if (allMessagesTrashed) {
        continue;
      }

      for (const message of thread.data.messages) {
        if (
          message.labelIds?.includes("TRASH") ||
          message.labelIds?.includes("SPAM")
        ) {
          continue;
        }
        // Skip if already saved
        const { data: existing } = await supabase
          .from("emails")
          .select("id")
          .eq("gmail_message_id", message.id)
          .maybeSingle();

        if (existing) continue;

        const headers = {};
        message.payload.headers.forEach((h) => {
          headers[h.name.toLowerCase()] = h.value;
        });

        const { name: from_name, email: from_email } = parseFromHeader(
          headers.from || ""
        );

        const isOutbound = from_email === process.env.ADMIN_GMAIL;

        const parsed = parseGmailMessage(message);
        // const cleanMessage =
        //   extractUserMessageFromHtml(parsed.body_html) ||
        //   parsed.body_text ||
        //   parsed.snippet;

        await supabase.from("emails").insert({
          gmail_message_id: message.id,
          gmail_thread_id: message.threadId,
          direction: isOutbound ? "outbound" : "inbound",

          from_name,
          from_email,
          to_email: parsed.to || headers.to || "",
          subject: parsed.subject || "(no subject)",

          body_text: parsed.body_text, // ✅ CLEAN TEXT ONLY
          body_html: parsed.body_html, // optional
          snippet: parsed.snippet,

          is_read: !message.labelIds?.includes("UNREAD"),
          is_starred: message.labelIds?.includes("STARRED"),
          created_at: new Date(Number(message.internalDate)).toISOString(),
        });
      }
    }

    return res.status(200).json({
      success: true,
      threadsSynced: processedThreads.size,
    });
  } catch (err) {
    console.error("SYNC ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
}
