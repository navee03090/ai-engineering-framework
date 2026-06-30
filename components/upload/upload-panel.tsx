"use client";

import { useState } from "react";

import { FileUpload, type UploadedFileResult } from "@/components/upload/file-upload";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function UploadPanel() {
  const [recent, setRecent] = useState<UploadedFileResult[]>([]);

  function handleUploaded(file: UploadedFileResult) {
    setRecent((current) => [file, ...current].slice(0, 5));
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload evidence</CardTitle>
          <CardDescription>
            Store incident images, PDFs, audio, and documents in Supabase Storage.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FileUpload folder="incidents" label="Choose file" onUploaded={handleUploaded} />
        </CardContent>
      </Card>

      {recent.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Recent uploads</CardTitle>
            <CardDescription>Private bucket — access via signed URLs.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recent.map((file) => (
              <div
                key={file.path}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border p-3 text-sm"
              >
                <div>
                  <p className="font-medium">{file.fileName}</p>
                  <p className="text-muted-foreground">{file.path}</p>
                </div>
                <Badge variant="secondary">{file.mimeType}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
