import { PromptRegistry, registerDefaultPrompts } from "@/prompts/registry";

export { baseSystemPrompt } from "@/prompts/base.prompt";
export {
  ensurePromptRegistry,
  promptRegistry,
  registerDefaultPrompts,
} from "@/prompts/registry";
export { systemPrompt } from "@/prompts/system.prompt";
export { userPromptTemplates } from "@/prompts/user.prompt";
export { promptTemplatePacks } from "@/prompts/templates";
export type * from "@/prompts/types";

export function createPromptRuntime() {
  const registry = new PromptRegistry();
  registerDefaultPrompts(registry);
  return { registry };
}
