export const civicEmergencyClassifyPrompt = {
  id: "civic.emergency.classify",
  version: "1.0.0",
  description: "Classify Pakistan emergency civic reports for command-center triage.",
  role: "user" as const,
  template: `Classify this Pakistan emergency civic report for a command center.

Return JSON with:
- category: flood | earthquake | fire | medical | infrastructure | other
- severity: low | medium | high | critical
- summary: one-paragraph operational summary for coordinators
- recommendedAction: immediate next step for response teams

Incident report:
{{content}}`,
  requiredVariables: ["content"],
  tags: ["civic", "emergency", "classify"],
};
