import { apiSuccess, createApiHandler } from "@/lib/api";
import { n8nService } from "@/services/n8n.service";

export const GET = createApiHandler({
  route: "GET /api/n8n/status",
  auth: true,
  handler: async () => {
    return apiSuccess({
      status: n8nService.getStatus(),
      catalog: n8nService.getEventCatalog(),
    });
  },
});
