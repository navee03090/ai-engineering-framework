import { z } from "zod";

import { BaseAgent } from "@/agents/base-agent";
import type { AgentContext } from "@/agents/types";
import { generateStructuredResponse } from "@/lib/ai";
import {
  buildServicesKnowledge,
  getLanguageInstruction,
} from "@/lib/civicai/knowledge";
import type { CivicLanguage } from "@/lib/civicai/language";
import { buildAgentPromptBundle } from "@/lib/prompt-manager";

export const documentStatusSchema = z.enum([
  "required",
  "optional",
  "unknown",
  "missing",
  "verified",
]);

export const procedureInputSchema = z.object({
  query: z.string().min(1, "Query is required"),
  language: z.enum(["en", "ur"]).default("en"),
});

export const procedureOutputSchema = z.object({
  serviceName: z.string().min(1),
  serviceId: z.string().min(1),
  department: z.string().min(1),
  fee: z.string().min(1),
  processingTime: z.string().min(1),
  answer: z.string().min(1),
  confidence: z.number().min(0).max(100),
  checklist: z.array(
    z.object({
      name: z.string().min(1),
      status: documentStatusSchema,
    })
  ),
  warnings: z.array(z.string()),
  sources: z.array(
    z.object({
      title: z.string().min(1),
      url: z.string(),
    })
  ),
});

export type ProcedureInput = z.infer<typeof procedureInputSchema>;
export type ProcedureOutput = z.infer<typeof procedureOutputSchema>;

export class ProcedureAgent extends BaseAgent<ProcedureInput, ProcedureOutput> {
  readonly name = "procedure";
  readonly description =
    "Provides structured environmental service guidance for Pakistani citizens.";
  readonly inputSchema = procedureInputSchema;

  protected async run(
    input: ProcedureInput,
    context: AgentContext
  ): Promise<ProcedureOutput> {
    const language = (input.language ?? "en") as CivicLanguage;
    const { system, user } = buildAgentPromptBundle({
      userTemplateId: "civic.procedure",
      userContext: {
        query: input.query,
        servicesKnowledge: buildServicesKnowledge(),
        languageInstruction: getLanguageInstruction(language),
      },
      systemContext: {
        projectName: context.projectName ?? "EcoMind AI",
        environment: context.environment ?? process.env.NODE_ENV ?? "development",
      },
      extraSystemParts: [
        "You are EcoMind AI, an AI Decision Assistant for Pakistani waste and environmental issues. Never accuse individuals. Provide transparent, structured guidance.",
      ],
    });

    return generateStructuredResponse(user, procedureOutputSchema, {
      systemInstruction: system,
      temperature: 0.3,
    });
  }
}
