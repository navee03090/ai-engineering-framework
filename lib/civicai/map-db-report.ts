import { resolveOfficeLocation } from "@/lib/civicai/office-locations";
import type { CivicReport } from "@/lib/civicai/types";

export type DbCitizenReportRow = {
  id: string;
  summary: string;
  report_json: unknown;
  service_slug: string | null;
  qr_data: string | null;
  created_at: string;
};

export function mapDbReport(row: DbCitizenReportRow): CivicReport {
  const json = row.report_json as {
    knowledge?: {
      serviceName?: string;
      department?: string;
      fee?: string;
      processingTime?: string;
      officeName?: string | null;
      officeAddress?: string | null;
    };
    recommendation?: {
      checklist?: {
        name: string;
        status: CivicReport["requiredDocuments"][0]["status"];
      }[];
      timeline?: CivicReport["timeline"];
      warnings?: string[];
      preparationTips?: string[];
    };
    compliance?: {
      items?: { name: string; status: CivicReport["requiredDocuments"][0]["status"] }[];
      missingDocuments?: string[];
      advisory?: string;
      suspiciousRequests?: string[];
      complianceScore?: number;
    };
    ocr?: {
      rawText?: string;
      overallConfidence?: number;
      documents?: { name: string; normalizedName?: string; confidence?: number }[];
    };
    report?: {
      citizenSummary?: string;
      pdfTitle?: string;
      pdfSections?: { heading: string; body: string }[];
      qrData?: string;
      metadata?: {
        confidence?: number;
        serviceName?: string;
        department?: string;
        fee?: string;
        processingTime?: string;
      };
    };
    intent?: {
      confidence?: number;
      entities?: string[];
      translatedQuery?: string;
    };
  };

  const knowledge = json.knowledge;
  const recommendation = json.recommendation;
  const compliance = json.compliance;
  const ocr = json.ocr;
  const reportAgent = json.report;
  const isVerification = Boolean(ocr || compliance);
  const serviceSlug = row.service_slug ?? "unknown";
  const officeFromDb = resolveOfficeLocation(serviceSlug, {
    entities: json.intent?.entities,
    query: json.intent?.translatedQuery,
  });

  const ocrIntelligence =
    ocr || compliance
      ? {
          rawText: ocr?.rawText,
          overallConfidence: ocr?.overallConfidence,
          documents: ocr?.documents,
          advisory: compliance?.advisory,
          suspiciousRequests: compliance?.suspiciousRequests,
        }
      : undefined;

  return {
    id: row.id,
    serviceId: row.service_slug ?? "unknown",
    serviceName:
      knowledge?.serviceName ??
      reportAgent?.metadata?.serviceName ??
      "Government Service Report",
    department: knowledge?.department ?? reportAgent?.metadata?.department ?? "—",
    createdAt: row.created_at,
    status: "ready",
    confidence:
      json.intent?.confidence ??
      compliance?.complianceScore ??
      reportAgent?.metadata?.confidence ??
      85,
    fee: knowledge?.fee ?? reportAgent?.metadata?.fee ?? "—",
    processingTime:
      knowledge?.processingTime ?? reportAgent?.metadata?.processingTime ?? "—",
    timeline: recommendation?.timeline ?? [],
    requiredDocuments:
      recommendation?.checklist?.map((d) => ({ name: d.name, status: d.status })) ??
      compliance?.items?.map((d) => ({ name: d.name, status: d.status })) ??
      [],
    missingDocuments: compliance?.missingDocuments ?? [],
    warnings: recommendation?.warnings ?? [],
    tips: recommendation?.preparationTips ?? [],
    sources: [{ title: "CivicAI Verified Knowledge", url: "#" }],
    reportType: isVerification ? "verification" : "query",
    summary: row.summary ?? reportAgent?.citizenSummary,
    pdfTitle: reportAgent?.pdfTitle,
    pdfSections: reportAgent?.pdfSections,
    qrData: row.qr_data ?? reportAgent?.qrData,
    ocrIntelligence,
    officeLocation: officeFromDb
      ? {
          ...officeFromDb,
          officeName: knowledge?.officeName ?? officeFromDb.officeName,
          officeAddress: knowledge?.officeAddress ?? officeFromDb.officeAddress,
        }
      : undefined,
  };
}
