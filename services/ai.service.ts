import { orchestrator } from "@/agents/orchestrator";
import type { AgentContext, AgentPipelineStep, AgentResult } from "@/agents/types";
import { AppError } from "@/lib/api/errors";

function assertGeminiConfigured(): void {
  if (!process.env.GEMINI_API_KEY) {
    throw new AppError("GEMINI_API_KEY is not configured.", 503, "AI_UNAVAILABLE");
  }
}

export const aiService = {
  listAgents() {
    return orchestrator.listAgents();
  },

  async runAgent<T>(
    agent: string,
    input: unknown,
    context?: AgentContext
  ): Promise<AgentResult<T>> {
    assertGeminiConfigured();
    return orchestrator.run<T>(agent, input, context);
  },

  async runPipeline(steps: AgentPipelineStep[], context?: AgentContext) {
    assertGeminiConfigured();
    return orchestrator.runPipeline(steps, context);
  },

  async classifyIncident(content: string, context?: AgentContext) {
    return this.runAgent("classifier", { content }, {
      projectName: "Pakistan Disaster Response AI",
      ...context,
    });
  },

  async summarizeIncident(
    content: string,
    audience = "emergency coordinators",
    context?: AgentContext
  ) {
    return this.runAgent(
      "summarizer",
      { content, audience, maxWords: 150 },
      {
        projectName: "Pakistan Disaster Response AI",
        ...context,
      }
    );
  },

  async analyzeIncident(content: string, context?: AgentContext) {
    assertGeminiConfigured();

    return orchestrator.runPipeline(
      [
        {
          agent: "classifier",
          input: { content },
        },
        {
          agent: "summarizer",
          mapInput: (previous) => {
            if (!previous.success || !previous.data) {
              return { content, audience: "emergency coordinators", maxWords: 150 };
            }

            const classified = previous.data as { summary?: string };
            return {
              content: classified.summary ?? content,
              audience: "emergency coordinators",
              maxWords: 150,
            };
          },
        },
      ],
      {
        projectName: "Pakistan Disaster Response AI",
        ...context,
      }
    );
  },
};
