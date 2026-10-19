import { buildLlmsTxt, llmsResponse } from "@/lib/llms";

export const dynamic = "force-dynamic";

export async function GET() {
  return llmsResponse(await buildLlmsTxt());
}
