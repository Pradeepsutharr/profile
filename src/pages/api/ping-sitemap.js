export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  try {
    await fetch(
      "https://www.google.com/ping?sitemap=https://pradeep-suthar.vercel.app/sitemap.xml"
    );

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Google ping failed", err);
    res.status(500).json({ success: false });
  }
}
