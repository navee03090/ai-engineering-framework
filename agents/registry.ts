import { ClassifierAgent } from "@/agents/classifier.agent";
import { SummarizerAgent } from "@/agents/summarizer.agent";
import type { BaseAgent } from "@/agents/base-agent";
import type { AgentInfo } from "@/agents/types";

export class AgentRegistry {
  private readonly agents = new Map<string, BaseAgent<unknown, unknown>>();

  register<TInput, TOutput>(agent: BaseAgent<TInput, TOutput>): void {
    if (this.agents.has(agent.name)) {
      throw new Error(`Agent already registered: ${agent.name}`);
    }

    this.agents.set(agent.name, agent as BaseAgent<unknown, unknown>);
  }

  get(name: string): BaseAgent<unknown, unknown> | undefined {
    return this.agents.get(name);
  }

  has(name: string): boolean {
    return this.agents.has(name);
  }

  list(): AgentInfo[] {
    return [...this.agents.values()].map((agent) => ({
      name: agent.name,
      description: agent.description,
    }));
  }

  clear(): void {
    this.agents.clear();
  }
}

export const agentRegistry = new AgentRegistry();

let defaultsRegistered = false;

export function registerDefaultAgents(registry: AgentRegistry = agentRegistry): void {
  if (defaultsRegistered && registry === agentRegistry) {
    return;
  }

  if (!registry.has("summarizer")) {
    registry.register(new SummarizerAgent());
  }

  if (!registry.has("classifier")) {
    registry.register(new ClassifierAgent());
  }

  if (registry === agentRegistry) {
    defaultsRegistered = true;
  }
}
