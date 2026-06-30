import { z } from "zod";

import { BaseAgent } from "@/agents/base-agent";
import type { AgentContext } from "@/agents/types";
import { generateText } from "@/lib/ai";
import { buildAgentPromptBundle } from "@/lib/prompt-manager";

export const summarizerInputSchema = z.object({
  content: z.string().min(1, "Content is required"),
  audience: z.string().min(1).default("emergency coordinators"),
  maxWords: z.number().int().positive().max(500).default(150),
});

export const summarizerOutputSchema = z.object({
  summary: z.string().min(1),
});

export type SummarizerInput = z.infer<typeof summarizerInputSchema>;
export type SummarizerOutput = z.infer<typeof summarizerOutputSchema>;

export class SummarizerAgent extends BaseAgent<SummarizerInput, SummarizerOutput> {
  readonly name = "summarizer";
  readonly description = "Summarizes incident or report text for a target audience.";
  readonly inputSchema = summarizerInputSchema;

  protected async run(
    input: SummarizerInput,
    context: AgentContext
  ): Promise<SummarizerOutput> {
    const { system, user } = buildAgentPromptBundle({
      userTemplateId: "disaster.summarize",
      userContext: {
        audience: input.audience,
        content: input.content,
        maxWords: input.maxWords,
      },
      systemContext: {
        projectName: context.projectName ?? "AEF",
        environment: context.environment ?? process.env.NODE_ENV ?? "development",
      },
    });

    const summary = await generateText(user, {
      systemInstruction: system,
      temperature: 0.3,
    });

    return { summary };
  }
}
