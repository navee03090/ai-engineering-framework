import type { AgentDefinition, AgentResult } from "@/agents/types";

/**
 * Multi-agent orchestration ships in Phase 6.
 * Sprint 1 reserves the module boundary.
 */
export class AgentOrchestrator {
  private readonly agents = new Map<string, AgentDefinition>();

  register(agent: AgentDefinition) {
    this.agents.set(agent.name, agent);
  }

  async run<T>(name: string, input: unknown): Promise<AgentResult<T>> {
    const agent = this.agents.get(name);

    if (!agent) {
      return { success: false, error: `Agent not found: ${name}` };
    }

    return (await agent.run(input)) as AgentResult<T>;
  }
}

export const orchestrator = new AgentOrchestrator();
