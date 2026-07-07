import { describe, expect, it, beforeEach } from "vitest";

import {
  appendJsonOutputInstruction,
  assertPromptContext,
  buildAgentPromptBundle,
  buildSystemPrompt,
  getMissingVariables,
  resolveTemplate,
} from "@/lib/prompt-manager";
import { PromptRegistry, registerDefaultPrompts } from "@/prompts/registry";

describe("resolveTemplate", () => {
  it("interpolates variables in disaster summarize template", () => {
    const resolved = resolveTemplate("disaster.summarize", {
      audience: "field teams",
      content: "Flash flood in Swat.",
      maxWords: 120,
    });

    expect(resolved.id).toBe("disaster.summarize");
    expect(resolved.text).toContain("field teams");
    expect(resolved.text).toContain("Flash flood in Swat.");
    expect(resolved.text).toContain("120");
  });

  it("throws when required variables are missing", () => {
    expect(() =>
      resolveTemplate("disaster.classify", {})
    ).toThrow(/Missing required prompt variables/);
  });
});

describe("getMissingVariables", () => {
  it("returns missing required keys", () => {
    const registry = new PromptRegistry();
    registerDefaultPrompts(registry);
    const template = registry.get("disaster.summarize");

    expect(getMissingVariables(template, { audience: "ops" })).toEqual(["content"]);
  });
});

describe("assertPromptContext", () => {
  it("passes when all required variables are present", () => {
    const registry = new PromptRegistry();
    registerDefaultPrompts(registry);
    const template = registry.get("disaster.classify");

    expect(() =>
      assertPromptContext(template, { content: "Building collapse reported." })
    ).not.toThrow();
  });
});

describe("buildAgentPromptBundle", () => {
  it("composes system and user prompts with metadata", () => {
    const bundle = buildAgentPromptBundle({
      userTemplateId: "disaster.classify",
      userContext: { content: "Wildfire near forest." },
      systemContext: {
        projectName: "Pakistan Disaster Response AI",
        environment: "test",
      },
    });

    expect(bundle.system).toContain("AI Engineering Framework");
    expect(bundle.user).toContain("Wildfire near forest.");
    expect(bundle.meta.userTemplateId).toBe("disaster.classify");
  });

  it("can append shared JSON output instruction", () => {
    const bundle = buildAgentPromptBundle({
      userTemplateId: "disaster.classify",
      userContext: { content: "Test incident." },
      appendJsonInstruction: true,
    });

    expect(bundle.user).toContain("valid JSON only");
  });
});

describe("buildSystemPrompt", () => {
  it("interpolates project context", () => {
    const prompt = buildSystemPrompt({
      projectName: "EcoMind AI",
      environment: "production",
    });

    expect(prompt).toContain("EcoMind AI");
    expect(prompt).toContain("production");
  });
});

describe("appendJsonOutputInstruction", () => {
  it("appends shared json instruction template", () => {
    const prompt = appendJsonOutputInstruction("Classify this incident.");
    expect(prompt).toContain("Classify this incident.");
    expect(prompt).toContain("valid JSON only");
  });
});

describe("PromptRegistry", () => {
  let registry: PromptRegistry;

  beforeEach(() => {
    registry = new PromptRegistry();
    registerDefaultPrompts(registry);
  });

  it("registers default disaster and shared templates", () => {
    const ids = registry.list().map((item) => item.id).sort();
    expect(ids).toContain("disaster.classify");
    expect(ids).toContain("disaster.summarize");
    expect(ids).toContain("shared.json-output");
  });

  it("lists templates by tag", () => {
    const disasterPrompts = registry.listByTag("disaster");
    expect(disasterPrompts.length).toBeGreaterThanOrEqual(3);
    expect(disasterPrompts.every((item) => item.tags?.includes("disaster"))).toBe(true);
  });

  it("resolves latest version when version is omitted", () => {
    const template = registry.get("disaster.summarize");
    expect(template.version).toBe("1.0.0");
  });
});
