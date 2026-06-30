import { AgentMemoryStore } from "@/agents/memory";
import { AgentOrchestrator } from "@/agents/orchestrator";
import { AgentRegistry, registerDefaultAgents } from "@/agents/registry";
import { ClassifierAgent } from "@/agents/classifier.agent";
import { SummarizerAgent } from "@/agents/summarizer.agent";

export { BaseAgent, logAgentEvent } from "@/agents/base-agent";
export { AgentMemoryStore, agentMemory, createRunContext } from "@/agents/memory";
export { AgentOrchestrator, orchestrator } from "@/agents/orchestrator";
export { AgentRegistry, agentRegistry, registerDefaultAgents } from "@/agents/registry";
export { ClassifierAgent } from "@/agents/classifier.agent";
export { SummarizerAgent } from "@/agents/summarizer.agent";
export type * from "@/agents/types";

export function createAgentRuntime() {
  const registry = new AgentRegistry();
  const memory = new AgentMemoryStore();
  const orchestrator = new AgentOrchestrator(registry);

  registerDefaultAgents(registry);

  return { registry, memory, orchestrator };
}

export const defaultAgents = {
  summarizer: SummarizerAgent,
  classifier: ClassifierAgent,
};
