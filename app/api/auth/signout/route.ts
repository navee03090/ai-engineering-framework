import { authService } from "@/services/auth.service";
import { apiSuccess } from "@/lib/api/responses";
import { handleServiceRoute } from "@/lib/api/handle-route";

export async function POST() {
  return handleServiceRoute(async () => {
    const result = await authService.signOut();
    return apiSuccess(result);
  });
}
