import { NextResponse } from "next/server";
import { z } from "zod";

import { generateStructuredResponse } from "@/lib/ai";
import { buildSystemPrompt } from "@/lib/prompt-manager";

const healthSchema = z.object({
  status: z.literal("ok"),
  message: z.string(),
});

export async function POST() {
  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY is not configured." },
      { status: 503 }
    );
  }

  try {
    const result = await generateStructuredResponse(
      "Return a short JSON health check for the AI layer.",
      healthSchema,
      {
        systemInstruction: buildSystemPrompt({
          projectName: "AEF",
          environment: process.env.NODE_ENV ?? "development",
        }),
        temperature: 0,
      }
    );

    return NextResponse.json({ ok: true, result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown AI error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
