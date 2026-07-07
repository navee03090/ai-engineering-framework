import { z } from "zod";

import { BaseAgent } from "@/agents/base-agent";
import { intentOutputSchema, type IntentOutput } from "@/agents/civicai-schemas";
import type { AgentContext } from "@/agents/types";
import { generateStructuredResponse } from "@/lib/ai";
import { getLanguageInstruction } from "@/lib/civicai/knowledge";
import type { CivicLanguage } from "@/lib/civicai/language";
import { buildAgentPromptBundle } from "@/lib/prompt-manager";
import { governmentKnowledgeService } from "@/services/government-knowledge.service";

export const intentInputSchema = z.object({
  query: z.string().min(1),
  language: z.enum(["en", "ur"]).default("en"),
});

export class IntentAgent extends BaseAgent<
  z.infer<typeof intentInputSchema>,
  IntentOutput
> {
  readonly name = "intent";
  readonly description =
    "Detects environmental issue intent, language, entities, and target waste/environment service.";
  readonly inputSchema = intentInputSchema;

  protected async run(
    input: z.infer<typeof intentInputSchema>,
    context: AgentContext
  ): Promise<IntentOutput> {
    const language = input.language as CivicLanguage;
    const { system, user } = buildAgentPromptBundle({
      userTemplateId: "civic.intent",
      userContext: {
        query: input.query,
        language: input.language,
        serviceIndex: governmentKnowledgeService.getServiceIndex(),
        languageInstruction: getLanguageInstruction(language),
      },
      systemContext: {
        projectName: context.projectName ?? "EcoMind AI",
        environment: context.environment ?? process.env.NODE_ENV ?? "development",
      },
      extraSystemParts: [
        "You are the Intent Agent for EcoMind AI. Return structured JSON only. Never invent services not in the index.",
      ],
    });

    return generateStructuredResponse(user, intentOutputSchema, {
      systemInstruction: system,
      temperature: 0.2,
      task: "intent",
    });
  }
}
