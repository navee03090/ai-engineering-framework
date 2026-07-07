import { z } from "zod";

import { apiSuccess, createApiHandler } from "@/lib/api";
import { assertAuthorityApi } from "@/lib/auth/authority";
import { civicaiAuthorityService } from "@/services/civicai-authority.service";

type ReportParams = { id: string };

export const GET = createApiHandler<undefined, undefined, ReportParams>({
  route: "GET /api/civicai/authority/reports/[id]",
  auth: true,
  handler: async ({ user, params }) => {
    await assertAuthorityApi(user!);
    z.string().uuid().parse(params.id);
    const report = await civicaiAuthorityService.getReportById(params.id);
    return apiSuccess(report);
  },
});
