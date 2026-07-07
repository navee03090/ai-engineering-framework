import { z } from "zod";

import { BaseAgent } from "@/agents/base-agent";
import { ocrOutputSchema, type OcrOutput } from "@/agents/civicai-schemas";
import type { AgentContext } from "@/agents/types";
import { generateVisionStructuredResponse } from "@/lib/ai";
import { getLanguageInstruction } from "@/lib/civicai/knowledge";
import type { CivicLanguage } from "@/lib/civicai/language";
import { buildAgentPromptBundle } from "@/lib/prompt-manager";

export const ocrInputSchema = z.object({
  imageBase64: z.string().min(1),
  mimeType: z.string().min(1),
  serviceName: z.string().default("Environmental Issue"),
  language: z.enum(["en", "ur"]).default("en"),
});

export class OcrAgent extends BaseAgent<z.infer<typeof ocrInputSchema>, OcrOutput> {
  readonly name = "ocr";
  readonly description =
    "Performs OCR on uploaded waste/evidence images and extracts text and evidence items.";
  readonly inputSchema = ocrInputSchema;

  protected async run(
    input: z.infer<typeof ocrInputSchema>,
    context: AgentContext
  ): Promise<OcrOutput> {
    const language = input.language as CivicLanguage;
    const { system, user } = buildAgentPromptBundle({
      userTemplateId: "civic.ocr",
      userContext: {
        serviceName: input.serviceName,
        languageInstruction: getLanguageInstruction(language),
      },
      systemContext: {
        projectName: context.projectName ?? "EcoMind AI",
        environment: context.environment ?? process.env.NODE_ENV ?? "development",
      },
    });

    return generateVisionStructuredResponse(
      user,
      { imageBase64: input.imageBase64, mimeType: input.mimeType },
      ocrOutputSchema,
      { systemInstruction: system, temperature: 0.1, task: "ocr" }
    );
  }
}
