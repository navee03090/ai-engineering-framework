import { apiSuccess, createApiHandler } from "@/lib/api";
import { aiService } from "@/services/ai.service";

export const GET = createApiHandler({
  route: "GET /api/agents",
  handler: async () => {
    const agents = aiService.listAgents();
    return apiSuccess({ agents, count: agents.length });
  },
});
