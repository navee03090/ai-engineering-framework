export const disasterClassifyPrompt = {
  id: "disaster.classify",
  version: "1.0.0",
  description: "Classify disaster incident reports by category, severity, and action.",
  role: "user" as const,
  template: `Classify the following disaster incident report for Pakistan emergency response.

Return JSON with:
- category: flood | earthquake | fire | medical | infrastructure | other
- severity: low | medium | high | critical
- summary: one-paragraph operational summary
- recommendedAction: immediate next step for coordinators

Incident report:
{{content}}`,
  requiredVariables: ["content"],
  tags: ["disaster", "classify", "structured-output"],
};
