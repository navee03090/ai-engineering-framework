import { apiSuccess, createApiHandler } from "@/lib/api";
import { listPromptTemplates, listPromptTemplatesByTag } from "@/lib/prompt-manager";
import { promptsQuerySchema } from "@/lib/validations/prompts";

export const GET = createApiHandler({
  route: "GET /api/prompts",
  querySchema: promptsQuerySchema,
  handler: async ({ query }) => {
    const prompts = query.tag
      ? listPromptTemplatesByTag(query.tag)
      : listPromptTemplates();

    return apiSuccess({
      prompts,
      count: prompts.length,
    });
  },
});
