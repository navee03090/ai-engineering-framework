import type { GenerateContentResult } from "@google/generative-ai";

import { getDefaultGeminiModel, getGeminiModel } from "@/lib/gemini";
import { parseModelJson } from "@/lib/json-parser";
import { validateAiResponse } from "@/lib/response-validator";
import type { z } from "zod";

export type GenerateTextOptions = {
  systemInstruction?: string;
  temperature?: number;
  model?: string;
};

export async function generateText(
  prompt: string,
  options: GenerateTextOptions = {}
): Promise<string> {
  const model = options.model
    ? getGeminiModel(options.model)
    : getDefaultGeminiModel();

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: options.temperature ?? 0.4,
    },
    systemInstruction: options.systemInstruction,
  });

  return extractText(result);
}

export async function generateStructuredResponse<T extends z.ZodType>(
  prompt: string,
  schema: T,
  options: GenerateTextOptions = {}
): Promise<z.infer<T>> {
  const jsonInstruction =
    "Respond with valid JSON only. Do not include markdown fences or commentary.";

  const raw = await generateText(`${prompt}\n\n${jsonInstruction}`, options);
  const parsed = parseModelJson(raw);
  return validateAiResponse(schema, parsed);
}

function extractText(result: GenerateContentResult): string {
  const text = result.response.text();

  if (!text?.trim()) {
    throw new Error("Gemini returned an empty response.");
  }

  return text.trim();
}
