import { z } from "zod";

import { apiSuccess, createApiHandler } from "@/lib/api";
import { civicaiService } from "@/services/civicai.service";

type ReportParams = { id: string };

export const GET = createApiHandler<undefined, undefined, ReportParams>({
  route: "GET /api/civicai/reports/[id]",
  auth: true,
  handler: async ({ user, params }) => {
    z.string().uuid().parse(params.id);
    const report = await civicaiService.getReport(user!.id, params.id);
    return apiSuccess(report);
  },
});
