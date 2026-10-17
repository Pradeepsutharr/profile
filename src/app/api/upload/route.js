import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/server/auth";
import { withApi } from "@/lib/server/errors";
import { uploadFile } from "@/lib/server/storage";

export async function POST(request) {
  return withApi(async () => {
    await requireAdmin();
    const form = await request.formData();
    const file = form.get("file");
    const folder = String(form.get("folder") || "media").replace(/[^a-z0-9_-]/gi, "").slice(0, 40) || "media";
    return NextResponse.json({ data: await uploadFile(file, folder) }, { status: 201 });
  });
}
