import { z } from "zod";

import { BaseAgent } from "@/agents/base-agent";
import type { AgentContext } from "@/agents/types";
import { documentStatusSchema } from "@/agents/procedure.agent";
import { generateVisionStructuredResponse } from "@/lib/ai";
import { getServiceById } from "@/lib/civicai/data/services";
import { getLanguageInstruction } from "@/lib/civicai/knowledge";
import type { CivicLanguage } from "@/lib/civicai/language";
import { buildAgentPromptBundle } from "@/lib/prompt-manager";

export const documentVerifyInputSchema = z.object({
  imageBase64: z.string().min(1, "Image data is required"),
  mimeType: z.string().min(1, "MIME type is required"),
  serviceId: z.string().optional(),
  language: z.enum(["en", "ur"]).default("en"),
});

export const documentVerifyOutputSchema = z.object({
  serviceName: z.string().min(1),
  confidence: z.number().min(0).max(100),
  extractedDocuments: z.array(
    z.object({
      name: z.string().min(1),
      status: documentStatusSchema,
    })
  ),
  advisory: z.string().min(1),
});

export type DocumentVerifyInput = z.infer<typeof documentVerifyInputSchema>;
export type DocumentVerifyOutput = z.infer<typeof documentVerifyOutputSchema>;

export class DocumentVerifyAgent extends BaseAgent<
  DocumentVerifyInput,
  DocumentVerifyOutput
> {
  readonly name = "document-verify";
  readonly description =
    "OCR waste/evidence images and compare against environmental reporting checklists.";
  readonly inputSchema = documentVerifyInputSchema;

  protected async run(
    input: DocumentVerifyInput,
    context: AgentContext
  ): Promise<DocumentVerifyOutput> {
    const language = (input.language ?? "en") as CivicLanguage;
    const service =
      getServiceById(input.serviceId ?? "illegal-dumping") ??
      getServiceById("illegal-dumping")!;

    const { system, user } = buildAgentPromptBundle({
      userTemplateId: "civic.document-verify",
      userContext: {
        serviceName: service.name,
        officialDocuments: service.documents.join(", "),
        languageInstruction: getLanguageInstruction(language),
      },
      systemContext: {
        projectName: context.projectName ?? "EcoMind AI",
        environment: context.environment ?? process.env.NODE_ENV ?? "development",
      },
      extraSystemParts: [
        "Extract text from the image using vision. Compare evidence politely. Never accuse individuals; use careful environmental advisory language.",
      ],
    });

    return generateVisionStructuredResponse(
      user,
      { imageBase64: input.imageBase64, mimeType: input.mimeType },
      documentVerifyOutputSchema,
      { systemInstruction: system, temperature: 0.2 }
    );
  }
}
