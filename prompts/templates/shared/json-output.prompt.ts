export const jsonOutputInstructionPrompt = {
  id: "shared.json-output",
  version: "1.0.0",
  description: "Instructs the model to return valid JSON only.",
  role: "user" as const,
  template:
    "Respond with valid JSON only. Do not include markdown fences, commentary, or trailing text.",
  tags: ["shared", "structured-output"],
};
