import { apiSuccess, createApiHandler } from "@/lib/api";
import { assertAuthorityApi } from "@/lib/auth/authority";
import { civicaiAuthorityService } from "@/services/civicai-authority.service";

export const GET = createApiHandler({
  route: "GET /api/civicai/authority/requests",
  auth: true,
  handler: async ({ user }) => {
    await assertAuthorityApi(user!);
    const items = await civicaiAuthorityService.listRequests();
    return apiSuccess({ items });
  },
});
