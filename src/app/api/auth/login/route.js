import { NextResponse } from "next/server";
import { z } from "zod";
import { authenticate, createSession, sessionCookie } from "@/lib/server/auth";
import { withApi } from "@/lib/server/errors";
import { limit } from "@/lib/server/rate-limit";

const schema = z.object({ email: z.string().email(), password: z.string().min(12).max(200) });

export async function POST(request) {
  return withApi(async () => {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "local";
    limit(`login:${ip}`, 5, 15 * 60 * 1000);
    const body = schema.parse(await request.json());
    const account = await authenticate(body.email, body.password);
    const response = NextResponse.json({ data: { email: account.email } });
    response.cookies.set(sessionCookie(await createSession(account)));
    return response;
  });
}
