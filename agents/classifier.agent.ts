import { z } from "zod";

import { BaseAgent } from "@/agents/base-agent";
import type { AgentContext } from "@/agents/types";
import { generateStructuredResponse } from "@/lib/ai";
import { buildAgentPromptBundle } from "@/lib/prompt-manager";

export const incidentCategorySchema = z.enum([
  "flood",
  "earthquake",
  "fire",
  "medical",
  "infrastructure",
  "other",
]);

export const incidentSeveritySchema = z.enum(["low", "medium", "high", "critical"]);

export const classifierInputSchema = z.object({
  content: z.string().min(1, "Incident content is required"),
});

export const classifierOutputSchema = z.object({
  category: incidentCategorySchema,
  severity: incidentSeveritySchema,
  summary: z.string().min(1),
  recommendedAction: z.string().min(1),
});

export type ClassifierInput = z.infer<typeof classifierInputSchema>;
export type ClassifierOutput = z.infer<typeof classifierOutputSchema>;

export class ClassifierAgent extends BaseAgent<ClassifierInput, ClassifierOutput> {
  readonly name = "classifier";
  readonly description =
    "Classifies disaster incident reports by category, severity, and recommended action.";
  readonly inputSchema = classifierInputSchema;

  protected async run(
    input: ClassifierInput,
    context: AgentContext
  ): Promise<ClassifierOutput> {
    const { system, user } = buildAgentPromptBundle({
      userTemplateId: "disaster.classify",
      userContext: {
        content: input.content,
      },
      systemContext: {
        projectName: context.projectName ?? "Pakistan Disaster Response AI",
        environment: context.environment ?? process.env.NODE_ENV ?? "development",
      },
    });

    return generateStructuredResponse(user, classifierOutputSchema, {
      systemInstruction: system,
      temperature: 0.2,
    });
  }
}
