export const civicIntentPrompt = {
  id: "civic.intent",
  version: "1.0.0",
  description:
    "Detect citizen intent, language, entities, and target government service.",
  role: "user" as const,
  template: `Analyze this Pakistani citizen query about government services.

Query: {{query}}
User language preference: {{language}}

Available services (slug | name):
{{serviceIndex}}

{{languageInstruction}}

Return JSON:
- detectedLanguage: en | ur
- translatedQuery: English translation if query is Urdu, else same query
- intent: short intent label (e.g. "license_renewal", "passport_application")
- serviceSlug: best matching slug from index, or "unknown"
- serviceName: matched service name
- entities: array of plain strings — city/location if mentioned plus documents/dates
- confidence: 0-100
- needsClarification: boolean
- clarificationQuestion: string if needsClarification else empty`,
  requiredVariables: ["query", "language", "serviceIndex", "languageInstruction"],
  tags: ["civic", "intent", "agent"],
};

export const civicCompliancePrompt = {
  id: "civic.compliance",
  version: "1.0.0",
  description: "Compare extracted documents against official checklist.",
  role: "user" as const,
  template: `Compare officer-requested documents against the official government checklist.

Service: {{serviceName}}
Official documents: {{officialDocuments}}

OCR extracted documents:
{{extractedDocuments}}

{{languageInstruction}}

Rules:
- Never accuse government officials
- Use polite, careful wording
- Classify: required | optional | unknown | missing | verified

Return JSON:
- serviceName
- complianceScore: 0-100
- items: array of { name, status, note }
- missingDocuments: string array
- suspiciousRequests: string array (documents not on official list)
- advisory: polite paragraph for citizen`,
  requiredVariables: [
    "serviceName",
    "officialDocuments",
    "extractedDocuments",
    "languageInstruction",
  ],
  tags: ["civic", "compliance", "agent"],
};

export const civicOcrPrompt = {
  id: "civic.ocr",
  version: "1.0.0",
  description: "Extract document names from officer note image.",
  role: "user" as const,
  template: `Extract all document names from this government office note image.

Service context: {{serviceName}}
{{languageInstruction}}

Normalize document names (e.g. "ID card" → "CNIC").
Return JSON:
- rawText: full extracted text
- documents: array of { name, normalizedName, confidence }
- overallConfidence: 0-100`,
  requiredVariables: ["serviceName", "languageInstruction"],
  tags: ["civic", "ocr", "agent"],
};

export const civicRecommendationPrompt = {
  id: "civic.recommendation",
  version: "1.0.0",
  description: "Generate checklist, tips, timeline, FAQs, and next steps.",
  role: "user" as const,
  template: `Generate citizen guidance for a Pakistan government service.

Service knowledge:
{{serviceKnowledge}}

Citizen intent:
{{intentSummary}}

{{languageInstruction}}

Keep responses concise. Use only documents from the official list above.

Return JSON:
- checklist: array of { name, status } — all official documents, status = required | optional
- preparationTips: max 4 short strings
- timeline: max 4 steps { step, description, duration }
- faqs: max 3 { question, answer } — one sentence each
- alternatives: max 2 strings
- nextSteps: max 4 short strings
- warnings: max 3 strings (scam prevention, polite tone)`,
  requiredVariables: ["serviceKnowledge", "intentSummary", "languageInstruction"],
  tags: ["civic", "recommendation", "agent"],
};

export const civicReportPrompt = {
  id: "civic.report",
  version: "1.0.0",
  description: "Assemble final citizen report with summary, PDF content, QR data.",
  role: "user" as const,
  template: `Assemble a final citizen report from pipeline data.

Report type: {{reportType}}
Service: {{serviceName}}

Intent data: {{intentData}}
Knowledge data: {{knowledgeData}}
Recommendation data: {{recommendationData}}
Compliance data: {{complianceData}}

{{languageInstruction}}

Return JSON:
- citizenSummary: 2-3 paragraph summary for citizen
- printableSections: array of { title, content }
- pdfTitle: string
- pdfSections: array of { heading, body }
- qrData: JSON string for QR code (serviceSlug, reportDate, checklist count)
- metadata: { serviceName, department, fee, processingTime, confidence }`,
  requiredVariables: [
    "reportType",
    "serviceName",
    "intentData",
    "knowledgeData",
    "recommendationData",
    "complianceData",
    "languageInstruction",
  ],
  tags: ["civic", "report", "agent"],
};
