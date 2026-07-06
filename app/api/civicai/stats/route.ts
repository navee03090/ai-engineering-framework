import { apiSuccess, createApiHandler } from "@/lib/api";
import { civicaiService } from "@/services/civicai.service";

export const GET = createApiHandler({
  route: "GET /api/civicai/stats",
  auth: true,
  handler: async ({ user }) => {
    const stats = await civicaiService.getStats(user!.id);
    return apiSuccess(stats);
  },
});
