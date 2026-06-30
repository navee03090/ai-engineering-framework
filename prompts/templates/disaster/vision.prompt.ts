export const disasterVisionPrompt = {
  id: "disaster.vision",
  version: "1.0.0",
  description: "Analyze disaster scene imagery for operational signals (Phase 11+).",
  role: "user" as const,
  template: `Analyze the disaster scene image context and describe operational signals for responders.

Focus on:
- visible hazards
- structural damage
- access/route blockages
- visible casualties or crowds requiring aid

Image context:
{{imageDescription}}

Location hint: {{location}}`,
  requiredVariables: ["imageDescription"],
  tags: ["disaster", "vision", "future"],
};
