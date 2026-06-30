import type { z } from "zod";

import { apiSuccess, createApiHandler, RATE_LIMITS } from "@/lib/api";
import { incidentNotifySchema } from "@/lib/validations/notifications";
import { authService } from "@/services/auth.service";
import { incidentService } from "@/services/incident.service";
import { notificationService } from "@/services/notification.service";

type IncidentParams = { id: string };
type IncidentNotifyBody = z.infer<typeof incidentNotifySchema>;

export const POST = createApiHandler<IncidentNotifyBody, undefined, IncidentParams>({
  route: "POST /api/incidents/[id]/notify",
  auth: true,
  rateLimit: RATE_LIMITS.default,
  bodySchema: incidentNotifySchema,
  handler: async ({ params, body }) => {
    const incident = await incidentService.getById(params.id);
    const user = await authService.getUser();

    if (!user?.email) {
      return apiSuccess({
        result: { skipped: true, reason: "no_user_email" },
      });
    }

    const channels = notificationService.resolveChannels(body.channels);
    const notifyOptions = body.channels ? { channels: body.channels } : undefined;

    const result =
      incident.status === "reviewed" || incident.ai_summary
        ? await notificationService.notifyIncidentAnalyzed(
            {
              id: incident.id,
              title: incident.title,
              severity: incident.severity,
              category: incident.category,
              summary: incident.ai_summary,
              recommendedAction: incident.recommended_action,
              recipientEmail: user.email,
            },
            notifyOptions
          )
        : await notificationService.notifyIncidentCreated(
            {
              id: incident.id,
              title: incident.title,
              description: incident.description,
              location: incident.location,
              recipientEmail: user.email,
            },
            notifyOptions
          );

    return apiSuccess({ result, channels });
  },
});
