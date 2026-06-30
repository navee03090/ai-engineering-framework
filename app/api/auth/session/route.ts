import { authService } from "@/services/auth.service";
import { apiSuccess } from "@/lib/api/responses";
import { handleServiceRoute } from "@/lib/api/handle-route";

export async function GET() {
  return handleServiceRoute(async () => {
    const session = await authService.getSession();
    return apiSuccess({ session });
  });
}
