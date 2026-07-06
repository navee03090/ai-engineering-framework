import { baseSystemPrompt } from "@/prompts/base.prompt";
import { ensurePromptRegistry } from "@/prompts/registry";
import { systemPrompt } from "@/prompts/system.prompt";
import type {
  AgentPromptBundle,
  PromptContext,
  PromptTemplate,
  ResolvedPrompt,
} from "@/prompts/types";

export type { PromptContext } from "@/prompts/types";

function interpolate(template: string, context: PromptContext = {}): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => {
    const value = context[key];
    return value === undefined || value === null ? "" : String(value);
  });
}

export function getMissingVariables(
  template: PromptTemplate,
  context: PromptContext
): string[] {
  const required = template.requiredVariables ?? [];

  return required.filter((key) => {
    const value = context[key];
    return value === undefined || value === null || String(value).trim() === "";
  });
}

export function assertPromptContext(
  template: PromptTemplate,
  context: PromptContext
): void {
  const missing = getMissingVariables(template, context);

  if (missing.length > 0) {
    throw new Error(
      `Missing required prompt variables for ${template.id}: ${missing.join(", ")}`
    );
  }
}

export function resolveTemplate(
  templateId: string,
  context: PromptContext = {},
  version?: string
): ResolvedPrompt {
  const registry = ensurePromptRegistry();
  const template = registry.get(templateId, version);

  assertPromptContext(template, context);

  return {
    id: template.id,
    version: template.version,
    role: template.role,
    text: interpolate(template.template, context),
  };
}

export function buildSystemPrompt(context?: PromptContext): string {
  return [baseSystemPrompt, systemPrompt]
    .map((part) => interpolate(part, context))
    .join("\n\n");
}

/** @deprecated Use resolveTemplate(templateId, context).text */
export function buildUserPrompt(template: string, context?: PromptContext): string {
  return interpolate(template, context);
}

export function composePrompt(parts: Array<string | undefined | null>): string {
  return parts.filter(Boolean).join("\n\n");
}

export function appendJsonOutputInstruction(prompt: string): string {
  const registry = ensurePromptRegistry();
  const jsonInstruction = registry.get("shared.json-output").template;
  return composePrompt([prompt, jsonInstruction]);
}

export function buildAgentPromptBundle(options: {
  userTemplateId: string;
  userContext: PromptContext;
  userVersion?: string;
  systemContext?: PromptContext;
  extraSystemParts?: string[];
  appendJsonInstruction?: boolean;
}): AgentPromptBundle {
  const userResolved = resolveTemplate(
    options.userTemplateId,
    options.userContext,
    options.userVersion
  );

  const user = options.appendJsonInstruction
    ? appendJsonOutputInstruction(userResolved.text)
    : userResolved.text;

  const system = composePrompt([
    buildSystemPrompt(options.systemContext),
    ...(options.extraSystemParts ?? []),
  ]);

  return {
    system,
    user,
    meta: {
      systemTemplateIds: ["base.system", "project.system"],
      userTemplateId: userResolved.id,
      userVersion: userResolved.version,
    },
  };
}

export function listPromptTemplates() {
  return ensurePromptRegistry().list();
}

export function listPromptTemplatesByTag(tag: string) {
  return ensurePromptRegistry().listByTag(tag);
}
