import { GEMINI_MODEL } from "@/lib/gemini";
import { apiSuccess, createApiHandler } from "@/lib/api";

export const GET = createApiHandler({
  route: "GET /api/health",
  rateLimit: false,
  handler: async () => {
    const supabaseConfigured = Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
    const geminiConfigured = Boolean(process.env.GEMINI_API_KEY);

    return apiSuccess({
      status: "ok",
      framework: "AI Engineering Framework",
      version: "1.0.0",
      phase: 14,
      services: {
        supabase: supabaseConfigured ? "configured" : "missing_env",
        gemini: geminiConfigured ? "configured" : "missing_env",
        geminiModel: GEMINI_MODEL,
      },
      timestamp: new Date().toISOString(),
    });
  },
});
