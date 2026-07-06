import { IntentAgent } from "@/agents/intent.agent";
import { KnowledgeAgent } from "@/agents/knowledge.agent";
import { OcrAgent } from "@/agents/ocr.agent";
import { ComplianceAgent } from "@/agents/compliance.agent";
import { RecommendationAgent } from "@/agents/recommendation.agent";
import { ReportAgent } from "@/agents/report.agent";
import { ProcedureAgent } from "@/agents/procedure.agent";
import { DocumentVerifyAgent } from "@/agents/document-verify.agent";
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

  if (!registry.has("summarizer")) registry.register(new SummarizerAgent());
  if (!registry.has("classifier")) registry.register(new ClassifierAgent());
  if (!registry.has("intent")) registry.register(new IntentAgent());
  if (!registry.has("knowledge")) registry.register(new KnowledgeAgent());
  if (!registry.has("ocr")) registry.register(new OcrAgent());
  if (!registry.has("compliance")) registry.register(new ComplianceAgent());
  if (!registry.has("recommendation")) registry.register(new RecommendationAgent());
  if (!registry.has("report")) registry.register(new ReportAgent());
  if (!registry.has("procedure")) registry.register(new ProcedureAgent());
  if (!registry.has("document-verify")) registry.register(new DocumentVerifyAgent());

  if (registry === agentRegistry) {
    defaultsRegistered = true;
  }
}
