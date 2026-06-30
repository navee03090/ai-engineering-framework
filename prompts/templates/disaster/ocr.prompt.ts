export const disasterOcrPrompt = {
  id: "disaster.ocr",
  version: "1.0.0",
  description: "Extract and structure text from incident documents (Phase 11+).",
  role: "user" as const,
  template: `Extract and structure text from the following incident document.

Preserve:
- dates and times
- locations
- names of facilities or landmarks
- numeric counts (injuries, displaced persons, vehicles)

Document text:
{{documentText}}`,
  requiredVariables: ["documentText"],
  tags: ["disaster", "ocr", "future"],
};
