import { baseSystemPrompt } from "@/prompts/base.prompt";
import { systemPrompt } from "@/prompts/system.prompt";

export type PromptContext = Record<string, string | number | boolean | null | undefined>;

function interpolate(template: string, context: PromptContext = {}): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => {
    const value = context[key];
    return value === undefined || value === null ? "" : String(value);
  });
}

export function buildSystemPrompt(context?: PromptContext): string {
  return [baseSystemPrompt, systemPrompt].map((part) => interpolate(part, context)).join("\n\n");
}

export function buildUserPrompt(template: string, context?: PromptContext): string {
  return interpolate(template, context);
}

export function composePrompt(parts: Array<string | undefined | null>): string {
  return parts.filter(Boolean).join("\n\n");
}
