import { apiSuccess, createApiHandler } from "@/lib/api";
import { civicaiService } from "@/services/civicai.service";

export const GET = createApiHandler({
  route: "GET /api/civicai/services",
  auth: true,
  handler: async () => {
    const services = await civicaiService.listServices();
    return apiSuccess({ services });
  },
});
