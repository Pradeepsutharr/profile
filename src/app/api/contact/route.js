import { NextResponse } from "next/server";
import { z } from "zod";
import { query } from "@/lib/server/db";
import { ApiError, withApi } from "@/lib/server/errors";
import { limit } from "@/lib/server/rate-limit";
import { uploadFile } from "@/lib/server/storage";

const schema = z.object({ name: z.string().trim().min(2).max(120), email: z.string().email().max(160), phone: z.string().trim().max(40).optional(), topic: z.string().trim().max(120).optional(), message: z.string().trim().min(10).max(3000) });

export async function POST(request) {
  return withApi(async () => {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "local";
    limit(`contact:${ip}`, 5, 60 * 60 * 1000);
    const form = await request.formData();
    const data = schema.parse(Object.fromEntries(form));
    const attachment = form.get("attachment");
    const uploaded = attachment?.size ? await uploadFile(attachment, "contact-attachments") : null;
    const { rows } = await query(
      "INSERT INTO contacts (name, email, phone, topic, message, attachment_url, attachment_name) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id",
      [data.name, data.email, data.phone || null, data.topic || null, data.message, uploaded?.url || null, uploaded?.name || null],
    );
    return NextResponse.json({ data: { id: rows[0].id } }, { status: 201 });
  });
}
