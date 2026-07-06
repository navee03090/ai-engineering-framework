import { AppError } from "@/lib/api/errors";
import { apiSuccess, createApiHandler, RATE_LIMITS } from "@/lib/api";
import { civicLanguageSchema } from "@/lib/validations/civicai";
import { civicaiService } from "@/services/civicai.service";

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export const POST = createApiHandler({
  route: "POST /api/civicai/verify-document",
  auth: true,
  rateLimit: RATE_LIMITS.ai,
  handler: async ({ request, user }) => {
    const formData = await request.formData();
    const file = formData.get("file");
    const serviceId = formData.get("serviceId")?.toString();
    const languageRaw = formData.get("language")?.toString() ?? "en";
    const language = civicLanguageSchema.parse(languageRaw);

    if (!(file instanceof File)) {
      throw new AppError("Image file is required.", 400, "VERIFY_VALIDATION_FAILED");
    }

    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      throw new AppError(
        "Only JPEG, PNG, WebP, and GIF images are supported.",
        400,
        "VERIFY_VALIDATION_FAILED"
      );
    }

    if (file.size > MAX_IMAGE_BYTES) {
      throw new AppError("Image must be under 8MB.", 400, "VERIFY_VALIDATION_FAILED");
    }

    const result = await civicaiService.verifyDocument(user!.id, file, {
      serviceId,
      language,
    });

    return apiSuccess(result);
  },
});
