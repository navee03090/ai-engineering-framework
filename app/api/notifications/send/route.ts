import { apiSuccess, createApiHandler, RATE_LIMITS } from "@/lib/api";
import { sendNotificationSchema } from "@/lib/validations/notifications";
import { notificationService } from "@/services/notification.service";

export const POST = createApiHandler({
  route: "POST /api/notifications/send",
  auth: true,
  rateLimit: RATE_LIMITS.default,
  bodySchema: sendNotificationSchema,
  handler: async ({ body }) => {
    const result = await notificationService.send(body);
    return apiSuccess({ result });
  },
});
