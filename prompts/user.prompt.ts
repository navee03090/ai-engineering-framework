export const userPromptTemplates = {
  summarize: "Summarize the following content for {{audience}}:\n\n{{content}}",
  classify: "Classify the following incident report:\n\n{{content}}",
} as const;
