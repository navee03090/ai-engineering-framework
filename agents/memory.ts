import type { AgentContext, AgentMemoryEntry } from "@/agents/types";

const MAX_ENTRIES_PER_RUN = 50;

export class AgentMemoryStore {
  private readonly entries = new Map<string, AgentMemoryEntry[]>();

  record(entry: AgentMemoryEntry): void {
    const runEntries = this.entries.get(entry.runId) ?? [];

    if (runEntries.length >= MAX_ENTRIES_PER_RUN) {
      runEntries.shift();
    }

    runEntries.push(entry);
    this.entries.set(entry.runId, runEntries);
  }

  getRun(runId: string): AgentMemoryEntry[] {
    return [...(this.entries.get(runId) ?? [])];
  }

  getLatestRunId(): string | undefined {
    const runs = [...this.entries.keys()];
    return runs.at(-1);
  }

  clearRun(runId: string): void {
    this.entries.delete(runId);
  }

  clearAll(): void {
    this.entries.clear();
  }
}

export function createRunContext(
  context: AgentContext = {},
  runId: string = crypto.randomUUID()
): AgentContext {
  return {
    ...context,
    runId: context.runId ?? runId,
  };
}

export const agentMemory = new AgentMemoryStore();
