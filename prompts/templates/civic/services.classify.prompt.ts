export const civicServicesClassifyPrompt = {
  id: "civic.services.classify",
  version: "1.0.0",
  description: "Classify Pakistan public services civic reports.",
  role: "user" as const,
  template: `Classify this Pakistan public services report for municipal/coordinator triage.

Return JSON with:
- category: utilities | infrastructure | environment | governance | health | other
- severity: low | medium | high | critical
- summary: one-paragraph summary for service teams
- recommendedAction: immediate operational next step

Report:
{{content}}`,
  requiredVariables: ["content"],
  tags: ["civic", "services", "classify"],
};
