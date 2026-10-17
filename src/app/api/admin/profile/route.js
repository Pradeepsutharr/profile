import { NextResponse } from "next/server";
import { getProfile, saveProfile } from "@/lib/server/repository";
import { requireAdmin } from "@/lib/server/auth";
import { withApi } from "@/lib/server/errors";

export async function GET() {
  return withApi(async () => { await requireAdmin(); return NextResponse.json({ data: await getProfile() }); });
}

export async function PUT(request) {
  return withApi(async () => { await requireAdmin(); return NextResponse.json({ data: await saveProfile(await request.json()) }); });
}
