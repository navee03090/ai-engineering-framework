import { z } from "zod";

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10 MB

export const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
  "audio/mpeg",
  "audio/wav",
  "audio/webm",
  "audio/mp4",
  "text/plain",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
] as const;

export type AllowedMimeType = (typeof ALLOWED_MIME_TYPES)[number];

export const uploadFolderSchema = z.enum([
  "general",
  "incidents",
  "images",
  "documents",
  "audio",
]);

export type UploadFolder = z.infer<typeof uploadFolderSchema>;

export const attachToIncidentSchema = z.object({
  storagePath: z.string().min(1),
  fileName: z.string().min(1),
  mimeType: z.string().min(1),
  fileSize: z.number().int().positive(),
});

export type AttachToIncidentInput = z.infer<typeof attachToIncidentSchema>;

export function getFileCategory(
  mimeType: string
): "image" | "pdf" | "audio" | "document" | "other" {
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType === "application/pdf") return "pdf";
  if (mimeType.startsWith("audio/")) return "audio";
  if (
    mimeType.startsWith("text/") ||
    mimeType.includes("word") ||
    mimeType.includes("document")
  ) {
    return "document";
  }
  return "other";
}

export function validateUploadFile(file: File): void {
  if (!file.size) {
    throw new Error("File is empty.");
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error(`File exceeds ${MAX_UPLOAD_BYTES / (1024 * 1024)}MB limit.`);
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type as AllowedMimeType)) {
    throw new Error(`File type not allowed: ${file.type || "unknown"}`);
  }
}
