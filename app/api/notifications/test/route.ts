import { apiSuccess, createApiHandler, RATE_LIMITS } from "@/lib/api";
import { notificationService } from "@/services/notification.service";

export const POST = createApiHandler({
  route: "POST /api/notifications/test",
  auth: true,
  rateLimit: RATE_LIMITS.default,
  handler: async ({ user }) => {
    if (!user?.email) {
      return apiSuccess({
        result: { skipped: true, reason: "no_user_email" },
      });
    }

    const result = await notificationService.sendTestEmail(
      user.email,
      user.user_metadata?.full_name ?? undefined
    );

    return apiSuccess({ result, sentTo: user.email });
  },
});
