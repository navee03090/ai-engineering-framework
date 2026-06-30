import { z } from "zod";

export const agentRunRequestSchema = z.object({
  agent: z.string().min(1),
  input: z.unknown(),
  context: z
    .object({
      runId: z.string().optional(),
      projectName: z.string().optional(),
      environment: z.string().optional(),
    })
    .optional(),
});

export const agentPipelineStepSchema = z.object({
  agent: z.string().min(1),
  input: z.unknown().optional(),
});

export const agentPipelineRequestSchema = z.object({
  steps: z.array(agentPipelineStepSchema).min(1),
  context: agentRunRequestSchema.shape.context,
});

export type AgentRunRequest = z.infer<typeof agentRunRequestSchema>;
export type AgentPipelineRequest = z.infer<typeof agentPipelineRequestSchema>;
