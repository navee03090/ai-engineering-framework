import { z } from "zod";

import { BaseAgent } from "@/agents/base-agent";
import {
  recommendationOutputSchema,
  type RecommendationOutput,
} from "@/agents/civicai-schemas";
import type { AgentContext } from "@/agents/types";
import { generateStructuredResponse } from "@/lib/ai";
import { getLanguageInstruction } from "@/lib/civicai/knowledge";
import type { CivicLanguage } from "@/lib/civicai/language";
import { buildAgentPromptBundle } from "@/lib/prompt-manager";

export const recommendationInputSchema = z.object({
  serviceKnowledge: z.string().min(1),
  intentSummary: z.string().min(1),
  language: z.enum(["en", "ur"]).default("en"),
});

export class RecommendationAgent extends BaseAgent<
  z.infer<typeof recommendationInputSchema>,
  RecommendationOutput
> {
  readonly name = "recommendation";
  readonly description =
    "Generates citizen checklist, tips, timeline, FAQs, and next steps.";
  readonly inputSchema = recommendationInputSchema;

  protected async run(
    input: z.infer<typeof recommendationInputSchema>,
    context: AgentContext
  ): Promise<RecommendationOutput> {
    const language = input.language as CivicLanguage;
    const { system, user } = buildAgentPromptBundle({
      userTemplateId: "civic.recommendation",
      userContext: {
        serviceKnowledge: input.serviceKnowledge,
        intentSummary: input.intentSummary,
        languageInstruction: getLanguageInstruction(language),
      },
      systemContext: {
        projectName: context.projectName ?? "CivicAI",
        environment: context.environment ?? process.env.NODE_ENV ?? "development",
      },
    });

    return generateStructuredResponse(user, recommendationOutputSchema, {
      systemInstruction: system,
      temperature: 0.3,
    });
  }
}
