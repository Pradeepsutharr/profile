import { NextResponse } from "next/server";
import { getSettings, saveSettings } from "@/lib/server/repository";
import { requireAdmin } from "@/lib/server/auth";
import { withApi } from "@/lib/server/errors";

export async function GET() {
  return withApi(async () => { await requireAdmin(); return NextResponse.json({ data: await getSettings() }); });
}

export async function PUT(request) {
  return withApi(async () => { await requireAdmin(); return NextResponse.json({ data: await saveSettings(await request.json()) }); });
}
