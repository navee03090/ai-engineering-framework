import { apiSuccess, createApiHandler, RATE_LIMITS } from "@/lib/api";
import { createIncidentSchema } from "@/lib/validations/incidents";
import { civicService } from "@/services/civic.service";

export const GET = createApiHandler({
  route: "GET /api/civic/config",
  rateLimit: false,
  handler: async () => {
    return apiSuccess({
      branding: civicService.getBranding(),
      promptPack: process.env.CIVIC_PROMPT_PACK ?? "emergency",
    });
  },
});

export const POST = createApiHandler({
  route: "POST /api/civic/report",
  rateLimit: RATE_LIMITS.default,
  handler: async ({ request }) => {
    const formData = await request.formData();
    const title = formData.get("title")?.toString() ?? "";
    const description = formData.get("description")?.toString() ?? "";
    const location = formData.get("location")?.toString();
    const file = formData.get("evidence");

    const body = createIncidentSchema.parse({ title, description, location });

    if (file instanceof File && file.size > 0) {
      const incident = await civicService.submitPublicReport(body, file);
      return apiSuccess({ incident }, { status: 201 });
    }

    const incident = await civicService.submitPublicReport(body);
    return apiSuccess({ incident }, { status: 201 });
  },
});
