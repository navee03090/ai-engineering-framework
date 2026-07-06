export const civicProcedurePrompt = {
  id: "civic.procedure",
  version: "1.0.0",
  description: "Structured government service guidance for Pakistani citizens.",
  role: "user" as const,
  template: `A Pakistani citizen needs help with a government service.

Citizen question:
{{query}}

Available government services knowledge base:
{{servicesKnowledge}}

{{languageInstruction}}

Identify the most relevant service and return structured JSON with:
- serviceName: official service name
- serviceId: id from knowledge base
- department: responsible department
- fee: official fee (PKR)
- processingTime: expected processing time
- answer: detailed step-by-step guidance for the citizen (use markdown formatting)
- confidence: number 0-100 for how confident you are in the match
- checklist: array of { name, status } where status is required | optional
- warnings: array of scam/unofficial fee warnings (polite, never accuse officials)
- sources: array of { title, url } with placeholder "#" URLs

If the question does not match any service, still provide helpful general guidance and set confidence below 60.`,
  requiredVariables: ["query", "servicesKnowledge", "languageInstruction"],
  tags: ["civic", "procedure", "assistant"],
};

export const civicDocumentVerifyPrompt = {
  id: "civic.document-verify",
  version: "1.0.0",
  description:
    "OCR and compare officer-requested documents against official checklist.",
  role: "user" as const,
  template: `Analyze this image of a handwritten or typed note from a government office officer.

The citizen is applying for: {{serviceName}}

Official required documents for this service:
{{officialDocuments}}

{{languageInstruction}}

Tasks:
1. Extract all document names mentioned or requested in the image.
2. Compare each against the official checklist.
3. Classify each as: required | optional | unknown | missing
   - required: on official list and mentioned
   - optional: not on official list but harmless
   - unknown: mentioned but not on official list (citizen should politely ask for written requirement)
   - missing: on official list but NOT mentioned in the note
4. Write a polite advisory for the citizen (never accuse the officer).

Return structured JSON with:
- serviceName
- confidence: 0-100
- extractedDocuments: array of { name, status }
- advisory: polite guidance paragraph`,
  requiredVariables: ["serviceName", "officialDocuments", "languageInstruction"],
  tags: ["civic", "ocr", "document-verify"],
};
