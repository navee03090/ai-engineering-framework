import { createClient } from "@/lib/supabase/server";
import { AppError } from "@/lib/api/errors";
import {
  uploadFolderSchema,
  validateUploadFile,
  type UploadFolder,
} from "@/lib/validations/uploads";

export type UploadFileInput = {
  file: File;
  folder?: UploadFolder;
};

export type UploadFileResult = {
  path: string;
  signedUrl: string | null;
  fileName: string;
  mimeType: string;
  fileSize: number;
};

export const storageService = {
  async uploadUserFile(input: UploadFileInput): Promise<UploadFileResult> {
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new AppError("Authentication required for file upload.", 401, "AUTH_REQUIRED");
    }

    try {
      validateUploadFile(input.file);
    } catch (error) {
      throw new AppError(
        error instanceof Error ? error.message : "Invalid file",
        400,
        "UPLOAD_VALIDATION_FAILED"
      );
    }

    const folderResult = uploadFolderSchema.safeParse(input.folder ?? "general");
    const folder = folderResult.success ? folderResult.data : "general";
    const safeName = input.file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `${user.id}/${folder}/${Date.now()}-${safeName}`;

    const arrayBuffer = await input.file.arrayBuffer();

    const { error } = await supabase.storage.from("uploads").upload(path, arrayBuffer, {
      contentType: input.file.type,
      upsert: false,
    });

    if (error) {
      throw new AppError(error.message, 500, "STORAGE_UPLOAD_FAILED");
    }

    const signedUrl = await this.getSignedUrl(path);

    return {
      path,
      signedUrl,
      fileName: input.file.name,
      mimeType: input.file.type,
      fileSize: input.file.size,
    };
  },

  async getSignedUrl(path: string, expiresIn = 3600): Promise<string | null> {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !path.startsWith(`${user.id}/`)) {
      throw new AppError("Not allowed to access this file.", 403, "STORAGE_ACCESS_FORBIDDEN");
    }

    const { data, error } = await supabase.storage
      .from("uploads")
      .createSignedUrl(path, expiresIn);

    if (error) {
      throw new AppError(error.message, 500, "STORAGE_SIGNED_URL_FAILED");
    }

    return data.signedUrl;
  },

  async listUserFiles(folder: UploadFolder = "general") {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new AppError("Authentication required.", 401, "AUTH_REQUIRED");
    }

    const { data, error } = await supabase.storage
      .from("uploads")
      .list(`${user.id}/${folder}`, {
        limit: 100,
        sortBy: { column: "created_at", order: "desc" },
      });

    if (error) {
      throw new AppError(error.message, 500, "STORAGE_LIST_FAILED");
    }

    return (data ?? []).map((item) => ({
      name: item.name,
      path: `${user.id}/${folder}/${item.name}`,
      metadata: item.metadata,
    }));
  },

  async removeUserFile(path: string): Promise<void> {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !path.startsWith(`${user.id}/`)) {
      throw new AppError("Not allowed to delete this file.", 403, "STORAGE_DELETE_FORBIDDEN");
    }

    const { error } = await supabase.storage.from("uploads").remove([path]);

    if (error) {
      throw new AppError(error.message, 500, "STORAGE_DELETE_FAILED");
    }
  },
};
