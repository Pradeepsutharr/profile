import { NextResponse } from "next/server";
import { z } from "zod";
import { authenticate, createSession, sessionCookie } from "@/lib/server/auth";
import { readJson, withApi } from "@/lib/server/errors";
import { limit } from "@/lib/server/rate-limit";

const schema = z.object({
  email: z
    .string({ required_error: "Email is required." })
    .trim()
    .email("Enter a valid email address."),
  password: z
    .string({ required_error: "Password is required." })
    .min(12, "Password must be at least 12 characters.")
    .max(200, "Password must be 200 characters or fewer."),
});

export async function POST(request) {
  return withApi(async () => {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "local";
    limit(`login:${ip}`, 5, 15 * 60 * 1000);
    const body = schema.parse(await readJson(request));
    const account = await authenticate(body.email, body.password);
    const response = NextResponse.json({ data: { email: account.email } });
    response.cookies.set(sessionCookie(await createSession(account)));
    return response;
  });
}
