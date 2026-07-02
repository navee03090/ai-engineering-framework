import { apiSuccess, createApiHandler } from "@/lib/api";
import { incidentService } from "@/services/incident.service";

export const GET = createApiHandler({
  route: "GET /api/civic/stats",
  rateLimit: false,
  handler: async () => {
    const stats = await incidentService.getStats();
    return apiSuccess({ stats });
  },
});
