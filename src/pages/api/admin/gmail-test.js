import { google } from "googleapis";

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

    const labels = await gmail.users.labels.list({ userId: "me" });

    res.status(200).json({
      success: true,
      labels: labels.data.labels.map((l) => l.name),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
