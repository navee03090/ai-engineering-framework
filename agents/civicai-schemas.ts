import { z } from "zod";

/** Gemini sometimes returns entity objects; coerce to plain strings for validation. */
function coerceToString(value: unknown): string {
  if (typeof value === "string") return value;
  if (value === null || value === undefined) return "";
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (typeof value === "object") {
    const obj = value as Record<string, unknown>;
    for (const key of ["name", "value", "text", "entity", "label"]) {
      const candidate = obj[key];
      if (typeof candidate === "string" && candidate.trim()) return candidate.trim();
    }
    const stringValues = Object.values(obj).filter(
      (v) => typeof v === "string"
    ) as string[];
    if (stringValues.length) return stringValues.join(" ").trim();
    return JSON.stringify(value);
  }
  return String(value);
}

export const documentStatusSchema = z.enum([
  "required",
  "optional",
  "unknown",
  "missing",
  "verified",
]);

export const intentOutputSchema = z.object({
  detectedLanguage: z.enum(["en", "ur"]),
  translatedQuery: z.string(),
  intent: z.string(),
  serviceSlug: z.string(),
  serviceName: z.string(),
  entities: z.preprocess(
    (val) =>
      Array.isArray(val)
        ? val.map(coerceToString).filter((item) => item.length > 0)
        : [],
    z.array(z.string())
  ),
  confidence: z.number().min(0).max(100),
  needsClarification: z.boolean(),
  clarificationQuestion: z.string(),
});

export const knowledgeOutputSchema = z.object({
  serviceSlug: z.string(),
  serviceName: z.string(),
  category: z.string(),
  department: z.string(),
  officeName: z.string().nullable(),
  officeAddress: z.string().nullable(),
  fee: z.string(),
  processingTime: z.string(),
  documents: z.array(z.string()),
  warnings: z.array(z.string()),
  instructions: z.array(z.string()),
  description: z.string(),
});

export const ocrOutputSchema = z.object({
  rawText: z.string(),
  documents: z.array(
    z.object({
      name: z.string(),
      normalizedName: z.string(),
      confidence: z.number().min(0).max(100),
    })
  ),
  overallConfidence: z.number().min(0).max(100),
});

export const complianceOutputSchema = z.object({
  serviceName: z.string(),
  complianceScore: z.number().min(0).max(100),
  items: z.array(
    z.object({
      name: z.string(),
      status: documentStatusSchema,
      note: z.string(),
    })
  ),
  missingDocuments: z.array(z.string()),
  suspiciousRequests: z.array(z.string()),
  advisory: z.string(),
});

export const recommendationOutputSchema = z.object({
  checklist: z.array(
    z.object({
      name: z.string(),
      status: documentStatusSchema,
    })
  ),
  preparationTips: z.array(z.string()),
  timeline: z.array(
    z.object({
      step: z.string(),
      description: z.string(),
      duration: z.string().nullish().transform((v) => v ?? undefined),
    })
  ),
  faqs: z.array(z.object({ question: z.string(), answer: z.string() })),
  alternatives: z.array(z.string()),
  nextSteps: z.array(z.string()),
  warnings: z.array(z.string()),
});

export const reportOutputSchema = z.object({
  citizenSummary: z.string(),
  printableSections: z.array(z.object({ title: z.string(), content: z.string() })),
  pdfTitle: z.string(),
  pdfSections: z.array(z.object({ heading: z.string(), body: z.string() })),
  qrData: z.string(),
  metadata: z.object({
    serviceName: z.string(),
    department: z.string(),
    fee: z.string(),
    processingTime: z.string(),
    confidence: z.number(),
  }),
});

export type IntentOutput = z.infer<typeof intentOutputSchema>;
export type KnowledgeOutput = z.infer<typeof knowledgeOutputSchema>;
export type OcrOutput = z.infer<typeof ocrOutputSchema>;
export type ComplianceOutput = z.infer<typeof complianceOutputSchema>;
export type RecommendationOutput = z.infer<typeof recommendationOutputSchema>;
export type ReportOutput = z.infer<typeof reportOutputSchema>;

export const INTENT_CONFIDENCE_THRESHOLD = 60;
export const OCR_CONFIDENCE_THRESHOLD = 70;
