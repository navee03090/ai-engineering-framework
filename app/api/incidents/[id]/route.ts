import { apiSuccess, createApiHandler } from "@/lib/api";
import { incidentService } from "@/services/incident.service";

type IncidentParams = { id: string };

export const GET = createApiHandler<undefined, undefined, IncidentParams>({
  route: "GET /api/incidents/[id]",
  handler: async ({ params }) => {
    const incident = await incidentService.getById(params.id);
    return apiSuccess({ incident });
  },
});
