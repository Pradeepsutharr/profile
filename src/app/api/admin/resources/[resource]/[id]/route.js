import { NextResponse } from "next/server";
import { getOne, remove, update } from "@/lib/server/repository";
import { requireAdmin } from "@/lib/server/auth";
import { readJson, withApi } from "@/lib/server/errors";

export async function GET(_request, { params }) {
  return withApi(async () => {
    await requireAdmin();
    const { resource, id } = await params;
    return NextResponse.json({ data: await getOne(resource, id) });
  });
}

export async function PATCH(request, { params }) {
  return withApi(async () => {
    await requireAdmin();
    const { resource, id } = await params;
    return NextResponse.json({
      data: await update(resource, id, await readJson(request)),
    });
  });
}

export async function DELETE(_request, { params }) {
  return withApi(async () => {
    await requireAdmin();
    const { resource, id } = await params;
    await remove(resource, id);
    return NextResponse.json({ data: null });
  });
}
