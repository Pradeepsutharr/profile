import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/server/auth";
import { withApi, ApiError, readJson } from "@/lib/server/errors";
import * as gmail from "@/lib/server/gmail";

export async function POST(request, { params }) {
  return withApi(async () => {
    await requireAdmin();
    const { action } = await params;
    const body = await readJson(request, { allowEmpty: true });
    if (action === "sync")
      return NextResponse.json({ data: await gmail.syncEmail() });
    if (action === "reply")
      return NextResponse.json({ data: await gmail.reply(body) });
    if (action === "mark-read") {
      await gmail.markRead(body.messageIds);
      return NextResponse.json({ data: null });
    }
    if (action === "star") {
      await gmail.star(body.messageId, body.enabled);
      return NextResponse.json({ data: null });
    }
    if (action === "archive") {
      await gmail.archive(body.threadId);
      return NextResponse.json({ data: null });
    }
    throw new ApiError(404, "Unknown email action");
  });
}
