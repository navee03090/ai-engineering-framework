import { z } from "zod";

import { AppError } from "@/lib/api/errors";
import { apiSuccess, createApiHandler } from "@/lib/api";
import { uploadFolderSchema } from "@/lib/validations/uploads";
import { storageService } from "@/services/storage.service";

const deleteUploadSchema = z.object({
  path: z.string().min(1),
});

export const POST = createApiHandler({
  route: "POST /api/uploads",
  auth: true,
  handler: async ({ request }) => {
    const formData = await request.formData();
    const file = formData.get("file");
    const folderValue = formData.get("folder")?.toString() ?? "general";
    const folder = uploadFolderSchema.parse(folderValue);

    if (!(file instanceof File)) {
      throw new AppError("File is required.", 400, "UPLOAD_VALIDATION_FAILED");
    }

    const upload = await storageService.uploadUserFile({ file, folder });

    return apiSuccess({ upload }, { status: 201 });
  },
});

export const GET = createApiHandler({
  route: "GET /api/uploads",
  auth: true,
  querySchema: z.object({
    folder: uploadFolderSchema.optional(),
    path: z.string().optional(),
  }),
  handler: async ({ query }) => {
    if (query.path) {
      const signedUrl = await storageService.getSignedUrl(query.path);
      return apiSuccess({ path: query.path, signedUrl });
    }

    const folder = query.folder ?? "general";
    const files = await storageService.listUserFiles(folder);

    return apiSuccess({ files, count: files.length, folder });
  },
});

export const DELETE = createApiHandler({
  route: "DELETE /api/uploads",
  auth: true,
  bodySchema: deleteUploadSchema,
  handler: async ({ body }) => {
    await storageService.removeUserFile(body.path);
    return apiSuccess({ deleted: true, path: body.path });
  },
});
