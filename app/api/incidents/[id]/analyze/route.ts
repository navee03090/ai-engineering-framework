import { apiSuccess, createApiHandler, RATE_LIMITS } from "@/lib/api";
import { authService } from "@/services/auth.service";
import { incidentService } from "@/services/incident.service";
import { notificationService } from "@/services/notification.service";

type IncidentParams = { id: string };

export const POST = createApiHandler<undefined, undefined, IncidentParams>({
  route: "POST /api/incidents/[id]/analyze",
  rateLimit: RATE_LIMITS.ai,
  handler: async ({ params }) => {
    const incident = await incidentService.analyzeAndPersist(params.id);

    try {
      const user = await authService.getUser();

      if (user?.email) {
        await notificationService.notifyIncidentAnalyzed({
          id: incident.id,
          title: incident.title,
          severity: incident.severity,
          category: incident.category,
          summary: incident.ai_summary,
          recommendedAction: incident.recommended_action,
          recipientEmail: user.email,
        });
      }
    } catch {
      // Notification is best-effort.
    }

    return apiSuccess({ incident });
  },
});
