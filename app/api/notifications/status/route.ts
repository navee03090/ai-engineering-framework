import { apiSuccess, createApiHandler } from "@/lib/api";
import { notificationService } from "@/services/notification.service";

export const GET = createApiHandler({
  route: "GET /api/notifications/status",
  auth: true,
  handler: async () => {
    return apiSuccess({ status: notificationService.getStatus() });
  },
});
