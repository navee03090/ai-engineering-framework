import type { z } from "zod";

export type AgentContext = {
  runId?: string;
  projectName?: string;
  environment?: string;
  metadata?: Record<string, unknown>;
};

export type AgentResult<T> = {
  success: boolean;
  data?: T;
  error?: string;
  metadata?: {
    agent?: string;
    durationMs?: number;
    runId?: string;
    [key: string]: unknown;
  };
};

export type AgentDefinition = {
  name: string;
  description: string;
  run: (input: unknown, context?: AgentContext) => Promise<AgentResult<unknown>>;
};

export type AgentInfo = {
  name: string;
  description: string;
};

export type AgentPipelineStep = {
  agent: string;
  input?: unknown;
  mapInput?: (previous: AgentResult<unknown>, context: AgentContext) => unknown;
};

export type AgentPipelineStepResult = {
  agent: string;
  result: AgentResult<unknown>;
};

export type AgentPipelineResult = {
  runId: string;
  success: boolean;
  steps: AgentPipelineStepResult[];
  finalOutput?: unknown;
};

export type AgentMemoryEntry = {
  runId: string;
  agentName: string;
  timestamp: string;
  success: boolean;
  durationMs?: number;
};

export type AgentSchemas<TInput, TOutput> = {
  input: z.ZodType<TInput>;
  output?: z.ZodType<TOutput>;
};
