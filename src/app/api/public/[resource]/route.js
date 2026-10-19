import { NextResponse } from "next/server";
import { list } from "@/lib/server/repository";
import { withApi } from "@/lib/server/errors";

export async function GET(request, { params }) {
  return withApi(async () => {
    const { resource } = await params;
    const slug = new URL(request.url).searchParams.get("slug") || undefined;
    return NextResponse.json({
      data: await list(resource, { publicOnly: true, slug }),
    });
  });
}
