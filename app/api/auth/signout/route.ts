import { apiSuccess, createApiHandler, RATE_LIMITS } from "@/lib/api";
import { authService } from "@/services/auth.service";

export const POST = createApiHandler({
  route: "POST /api/auth/signout",
  rateLimit: RATE_LIMITS.auth,
  handler: async () => {
    const result = await authService.signOut();
    return apiSuccess(result);
  },
});
