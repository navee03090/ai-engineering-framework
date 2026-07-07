import type {
  ComplianceOutput,
  IntentOutput,
  KnowledgeOutput,
  RecommendationOutput,
  ReportOutput,
} from "@/agents/civicai-schemas";
import type { CivicLanguage } from "@/lib/civicai/language";

function buildQrData(
  serviceSlug: string,
  checklistCount: number,
  reportType: "query" | "verification"
): string {
  return JSON.stringify({
    serviceSlug,
    reportType,
    reportDate: new Date().toISOString().slice(0, 10),
    checklistCount,
  });
}

function joinParagraphs(parts: string[]): string {
  return parts.filter((part) => part.trim().length > 0).join("\n\n");
}

function buildQuerySummary(
  intent: IntentOutput,
  knowledge: KnowledgeOutput,
  recommendation: RecommendationOutput,
  language: CivicLanguage
): string {
  const evidenceList = recommendation.checklist.map((item) => item.name).join(", ");
  const nextSteps = recommendation.nextSteps.slice(0, 3).join(" ");

  if (language === "ur") {
    return joinParagraphs([
      `آپ نے ${knowledge.serviceName} کے بارے میں رپورٹ کی۔ یہ مسئلہ ${knowledge.department} کے ذمہ ہے۔`,
      `تخمینی جوابی وقت ${knowledge.processingTime} ہے۔ ضروری ثبوت: ${evidenceList || knowledge.documents.join(", ")}۔`,
      nextSteps
        ? `اگلے اقدامات: ${nextSteps}`
        : `براہ کرم مقام کی تصویر اور تفصیل کے ساتھ متعلقہ اتھارٹی کو رپورٹ کریں۔`,
    ]);
  }

  return joinParagraphs([
    `You reported ${knowledge.serviceName}, handled by ${knowledge.department}. EcoMind AI analyzed your environmental report with ${intent.confidence}% confidence.`,
    `Estimated response time is ${knowledge.processingTime}. Required evidence includes: ${evidenceList || knowledge.documents.join(", ")}.`,
    nextSteps
      ? `Recommended next steps: ${nextSteps}`
      : `Gather photo evidence and location details, then report to the responsible authority.`,
  ]);
}

function buildVerificationSummary(
  knowledge: KnowledgeOutput,
  compliance: ComplianceOutput,
  language: CivicLanguage
): string {
  if (language === "ur") {
    const missing =
      compliance.missingDocuments.length > 0
        ? ` غائب ثبوت: ${compliance.missingDocuments.join(", ")}۔`
        : "";
    return joinParagraphs([
      `${knowledge.serviceName} کے لیے آپ کے اپ لوڈ کردہ ثبوت کی جانچ مکمل ہوئی۔ مطابقت سکور: ${compliance.complianceScore}%۔${missing}`,
      compliance.advisory,
    ]);
  }

  const missing =
    compliance.missingDocuments.length > 0
      ? ` Missing evidence: ${compliance.missingDocuments.join(", ")}.`
      : "";

  return joinParagraphs([
    `EcoMind AI compared your uploaded evidence against the ${knowledge.serviceName} reporting checklist. Compliance score: ${compliance.complianceScore}%.${missing}`,
    compliance.advisory,
  ]);
}

export function buildQueryReport(
  intent: IntentOutput,
  knowledge: KnowledgeOutput,
  recommendation: RecommendationOutput,
  language: CivicLanguage = "en"
): ReportOutput {
  const citizenSummary = buildQuerySummary(intent, knowledge, recommendation, language);
  const checklistBody = recommendation.checklist
    .map((item) => `• ${item.name} (${item.status})`)
    .join("\n");
  const timelineBody = recommendation.timeline
    .map((step, index) => `${index + 1}. ${step.step}: ${step.description}`)
    .join("\n");
  const tipsBody = recommendation.preparationTips.map((tip) => `• ${tip}`).join("\n");
  const warningsBody = [...knowledge.warnings, ...recommendation.warnings]
    .map((warning) => `• ${warning}`)
    .join("\n");

  const pdfSections = [
    {
      heading: language === "ur" ? "مسئلے کا خلاصہ" : "Issue Overview",
      body: `${knowledge.description}\n\n${language === "ur" ? "ذمہ دار اتھارٹی" : "Responsible Authority"}: ${knowledge.department}\n${language === "ur" ? "تخمینی لاگت" : "Estimated Cost"}: ${knowledge.fee}\n${language === "ur" ? "تخمینی جواب" : "Estimated Resolution"}: ${knowledge.processingTime}`,
    },
    checklistBody
      ? {
          heading: language === "ur" ? "شہری چیک لسٹ" : "Citizen Checklist",
          body: checklistBody,
        }
      : null,
    timelineBody
      ? {
          heading: language === "ur" ? "تجویز کردہ اقدامات" : "Suggested Action",
          body: timelineBody,
        }
      : null,
    tipsBody
      ? {
          heading: language === "ur" ? "ماحولیاتی مشورے" : "Environmental Tips",
          body: tipsBody,
        }
      : null,
    warningsBody
      ? {
          heading: language === "ur" ? "حفاظتی انتباہات" : "Safety Warnings",
          body: warningsBody,
        }
      : null,
  ].filter((section): section is { heading: string; body: string } => section !== null);

  const printableSections = pdfSections.map((section) => ({
    title: section.heading,
    content: section.body,
  }));

  return {
    citizenSummary,
    printableSections,
    pdfTitle: `${knowledge.serviceName} — ${language === "ur" ? "ماحولیاتی واقعے کی رپورٹ" : "Environmental Incident Report"}`,
    pdfSections,
    qrData: buildQrData(knowledge.serviceSlug, recommendation.checklist.length, "query"),
    metadata: {
      serviceName: knowledge.serviceName,
      department: knowledge.department,
      fee: knowledge.fee,
      processingTime: knowledge.processingTime,
      confidence: intent.confidence,
    },
  };
}

export function buildVerificationReport(
  knowledge: KnowledgeOutput,
  compliance: ComplianceOutput,
  language: CivicLanguage = "en"
): ReportOutput {
  const citizenSummary = buildVerificationSummary(knowledge, compliance, language);
  const itemsBody = compliance.items
    .map((item) => `• ${item.name}: ${item.status}${item.note ? ` — ${item.note}` : ""}`)
    .join("\n");

  const pdfSections = [
    {
      heading: language === "ur" ? "ثبوت کی تصدیق" : "Evidence Verification",
      body: citizenSummary,
    },
    itemsBody
      ? {
          heading: language === "ur" ? "ثبوت کی حیثیت" : "Evidence Status",
          body: itemsBody,
        }
      : null,
    compliance.suspiciousRequests.length > 0
      ? {
          heading: language === "ur" ? "اضافی مشاہدات" : "Additional Observations",
          body: compliance.suspiciousRequests.map((item) => `• ${item}`).join("\n"),
        }
      : null,
  ].filter((section): section is { heading: string; body: string } => section !== null);

  return {
    citizenSummary,
    printableSections: pdfSections.map((section) => ({
      title: section.heading,
      content: section.body,
    })),
    pdfTitle: `${knowledge.serviceName} — ${language === "ur" ? "ثبوت تصدیق رپورٹ" : "Evidence Verification Report"}`,
    pdfSections,
    qrData: buildQrData(knowledge.serviceSlug, compliance.items.length, "verification"),
    metadata: {
      serviceName: knowledge.serviceName,
      department: knowledge.department,
      fee: knowledge.fee,
      processingTime: knowledge.processingTime,
      confidence: compliance.complianceScore,
    },
  };
}
