import { apiSuccess, createApiHandler } from "@/lib/api";
import { createIncidentSchema } from "@/lib/validations/incidents";
import { authService } from "@/services/auth.service";
import { incidentService } from "@/services/incident.service";

export const GET = createApiHandler({
  route: "GET /api/incidents",
  handler: async () => {
    const incidents = await incidentService.list();
    return apiSuccess({ incidents, count: incidents.length });
  },
});

export const POST = createApiHandler({
  route: "POST /api/incidents",
  bodySchema: createIncidentSchema,
  handler: async ({ body }) => {
    let reporterId: string | undefined;

    try {
      const user = await authService.getUser();
      reporterId = user?.id;
    } catch {
      reporterId = undefined;
    }

    const incident = await incidentService.create(body, reporterId);
    return apiSuccess({ incident }, { status: 201 });
  },
});
