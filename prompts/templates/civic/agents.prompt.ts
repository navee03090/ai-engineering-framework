export const civicIntentPrompt = {
  id: "civic.intent",
  version: "1.0.0",
  description:
    "Detect environmental issue intent, language, entities, and target waste/environment service.",
  role: "user" as const,
  template: `Analyze this Pakistani citizen query about waste and environmental issues.

Query: {{query}}
User language preference: {{language}}

Available environmental services (slug | name):
{{serviceIndex}}

Detect issues such as: illegal dumping, overflowing garbage, blocked drains, plastic waste, industrial pollution, air pollution, water pollution, burning garbage, dead animals, hazardous waste.

{{languageInstruction}}

Return JSON:
- detectedLanguage: en | ur
- translatedQuery: English translation if query is Urdu, else same query
- intent: short intent label (e.g. "illegal_dumping", "garbage_overflow", "water_pollution")
- serviceSlug: best matching slug from index, or "unknown"
- serviceName: matched service name
- entities: array of plain strings — city/location/landmark if mentioned plus waste type/dates
- confidence: 0-100
- needsClarification: boolean
- clarificationQuestion: string if needsClarification else empty`,
  requiredVariables: ["query", "language", "serviceIndex", "languageInstruction"],
  tags: ["civic", "intent", "agent"],
};

export const civicCompliancePrompt = {
  id: "civic.compliance",
  version: "1.0.0",
  description: "Compare uploaded environmental evidence against official reporting checklist.",
  role: "user" as const,
  template: `Compare citizen-uploaded environmental evidence against the official reporting checklist.

Environmental issue: {{serviceName}}
Official evidence checklist: {{officialDocuments}}

OCR extracted text and evidence items:
{{extractedDocuments}}

{{languageInstruction}}

Rules:
- Never accuse individuals or property owners
- Use polite, careful wording (e.g. "This image may indicate unauthorized waste disposal. Consider reporting it to the relevant municipal authority.")
- Detect missing information, unknown locations, duplicate report indicators
- Classify: required | optional | unknown | missing | verified

Return JSON:
- serviceName
- complianceScore: 0-100
- items: array of { name, status, note }
- missingDocuments: string array (missing evidence items)
- suspiciousRequests: string array (unusual indicators — use careful language)
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
  description: "Extract text from environmental images — notices, signs, warnings.",
  role: "user" as const,
  template: `Extract all text from this environmental image (garbage notice, municipal sign, warning label, illegal dumping sign, or waste photo with visible text).

Environmental issue context: {{serviceName}}
{{languageInstruction}}

Extract addresses, phone numbers, instructions, warning labels, and any visible text.
Normalize evidence items (e.g. "waste photo" → "Photo of dumped waste").
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
  description: "Generate citizen checklist, safety advice, reporting steps, and environmental tips.",
  role: "user" as const,
  template: `Generate citizen guidance for a Pakistan environmental / waste management issue.

Environmental service knowledge:
{{serviceKnowledge}}

Citizen report intent:
{{intentSummary}}

{{languageInstruction}}

Keep responses concise. Use only evidence items from the official checklist above.

Return JSON:
- checklist: array of { name, status } — citizen evidence checklist, status = required | optional
- preparationTips: max 4 short strings (safety advice, how to report, preparation tips)
- timeline: max 4 steps { step, description, duration } (estimated municipal response timeline)
- faqs: max 3 { question, answer } — one sentence each
- alternatives: max 2 strings (nearest office, disposal center)
- nextSteps: max 4 short strings (how to report, follow-up)
- warnings: max 3 strings (safety and environmental awareness tips, polite tone)`,
  requiredVariables: ["serviceKnowledge", "intentSummary", "languageInstruction"],
  tags: ["civic", "recommendation", "agent"],
};

export const civicReportPrompt = {
  id: "civic.report",
  version: "1.0.0",
  description: "Assemble final environmental incident report with summary, PDF content, QR data.",
  role: "user" as const,
  template: `Assemble a final environmental incident report from pipeline data.

Report type: {{reportType}}
Environmental issue: {{serviceName}}

Intent data: {{intentData}}
Knowledge data: {{knowledgeData}}
Recommendation data: {{recommendationData}}
Compliance data: {{complianceData}}

{{languageInstruction}}

Return JSON with fields: Issue Category, Severity, Location, Responsible Authority, Suggested Action, Estimated Resolution, Environmental Tips, Citizen Checklist.
Also include:
- citizenSummary: 2-3 paragraph summary for citizen
- printableSections: array of { title, content }
- pdfTitle: string (Environmental Incident Report)
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
