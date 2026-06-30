import { apiSuccess, createApiHandler, RATE_LIMITS } from "@/lib/api";
import { signUpSchema } from "@/lib/validations";
import { authService } from "@/services/auth.service";

export const POST = createApiHandler({
  route: "POST /api/auth/signup",
  rateLimit: RATE_LIMITS.auth,
  bodySchema: signUpSchema,
  handler: async ({ body }) => {
    const result = await authService.signUp(body);
    return apiSuccess(result, { status: 201 });
  },
});
