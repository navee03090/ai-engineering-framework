import type { GenerateContentResult, Part } from "@google/generative-ai";

import { getGeminiModel } from "@/lib/gemini";
import { withGeminiRetry } from "@/lib/gemini-retry";
import { appendJsonOutputInstruction } from "@/lib/prompt-manager";
import { parseModelJson } from "@/lib/json-parser";
import { validateAiResponse } from "@/lib/response-validator";
import type { z } from "zod";

export type GenerateTextOptions = {
  systemInstruction?: string;
  temperature?: number;
  model?: string;
};

export type VisionInput = {
  imageBase64: string;
  mimeType: string;
};

export async function generateText(
  prompt: string,
  options: GenerateTextOptions = {}
): Promise<string> {
  const run = async (modelName: string) => {
    const model = getGeminiModel(options.model ?? modelName);
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: options.temperature ?? 0.4,
      },
      systemInstruction: options.systemInstruction,
    });
    return extractText(result);
  };

  if (options.model) {
    return run(options.model);
  }

  return withGeminiRetry(run);
}

export async function generateVisionText(
  prompt: string,
  image: VisionInput,
  options: GenerateTextOptions = {}
): Promise<string> {
  const parts: Part[] = [
    { text: prompt },
    {
      inlineData: {
        data: image.imageBase64,
        mimeType: image.mimeType,
      },
    },
  ];

  const run = async (modelName: string) => {
    const model = getGeminiModel(options.model ?? modelName);
    const result = await model.generateContent({
      contents: [{ role: "user", parts }],
      generationConfig: {
        temperature: options.temperature ?? 0.2,
      },
      systemInstruction: options.systemInstruction,
    });
    return extractText(result);
  };

  if (options.model) {
    return run(options.model);
  }

  return withGeminiRetry(run);
}

export async function generateStructuredResponse<T extends z.ZodType>(
  prompt: string,
  schema: T,
  options: GenerateTextOptions = {}
): Promise<z.infer<T>> {
  const raw = await generateText(appendJsonOutputInstruction(prompt), options);
  const parsed = parseModelJson(raw);
  return validateAiResponse(schema, parsed);
}

export async function generateVisionStructuredResponse<T extends z.ZodType>(
  prompt: string,
  image: VisionInput,
  schema: T,
  options: GenerateTextOptions = {}
): Promise<z.infer<T>> {
  const raw = await generateVisionText(
    appendJsonOutputInstruction(prompt),
    image,
    options
  );
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
