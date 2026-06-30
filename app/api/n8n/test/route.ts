import { apiSuccess, createApiHandler, RATE_LIMITS } from "@/lib/api";
import { n8nService } from "@/services/n8n.service";

export const POST = createApiHandler({
  route: "POST /api/n8n/test",
  auth: true,
  rateLimit: RATE_LIMITS.default,
  handler: async ({ user }) => {
    const triggeredBy = user?.email ?? "unknown";

    const result = await n8nService.sendTestEvent(triggeredBy);

    return apiSuccess({ result, triggeredBy });
  },
});
