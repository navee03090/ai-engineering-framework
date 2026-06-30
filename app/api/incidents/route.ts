import { apiSuccess, createApiHandler } from "@/lib/api";
import { createIncidentSchema } from "@/lib/validations/incidents";
import { authService } from "@/services/auth.service";
import { incidentService } from "@/services/incident.service";
import { notificationService } from "@/services/notification.service";

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

    try {
      const user = await authService.getUser();

      if (user?.email) {
        await notificationService.notifyIncidentCreated({
          id: incident.id,
          title: incident.title,
          description: incident.description,
          location: incident.location,
          recipientEmail: user.email,
        });
      }
    } catch {
      // Notification is best-effort.
    }

    return apiSuccess({ incident }, { status: 201 });
  },
});
