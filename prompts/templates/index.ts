import * as civic from "@/prompts/templates/civic";
import * as disaster from "@/prompts/templates/disaster";
import * as shared from "@/prompts/templates/shared";

export const promptTemplatePacks = {
  civic,
  disaster,
  shared,
} as const;

export type PromptPackName = keyof typeof promptTemplatePacks;
