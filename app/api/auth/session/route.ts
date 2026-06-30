import { apiSuccess, createApiHandler } from "@/lib/api";
import { authService } from "@/services/auth.service";

export const GET = createApiHandler({
  route: "GET /api/auth/session",
  handler: async () => {
    const session = await authService.getSession();
    return apiSuccess({ session });
  },
});
