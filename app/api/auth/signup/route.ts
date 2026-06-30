import { authService } from "@/services/auth.service";
import { apiSuccess } from "@/lib/api/responses";
import { handleServiceRoute } from "@/lib/api/handle-route";
import { signUpSchema } from "@/lib/validations";

export async function POST(request: Request) {
  return handleServiceRoute(async () => {
    const body = await request.json();
    const input = signUpSchema.parse(body);
    const result = await authService.signUp(input);
    return apiSuccess(result, { status: 201 });
  });
}
