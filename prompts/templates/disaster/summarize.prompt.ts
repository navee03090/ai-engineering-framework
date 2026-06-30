export const disasterSummarizePrompt = {
  id: "disaster.summarize",
  version: "1.0.0",
  description: "Summarize incident or report content for a target audience.",
  role: "user" as const,
  template: `Summarize the following disaster incident report for {{audience}}.

Requirements:
- Lead with the most urgent facts (location, hazard, people affected).
- Use clear, operational language suitable for emergency coordination.
- Keep the summary under {{maxWords}} words unless critical details require more.

Incident report:
{{content}}`,
  requiredVariables: ["audience", "content"],
  tags: ["disaster", "summarize"],
};
