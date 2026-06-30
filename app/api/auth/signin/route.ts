import { authService } from "@/services/auth.service";
import { apiSuccess } from "@/lib/api/responses";
import { handleServiceRoute } from "@/lib/api/handle-route";
import { signInSchema } from "@/lib/validations";

export async function POST(request: Request) {
  return handleServiceRoute(async () => {
    const body = await request.json();
    const input = signInSchema.parse(body);
    const result = await authService.signIn(input);
    return apiSuccess(result);
  });
}
