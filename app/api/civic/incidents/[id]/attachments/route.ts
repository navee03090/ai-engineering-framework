import { apiSuccess, createApiHandler } from "@/lib/api";
import { civicService } from "@/services/civic.service";

type IncidentParams = { id: string };

export const GET = createApiHandler<undefined, undefined, IncidentParams>({
  route: "GET /api/civic/incidents/[id]/attachments",
  auth: true,
  handler: async ({ params }) => {
    const attachments = await civicService.listAttachments(params.id);
    return apiSuccess({ attachments, count: attachments.length });
  },
});
