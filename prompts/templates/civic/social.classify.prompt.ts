export const civicSocialClassifyPrompt = {
  id: "civic.social.classify",
  version: "1.0.0",
  description: "Classify Pakistan community and social civic reports.",
  role: "user" as const,
  template: `Classify this Pakistan community/social civic report for local coordinator triage.

Return JSON with:
- category: health | education | environment | governance | medical | other
- severity: low | medium | high | critical
- summary: one-paragraph summary for community response
- recommendedAction: recommended next step for coordinators

Report:
{{content}}`,
  requiredVariables: ["content"],
  tags: ["civic", "social", "classify"],
};
