import { createRunContext } from "@/agents/memory";
import { registerDefaultAgents, type AgentRegistry, agentRegistry } from "@/agents/registry";
import type {
  AgentContext,
  AgentPipelineResult,
  AgentPipelineStep,
  AgentResult,
} from "@/agents/types";

export class AgentOrchestrator {
  constructor(private readonly registry: AgentRegistry = agentRegistry) {}

  ensureReady(): void {
    registerDefaultAgents(this.registry);
  }

  listAgents() {
    this.ensureReady();
    return this.registry.list();
  }

  async run<T>(
    name: string,
    input: unknown,
    context: AgentContext = {}
  ): Promise<AgentResult<T>> {
    this.ensureReady();

    const agent = this.registry.get(name);

    if (!agent) {
      return { success: false, error: `Agent not found: ${name}` };
    }

    const runContext = createRunContext(context);
    return agent.execute(input, runContext) as Promise<AgentResult<T>>;
  }

  async runPipeline(
    steps: AgentPipelineStep[],
    context: AgentContext = {}
  ): Promise<AgentPipelineResult> {
    this.ensureReady();

    const runContext = createRunContext(context);
    const pipelineResults: AgentPipelineResult["steps"] = [];
    let finalOutput: unknown;
    let success = true;

    for (const step of steps) {
      const previous = pipelineResults.at(-1)?.result ?? {
        success: false,
        error: "No previous step",
      };

      const input =
        step.mapInput?.(previous, runContext) ?? step.input ?? finalOutput ?? previous.data;

      const result = await this.run(step.agent, input, runContext);
      pipelineResults.push({ agent: step.agent, result });

      if (!result.success) {
        success = false;
        break;
      }

      finalOutput = result.data;
    }

    return {
      runId: runContext.runId!,
      success,
      steps: pipelineResults,
      finalOutput,
    };
  }
}

export const orchestrator = new AgentOrchestrator();
