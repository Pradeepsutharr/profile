// pages/api/upload-attachment.js
import formidable from "formidable";
import fs from "fs";
import { createClient } from "@supabase/supabase-js";

export const config = {
  api: {
    bodyParser: false,
  },
};

const BUCKET = "portfolio"; // change if your bucket differs
const MAX_FILE_MB = 12;

function parseForm(req) {
  // use the modern factory form of formidable
  const form = formidable({ multiples: false, keepExtensions: true });
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ ok: false, error: "Method not allowed" });

  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE || "";

  console.log("[upload] env NEXT_PUBLIC_SUPABASE_URL present:", !!SUPABASE_URL);
  console.log(
    "[upload] env SUPABASE_SERVICE_ROLE present:",
    !!SUPABASE_SERVICE_ROLE
  );
  console.log("[upload] BUCKET:", BUCKET);

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE) {
    console.error("[upload] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE");
    return res.status(500).json({
      ok: false,
      error:
        "Server not configured: missing SUPABASE_URL or SUPABASE_SERVICE_ROLE",
    });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);

  try {
    const { files } = await parseForm(req);
    const file = files?.file;
    if (!file) {
      return res
        .status(400)
        .json({ ok: false, error: "No file uploaded (field name 'file')" });
    }

    // formidable may return single file as object; ensure it's the right shape
    const f = Array.isArray(file) ? file[0] : file;

    // get size: prefer f.size when available, otherwise fs.statSync
    let sizeBytes = f.size;
    if (!sizeBytes && f.filepath) {
      try {
        const st = fs.statSync(f.filepath);
        sizeBytes = st.size;
      } catch (e) {
        // fallback
        sizeBytes = 0;
      }
    }

    if (sizeBytes > MAX_FILE_MB * 1024 * 1024) {
      return res
        .status(400)
        .json({ ok: false, error: `File too large. Max ${MAX_FILE_MB} MB.` });
    }

    const buf = fs.readFileSync(f.filepath);
    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2)}-${(
      f.originalFilename || "attachment"
    ).replace(/\s+/g, "_")}`;

    console.log("[upload] uploading:", safeName, "size:", sizeBytes);

    const { error: uploadErr } = await supabase.storage
      .from(BUCKET)
      .upload(safeName, buf, {
        cacheControl: "3600",
        upsert: false,
        contentType: f.mimetype || undefined,
      });

    if (uploadErr) {
      console.error("[upload] Supabase upload error:", uploadErr);
      return res.status(500).json({
        ok: false,
        error: uploadErr.message || JSON.stringify(uploadErr),
      });
    }

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(safeName);
    const publicUrl = data?.publicUrl || null;

    console.log("[upload] success publicUrl:", publicUrl);
    return res.status(200).json({ ok: true, publicUrl, filename: safeName });
  } catch (err) {
    console.error("[upload] handler error:", err);
    return res.status(500).json({ ok: false, error: String(err) });
  }
}
