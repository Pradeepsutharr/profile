import { NextResponse } from "next/server";
import { clearedSessionCookie } from "@/lib/server/auth";

export async function POST() {
  const response = NextResponse.json({ data: null });
  response.cookies.set(clearedSessionCookie);
  return response;
}
