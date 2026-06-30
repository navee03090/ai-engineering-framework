import { apiSuccess, createApiHandler, RATE_LIMITS } from "@/lib/api";
import { signInSchema } from "@/lib/validations";
import { authService } from "@/services/auth.service";

export const POST = createApiHandler({
  route: "POST /api/auth/signin",
  rateLimit: RATE_LIMITS.auth,
  bodySchema: signInSchema,
  handler: async ({ body }) => {
    const result = await authService.signIn(body);
    return apiSuccess(result);
  },
});
