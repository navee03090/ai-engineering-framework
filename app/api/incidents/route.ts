import { authService } from "@/services/auth.service";
import { incidentService } from "@/services/incident.service";
import { apiSuccess } from "@/lib/api/responses";
import { handleServiceRoute } from "@/lib/api/handle-route";
import { createIncidentSchema } from "@/lib/validations/incidents";

export async function GET() {
  return handleServiceRoute(async () => {
    const incidents = await incidentService.list();
    return apiSuccess({ incidents, count: incidents.length });
  });
}

export async function POST(request: Request) {
  return handleServiceRoute(async () => {
    const body = await request.json();
    const input = createIncidentSchema.parse(body);

    let reporterId: string | undefined;

    try {
      const user = await authService.getUser();
      reporterId = user?.id;
    } catch {
      reporterId = undefined;
    }

    const incident = await incidentService.create(input, reporterId);
    return apiSuccess({ incident }, { status: 201 });
  });
}
