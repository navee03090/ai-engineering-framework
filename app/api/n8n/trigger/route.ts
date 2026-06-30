import { apiSuccess, createApiHandler, RATE_LIMITS } from "@/lib/api";
import { triggerN8nSchema } from "@/lib/validations/n8n";
import { n8nService } from "@/services/n8n.service";

export const POST = createApiHandler({
  route: "POST /api/n8n/trigger",
  auth: true,
  rateLimit: RATE_LIMITS.default,
  bodySchema: triggerN8nSchema,
  handler: async ({ body }) => {
    const result = await n8nService.trigger(body.event, body.payload);
    return apiSuccess({ result });
  },
});
