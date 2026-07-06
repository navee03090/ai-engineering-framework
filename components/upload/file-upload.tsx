"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { UploadFolder } from "@/lib/validations/uploads";
import { ALLOWED_MIME_TYPES, MAX_UPLOAD_BYTES } from "@/lib/validations/uploads";

export type UploadedFileResult = {
  path: string;
  signedUrl: string | null;
  fileName: string;
  mimeType: string;
  fileSize: number;
};

type FileUploadProps = {
  folder?: UploadFolder;
  onUploaded?: (file: UploadedFileResult) => void;
  label?: string;
};

const allowedSummary = "Images, PDF, audio, and documents up to 10 MB.";

export function FileUpload({
  folder = "general",
  onUploaded,
  label = "Upload file",
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      toast.error("File exceeds 10 MB limit.");
      return;
    }

    if (
      !ALLOWED_MIME_TYPES.includes(file.type as (typeof ALLOWED_MIME_TYPES)[number])
    ) {
      toast.error(`File type not allowed: ${file.type || "unknown"}`);
      return;
    }

    setIsUploading(true);
    setProgress(20);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      setProgress(55);

      const response = await fetch("/api/uploads", {
        method: "POST",
        body: formData,
      });

      setProgress(85);

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error?.message ?? "Upload failed");
      }

      setProgress(100);
      toast.success(`${file.name} uploaded`);
      onUploaded?.(result.data.upload as UploadedFileResult);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Upload failed";
      toast.error(message);
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  }

  return (
    <div className="space-y-3">
      <Alert>
        <AlertDescription>{allowedSummary}</AlertDescription>
      </Alert>
      <input
        ref={inputRef}
        className="sr-only"
        type="file"
        accept={ALLOWED_MIME_TYPES.join(",")}
        disabled={isUploading}
        onChange={handleFileChange}
      />
      <Button
        type="button"
        variant="outline"
        disabled={isUploading}
        onClick={() => inputRef.current?.click()}
      >
        {isUploading ? "Uploading..." : label}
      </Button>
      {isUploading ? <Progress value={progress} /> : null}
    </div>
  );
}
