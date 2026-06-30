import { incidentService } from "@/services/incident.service";
import { apiSuccess } from "@/lib/api/responses";
import { handleServiceRoute } from "@/lib/api/handle-route";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  return handleServiceRoute(async () => {
    const { id } = await context.params;
    const incident = await incidentService.getById(id);
    return apiSuccess({ incident });
  });
}
