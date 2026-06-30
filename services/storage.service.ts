import { createClient } from "@/lib/supabase/server";
import { AppError } from "@/lib/api/errors";

export type UploadFileInput = {
  file: File;
  folder?: string;
};

export type UploadFileResult = {
  path: string;
  publicUrl: string | null;
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

    const folder = input.folder ?? "general";
    const safeName = input.file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `${user.id}/${folder}/${Date.now()}-${safeName}`;

    const { error } = await supabase.storage.from("uploads").upload(path, input.file, {
      contentType: input.file.type,
      upsert: false,
    });

    if (error) {
      throw new AppError(error.message, 500, "STORAGE_UPLOAD_FAILED");
    }

    const { data: publicData } = supabase.storage.from("uploads").getPublicUrl(path);

    return {
      path,
      publicUrl: publicData.publicUrl ?? null,
    };
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
