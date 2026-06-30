import { apiSuccess, createApiHandler } from "@/lib/api";
import {
  attachToIncidentSchema,
  type AttachToIncidentInput,
} from "@/lib/validations/uploads";
import { attachmentService } from "@/services/attachment.service";
import { n8nService } from "@/services/n8n.service";

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

    try {
      await n8nService.notifyAttachmentUploaded({
        incidentId: params.id,
        attachmentId: attachment.id,
        fileName: attachment.file_name,
        mimeType: attachment.mime_type,
        category: attachment.category,
        fileSize: attachment.file_size,
      });
    } catch {
      // n8n notification is best-effort.
    }

    return apiSuccess({ attachment }, { status: 201 });
  },
});
