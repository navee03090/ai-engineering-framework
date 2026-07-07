import { apiSuccess, createApiHandler } from "@/lib/api";
import { assertAuthorityApi } from "@/lib/auth/authority";
import { civicaiAuthorityService } from "@/services/civicai-authority.service";

export const GET = createApiHandler({
  route: "GET /api/civicai/authority/stats",
  auth: true,
  handler: async ({ user }) => {
    await assertAuthorityApi(user!);
    const stats = await civicaiAuthorityService.getStats();
    return apiSuccess(stats);
  },
});
