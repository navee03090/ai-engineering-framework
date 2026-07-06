import { apiSuccess, createApiHandler } from "@/lib/api";
import {
  attachToIncidentSchema,
  type AttachToIncidentInput,
} from "@/lib/validations/uploads";
import { attachmentService } from "@/services/attachment.service";

type IncidentParams = { id: string };

export const GET = createApiHandler<undefined, undefined, IncidentParams>({
  route: "GET /api/incidents/[id]/attachments",
  auth: true,
  handler: async ({ params }) => {
    const attachments = await attachmentService.listByIncident(params.id);
    return apiSuccess({ attachments, count: attachments.length });
  },
});

export const POST = createApiHandler<AttachToIncidentInput, undefined, IncidentParams>({
  route: "POST /api/incidents/[id]/attachments",
  auth: true,
  bodySchema: attachToIncidentSchema,
  handler: async ({ body, params, user }) => {
    const attachment = await attachmentService.attachToIncident(
      params.id,
      body,
      user!.id
    );

    return apiSuccess({ attachment }, { status: 201 });
  },
});
