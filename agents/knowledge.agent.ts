import { z } from "zod";

import { BaseAgent } from "@/agents/base-agent";
import { type KnowledgeOutput } from "@/agents/civicai-schemas";
import type { AgentContext } from "@/agents/types";
import { governmentKnowledgeService } from "@/services/government-knowledge.service";

export const knowledgeInputSchema = z.object({
  serviceSlug: z.string().min(1),
});

export class KnowledgeAgent extends BaseAgent<
  z.infer<typeof knowledgeInputSchema>,
  KnowledgeOutput
> {
  readonly name = "knowledge";
  readonly description =
    "Retrieves structured environmental knowledge from verified database (no hallucination).";
  readonly inputSchema = knowledgeInputSchema;

  protected async run(
    input: z.infer<typeof knowledgeInputSchema>,
    context: AgentContext
  ): Promise<KnowledgeOutput> {
    void context;
    return governmentKnowledgeService.getBySlug(input.serviceSlug);
  }
}
