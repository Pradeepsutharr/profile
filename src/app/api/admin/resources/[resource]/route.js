import { NextResponse } from "next/server";
import { create, list } from "@/lib/server/repository";
import { requireAdmin } from "@/lib/server/auth";
import { readJson, withApi } from "@/lib/server/errors";

export async function GET(_request, { params }) {
  return withApi(async () => {
    await requireAdmin();
    const { resource } = await params;
    return NextResponse.json({ data: await list(resource) });
  });
}

export async function POST(request, { params }) {
  return withApi(async () => {
    await requireAdmin();
    const { resource } = await params;
    return NextResponse.json(
      { data: await create(resource, await readJson(request)) },
      { status: 201 },
    );
  });
}
