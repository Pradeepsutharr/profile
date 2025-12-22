import { google } from "googleapis";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE
);

export default async function handler(req, res) {
  const { messageIds } = req.body;

  if (!messageIds?.length) {
    return res.status(200).json({ success: true });
  }

  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );

  auth.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  });

  const gmail = google.gmail({ version: "v1", auth });

  // Mark read in Gmail
  await Promise.all(
    messageIds.map((id) =>
      gmail.users.messages.modify({
        userId: "me",
        id,
        requestBody: {
          removeLabelIds: ["UNREAD"],
        },
      })
    )
  );

  // Update Supabase
  await supabase
    .from("emails")
    .update({ is_read: true })
    .in("gmail_message_id", messageIds);

  res.json({ success: true });
}
