import { NextResponse } from "next/server";
import { z } from "zod";
import { query } from "@/lib/server/db";
import { ApiError, withApi } from "@/lib/server/errors";
import { limit } from "@/lib/server/rate-limit";
import { uploadFile } from "@/lib/server/storage";

const schema = z.object({
  name: z
    .string({ required_error: "Name is required." })
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(120, "Name must be 120 characters or fewer."),
  email: z
    .string({ required_error: "Email is required." })
    .trim()
    .email("Enter a valid email address.")
    .max(160, "Email must be 160 characters or fewer."),
  phone: z
    .string()
    .trim()
    .max(40, "Phone must be 40 characters or fewer.")
    .optional()
    .or(z.literal("")),
  topic: z
    .string()
    .trim()
    .max(120, "Topic must be 120 characters or fewer.")
    .optional()
    .or(z.literal("")),
  budget: z
    .string()
    .trim()
    .max(40, "Budget must be 40 characters or fewer.")
    .optional()
    .or(z.literal("")),
  message: z
    .string({ required_error: "Message is required." })
    .trim()
    .min(10, "Message must be at least 10 characters.")
    .max(3000, "Message must be 3000 characters or fewer."),
});

export async function POST(request) {
  return withApi(async () => {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "local";
    limit(`contact:${ip}`, 5, 60 * 60 * 1000);
    const form = await request.formData();
    const data = schema.parse(Object.fromEntries(form));
    const attachment = form.get("attachment");
    const uploaded = attachment?.size ? await uploadFile(attachment, "contact-attachments") : null;
    const message = data.budget
      ? `${data.message}\n\n - Budget range: ${data.budget}`
      : data.message;
    const { rows } = await query(
      "INSERT INTO contacts (name, email, phone, topic, message, attachment_url, attachment_name) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id",
      [data.name, data.email, data.phone || null, data.topic || null, message, uploaded?.url || null, uploaded?.name || null],
    );
    return NextResponse.json({ data: { id: rows[0].id } }, { status: 201 });
  });
}
