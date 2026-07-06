import { z } from "zod";

import { BaseAgent } from "@/agents/base-agent";
import {
  complianceOutputSchema,
  type ComplianceOutput,
} from "@/agents/civicai-schemas";
import type { AgentContext } from "@/agents/types";
import { generateStructuredResponse } from "@/lib/ai";
import { getLanguageInstruction } from "@/lib/civicai/knowledge";
import type { CivicLanguage } from "@/lib/civicai/language";
import { buildAgentPromptBundle } from "@/lib/prompt-manager";

export const complianceInputSchema = z.object({
  serviceName: z.string().min(1),
  officialDocuments: z.array(z.string()),
  extractedDocuments: z.array(
    z.object({
      name: z.string(),
      normalizedName: z.string().optional(),
      confidence: z.number().optional(),
    })
  ),
  language: z.enum(["en", "ur"]).default("en"),
});

export class ComplianceAgent extends BaseAgent<
  z.infer<typeof complianceInputSchema>,
  ComplianceOutput
> {
  readonly name = "compliance";
  readonly description =
    "Compares uploaded document lists against official checklists. Never accuses officials.";
  readonly inputSchema = complianceInputSchema;

  protected async run(
    input: z.infer<typeof complianceInputSchema>,
    context: AgentContext
  ): Promise<ComplianceOutput> {
    const language = input.language as CivicLanguage;
    const extracted = input.extractedDocuments
      .map((d) => d.normalizedName ?? d.name)
      .join(", ");

    const { system, user } = buildAgentPromptBundle({
      userTemplateId: "civic.compliance",
      userContext: {
        serviceName: input.serviceName,
        officialDocuments: input.officialDocuments.join(", "),
        extractedDocuments: extracted || "None extracted",
        languageInstruction: getLanguageInstruction(language),
      },
      systemContext: {
        projectName: context.projectName ?? "CivicAI",
        environment: context.environment ?? process.env.NODE_ENV ?? "development",
      },
      extraSystemParts: [
        "You are the Compliance Agent. Use polite, careful wording. Never accuse government officials.",
      ],
    });

    return generateStructuredResponse(user, complianceOutputSchema, {
      systemInstruction: system,
      temperature: 0.2,
    });
  }
}
