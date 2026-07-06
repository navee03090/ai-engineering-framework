import { apiSuccess, createApiHandler } from "@/lib/api";
import { civicaiService } from "@/services/civicai.service";

export const GET = createApiHandler({
  route: "GET /api/civicai/history",
  auth: true,
  handler: async ({ user }) => {
    const history = await civicaiService.getHistory(user!.id);
    return apiSuccess({ items: history });
  },
});
