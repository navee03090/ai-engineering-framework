import type { z } from "zod";

import { agentMemory } from "@/agents/memory";
import type { AgentContext, AgentDefinition, AgentResult } from "@/agents/types";

function formatValidationError(error: z.ZodError): string {
  return error.issues
    .map((issue) => `${issue.path.join(".") || "input"}: ${issue.message}`)
    .join("; ");
}

export function logAgentEvent(event: {
  agent: string;
  success: boolean;
  durationMs: number;
  runId?: string;
  error?: string;
}): void {
  const payload = {
    type: "agent.run",
    ...event,
  };

  if (process.env.NODE_ENV === "production") {
    console.info(JSON.stringify(payload));
    return;
  }

  console.info(
    `[agent:${event.agent}] ${event.success ? "ok" : "failed"} (${event.durationMs}ms)`,
    event.runId ? `run=${event.runId}` : "",
    event.error ?? ""
  );
}

export abstract class BaseAgent<TInput, TOutput> {
  abstract readonly name: string;
  abstract readonly description: string;
  abstract readonly inputSchema: z.ZodType<TInput>;

  async execute(
    rawInput: unknown,
    context: AgentContext = {}
  ): Promise<AgentResult<TOutput>> {
    const startedAt = Date.now();
    const runId = context.runId ?? crypto.randomUUID();

    const parsed = this.inputSchema.safeParse(rawInput);

    if (!parsed.success) {
      const durationMs = Date.now() - startedAt;
      const error = formatValidationError(parsed.error);

      logAgentEvent({
        agent: this.name,
        success: false,
        durationMs,
        runId,
        error,
      });

      return {
        success: false,
        error,
        metadata: { agent: this.name, durationMs, runId },
      };
    }

    try {
      const data = await this.run(parsed.data, { ...context, runId });
      const durationMs = Date.now() - startedAt;

      agentMemory.record({
        runId,
        agentName: this.name,
        timestamp: new Date().toISOString(),
        success: true,
        durationMs,
      });

      logAgentEvent({
        agent: this.name,
        success: true,
        durationMs,
        runId,
      });

      return {
        success: true,
        data,
        metadata: { agent: this.name, durationMs, runId },
      };
    } catch (error) {
      const durationMs = Date.now() - startedAt;
      const message = error instanceof Error ? error.message : "Agent execution failed";

      agentMemory.record({
        runId,
        agentName: this.name,
        timestamp: new Date().toISOString(),
        success: false,
        durationMs,
      });

      logAgentEvent({
        agent: this.name,
        success: false,
        durationMs,
        runId,
        error: message,
      });

      return {
        success: false,
        error: message,
        metadata: { agent: this.name, durationMs, runId },
      };
    }
  }

  protected abstract run(input: TInput, context: AgentContext): Promise<TOutput>;

  toDefinition(): AgentDefinition {
    return {
      name: this.name,
      description: this.description,
      run: (input, context) => this.execute(input, context),
    };
  }
}
