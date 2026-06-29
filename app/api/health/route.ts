import { NextResponse } from "next/server";

import { GEMINI_MODEL } from "@/lib/gemini";

export async function GET() {
  const supabaseConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  const geminiConfigured = Boolean(process.env.GEMINI_API_KEY);

  return NextResponse.json({
    status: "ok",
    framework: "AI Engineering Framework",
    version: "1.0.0",
    sprint: 1,
    services: {
      supabase: supabaseConfigured ? "configured" : "missing_env",
      gemini: geminiConfigured ? "configured" : "missing_env",
      geminiModel: GEMINI_MODEL,
    },
    timestamp: new Date().toISOString(),
  });
}
