import { google } from "googleapis";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false });
  }

  try {
    const { threadId } = req.body;
    if (!threadId) {
      return res.status(400).json({ ok: false, error: "threadId required" });
    }

    // Gmail auth
    const auth = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );

    auth.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    });

    const gmail = google.gmail({ version: "v1", auth });

    // 🔥 MOVE THREAD TO TRASH (GMAIL)
    await gmail.users.threads.trash({
      userId: "me",
      id: threadId,
    });

    // 🔥 DELETE FROM SUPABASE
    await supabase.from("emails").delete().eq("gmail_thread_id", threadId);

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("DELETE THREAD ERROR:", err);
    return res.status(500).json({ ok: false, error: err.message });
  }
}
