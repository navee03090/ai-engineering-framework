import { describe, expect, it, beforeEach } from "vitest";
import { z } from "zod";

import { BaseAgent } from "@/agents/base-agent";
import { EchoAgent } from "@/agents/echo.agent";
import { AgentMemoryStore } from "@/agents/memory";
import { AgentOrchestrator } from "@/agents/orchestrator";
import { AgentRegistry } from "@/agents/registry";

class FailingAgent extends BaseAgent<{ value: string }, { ok: boolean }> {
  readonly name = "failing";
  readonly description = "Always fails for pipeline tests";
  readonly inputSchema = z.object({ value: z.string() });

  protected async run(): Promise<{ ok: boolean }> {
    throw new Error("Intentional failure");
  }
}

describe("AgentRegistry", () => {
  it("registers and lists agents", () => {
    const registry = new AgentRegistry();
    registry.register(new EchoAgent());

    expect(registry.list()).toEqual([
      { name: "echo", description: expect.any(String) },
    ]);
    expect(registry.has("echo")).toBe(true);
  });

  it("throws when registering duplicate agent names", () => {
    const registry = new AgentRegistry();
    registry.register(new EchoAgent());

    expect(() => registry.register(new EchoAgent())).toThrow(/already registered/);
  });
});

describe("BaseAgent", () => {
  it("validates input before run", async () => {
    const agent = new EchoAgent();
    const result = await agent.execute({});

    expect(result.success).toBe(false);
    expect(result.error).toContain("message");
  });

  it("returns typed output on success", async () => {
    const agent = new EchoAgent();
    const result = await agent.execute({ message: "hello" });

    expect(result.success).toBe(true);
    expect(result.data).toEqual({ echo: "hello" });
    expect(result.metadata?.agent).toBe("echo");
  });
});

describe("AgentOrchestrator", () => {
  let registry: AgentRegistry;
  let orchestrator: AgentOrchestrator;

  beforeEach(() => {
    registry = new AgentRegistry();
    registry.register(new EchoAgent());
    registry.register(new FailingAgent());
    orchestrator = new AgentOrchestrator(registry);
  });

  it("runs a registered agent", async () => {
    const result = await orchestrator.run("echo", { message: "pipeline" });

    expect(result.success).toBe(true);
    expect(result.data).toEqual({ echo: "pipeline" });
  });

  it("returns error for unknown agent", async () => {
    const result = await orchestrator.run("missing", {});

    expect(result.success).toBe(false);
    expect(result.error).toContain("not found");
  });

  it("runs a multi-step pipeline and passes output forward", async () => {
    const result = await orchestrator.runPipeline([
      { agent: "echo", input: { message: "step-1" } },
      {
        agent: "echo",
        mapInput: (previous) => ({
          message: `wrapped:${(previous.data as { echo: string }).echo}`,
        }),
      },
    ]);

    expect(result.success).toBe(true);
    expect(result.steps).toHaveLength(2);
    expect(result.finalOutput).toEqual({ echo: "wrapped:step-1" });
    expect(result.runId).toBeTruthy();
  });

  it("stops pipeline when a step fails", async () => {
    const result = await orchestrator.runPipeline([
      { agent: "echo", input: { message: "ok" } },
      { agent: "failing", input: { value: "boom" } },
      { agent: "echo", input: { message: "never-runs" } },
    ]);

    expect(result.success).toBe(false);
    expect(result.steps).toHaveLength(2);
  });
});

describe("AgentMemoryStore", () => {
  it("stores and retrieves run entries", () => {
    const memory = new AgentMemoryStore();

    memory.record({
      runId: "run-1",
      agentName: "echo",
      timestamp: new Date().toISOString(),
      success: true,
      durationMs: 12,
    });

    expect(memory.getRun("run-1")).toHaveLength(1);
    expect(memory.getRun("run-1")[0]?.agentName).toBe("echo");
  });
});

describe("registerDefaultAgents", () => {
  it("registers summarizer and classifier", async () => {
    const { registerDefaultAgents } = await import("@/agents/registry");
    const registry = new AgentRegistry();

    registerDefaultAgents(registry);

    const names = registry.list().map((agent) => agent.name).sort();
    expect(names).toEqual(["classifier", "summarizer"]);
  });
});
