export const civicProcedurePrompt = {
  id: "civic.procedure",
  version: "1.0.0",
  description: "Structured environmental service guidance for Pakistani citizens.",
  role: "user" as const,
  template: `A Pakistani citizen needs help reporting a waste or environmental issue.

Citizen question:
{{query}}

Available environmental services knowledge base:
{{servicesKnowledge}}

{{languageInstruction}}

Identify the most relevant environmental service and return structured JSON with:
- serviceName: official service name
- serviceId: id from knowledge base
- department: responsible authority (LWMC, EPA, WASA, etc.)
- fee: estimated cost or "Free municipal service"
- processingTime: estimated municipal response time
- answer: detailed step-by-step guidance for the citizen (use markdown formatting)
- confidence: number 0-100 for how confident you are in the match
- checklist: array of { name, status } where status is required | optional (citizen evidence checklist)
- warnings: array of safety and environmental awareness tips (polite, never accuse individuals)
- sources: array of { title, url } with placeholder "#" URLs

If the question does not match any service, still provide helpful general environmental guidance and set confidence below 60.`,
  requiredVariables: ["query", "servicesKnowledge", "languageInstruction"],
  tags: ["civic", "procedure", "assistant"],
};

export const civicDocumentVerifyPrompt = {
  id: "civic.document-verify",
  version: "1.0.0",
  description:
    "OCR and compare citizen-uploaded waste/evidence images against environmental reporting checklist.",
  role: "user" as const,
  template: `Analyze this image uploaded by a citizen — waste photo, notice board, environmental warning, or illegal dumping sign.

The citizen is reporting: {{serviceName}}

Official evidence checklist for this environmental issue:
{{officialDocuments}}

{{languageInstruction}}

Tasks:
1. Extract all text, addresses, phone numbers, instructions, and warning labels from the image.
2. Compare extracted evidence against the official checklist.
3. Classify each as: required | optional | unknown | missing
   - required: on official checklist and present in image
   - optional: not on checklist but helpful evidence
   - unknown: visible but not on checklist (note carefully, do not accuse)
   - missing: on checklist but NOT visible in the image
4. Write a polite advisory for the citizen (never accuse individuals; use careful environmental language).

Return structured JSON with:
- serviceName
- confidence: 0-100
- extractedDocuments: array of { name, status }
- advisory: polite guidance paragraph`,
  requiredVariables: ["serviceName", "officialDocuments", "languageInstruction"],
  tags: ["civic", "ocr", "document-verify"],
};
