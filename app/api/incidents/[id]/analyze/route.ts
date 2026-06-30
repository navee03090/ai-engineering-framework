import { incidentService } from "@/services/incident.service";
import { notificationService } from "@/services/notification.service";
import { authService } from "@/services/auth.service";
import { apiSuccess } from "@/lib/api/responses";
import { handleServiceRoute } from "@/lib/api/handle-route";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(_request: Request, context: RouteContext) {
  return handleServiceRoute(async () => {
    const { id } = await context.params;
    const incident = await incidentService.analyzeAndPersist(id);

    try {
      const user = await authService.getUser();
      if (user?.email) {
        await notificationService.notifyIncidentAnalyzed({
          id: incident.id,
          title: incident.title,
          severity: incident.severity,
          category: incident.category,
          recipientEmail: user.email,
        });
      }
    } catch {
      // Notification is best-effort and should not fail analysis.
    }

    return apiSuccess({ incident });
  });
}
