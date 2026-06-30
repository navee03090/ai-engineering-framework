export const disasterIncidentIntakePrompt = {
  id: "disaster.incident-intake",
  version: "1.0.0",
  description: "Normalize raw incident submissions into structured intake fields.",
  role: "user" as const,
  template: `Normalize this raw incident submission into structured intake data.

Extract when present:
- location
- hazardType
- peopleAffected
- infrastructureImpact
- reporterContact
- urgencyNotes

Raw submission:
{{content}}`,
  requiredVariables: ["content"],
  tags: ["disaster", "intake", "structured-output"],
};
