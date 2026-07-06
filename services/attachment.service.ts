import { createClient } from "@/lib/supabase/server";
import { AppError } from "@/lib/api/errors";
import type { AttachToIncidentInput } from "@/lib/validations/uploads";
import { getFileCategory } from "@/lib/validations/uploads";
import type { Database } from "@/types/database";

type AttachmentRow = Database["public"]["Tables"]["incident_attachments"]["Row"];

export const attachmentService = {
  async listByIncident(incidentId: string): Promise<AttachmentRow[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("incident_attachments")
      .select("*")
      .eq("incident_id", incidentId)
      .order("created_at", { ascending: false });

    if (error) {
      throw new AppError(error.message, 500, "ATTACHMENT_LIST_FAILED");
    }

    return data ?? [];
  },

  async attachToIncident(
    incidentId: string,
    input: AttachToIncidentInput,
    uploaderId: string
  ): Promise<AttachmentRow> {
    const supabase = await createClient();

    if (!input.storagePath.startsWith(`${uploaderId}/`)) {
      throw new AppError(
        "Invalid storage path for uploader.",
        403,
        "ATTACHMENT_FORBIDDEN"
      );
    }

    const { data, error } = await supabase
      .from("incident_attachments")
      .insert({
        incident_id: incidentId,
        uploader_id: uploaderId,
        storage_path: input.storagePath,
        file_name: input.fileName,
        mime_type: input.mimeType,
        file_size: input.fileSize,
        category: getFileCategory(input.mimeType),
      })
      .select("*")
      .single();

    if (error) {
      throw new AppError(error.message, 500, "ATTACHMENT_CREATE_FAILED");
    }

    return data;
  },

  async removeAttachment(attachmentId: string, uploaderId: string): Promise<void> {
    const supabase = await createClient();

    const { data: attachment, error: fetchError } = await supabase
      .from("incident_attachments")
      .select("*")
      .eq("id", attachmentId)
      .single();

    if (fetchError || !attachment) {
      throw new AppError("Attachment not found.", 404, "ATTACHMENT_NOT_FOUND");
    }

    if (attachment.uploader_id !== uploaderId) {
      throw new AppError(
        "Not allowed to delete this attachment.",
        403,
        "ATTACHMENT_FORBIDDEN"
      );
    }

    const { error: deleteMetaError } = await supabase
      .from("incident_attachments")
      .delete()
      .eq("id", attachmentId);

    if (deleteMetaError) {
      throw new AppError(deleteMetaError.message, 500, "ATTACHMENT_DELETE_FAILED");
    }
  },
};
