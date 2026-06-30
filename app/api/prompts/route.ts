import { listPromptTemplates, listPromptTemplatesByTag } from "@/lib/prompt-manager";
import { apiSuccess } from "@/lib/api/responses";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tag = searchParams.get("tag");

  const prompts = tag ? listPromptTemplatesByTag(tag) : listPromptTemplates();

  return apiSuccess({
    prompts,
    count: prompts.length,
  });
}
