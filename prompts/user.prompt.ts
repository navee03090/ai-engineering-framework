/**
 * Backward-compatible aliases. Prefer template IDs via resolveTemplate().
 * @see lib/prompt-manager.ts
 * @see prompts/templates/disaster/
 */
export const userPromptTemplates = {
  summarize: "disaster.summarize",
  classify: "disaster.classify",
  incidentIntake: "disaster.incident-intake",
} as const;

export type UserPromptTemplateKey = keyof typeof userPromptTemplates;
