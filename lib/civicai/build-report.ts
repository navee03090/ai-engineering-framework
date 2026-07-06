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
  const docList = recommendation.checklist.map((item) => item.name).join(", ");
  const nextSteps = recommendation.nextSteps.slice(0, 3).join(" ");

  if (language === "ur") {
    return joinParagraphs([
      `آپ نے ${knowledge.serviceName} کے بارے میں پوچھا۔ یہ سروس ${knowledge.department} کے تحت آتی ہے۔`,
      `سرکاری فیس ${knowledge.fee} ہے اور عام طور پر ${knowledge.processingTime} میں مکمل ہوتی ہے۔ ضروری دستاویزات: ${docList || knowledge.documents.join(", ")}۔`,
      nextSteps
        ? `اگلے اقدامات: ${nextSteps}`
        : `براہ کرم تمام دستاویزات ساتھ لے کر متعلقہ دفتر جائیں۔`,
    ]);
  }

  return joinParagraphs([
    `You asked about ${knowledge.serviceName}, handled by ${knowledge.department}. CivicAI matched your request with ${intent.confidence}% confidence.`,
    `The official fee is ${knowledge.fee} and typical processing time is ${knowledge.processingTime}. Required documents include: ${docList || knowledge.documents.join(", ")}.`,
    nextSteps
      ? `Recommended next steps: ${nextSteps}`
      : `Gather the listed documents and visit the relevant office during working hours.`,
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
        ? ` غائب دستاویزات: ${compliance.missingDocuments.join(", ")}۔`
        : "";
    return joinParagraphs([
      `${knowledge.serviceName} کے لیے آپ کی آفیسر نوٹ کی جانچ مکمل ہوئی۔ مطابقت سکور: ${compliance.complianceScore}%۔${missing}`,
      compliance.advisory,
    ]);
  }

  const missing =
    compliance.missingDocuments.length > 0
      ? ` Missing items: ${compliance.missingDocuments.join(", ")}.`
      : "";

  return joinParagraphs([
    `CivicAI compared your officer note against the official ${knowledge.serviceName} checklist. Compliance score: ${compliance.complianceScore}%.${missing}`,
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
      heading: language === "ur" ? "سروس خلاصہ" : "Service Overview",
      body: `${knowledge.description}\n\n${language === "ur" ? "محکمہ" : "Department"}: ${knowledge.department}\n${language === "ur" ? "فیس" : "Fee"}: ${knowledge.fee}\n${language === "ur" ? "وقت" : "Processing"}: ${knowledge.processingTime}`,
    },
    checklistBody
      ? {
          heading: language === "ur" ? "دستاویزات" : "Document Checklist",
          body: checklistBody,
        }
      : null,
    timelineBody
      ? {
          heading: language === "ur" ? "عمل کا وقت" : "Timeline",
          body: timelineBody,
        }
      : null,
    tipsBody
      ? {
          heading: language === "ur" ? "تیاری کے مشورے" : "Preparation Tips",
          body: tipsBody,
        }
      : null,
    warningsBody
      ? {
          heading: language === "ur" ? "انتباہات" : "Warnings",
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
    pdfTitle: `${knowledge.serviceName} — ${language === "ur" ? "شہری رہنمائی رپورٹ" : "Citizen Guidance Report"}`,
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
      heading: language === "ur" ? "تصدیق کا نتیجہ" : "Verification Result",
      body: citizenSummary,
    },
    itemsBody
      ? {
          heading: language === "ur" ? "دستاویزات کی حیثیت" : "Document Status",
          body: itemsBody,
        }
      : null,
    compliance.suspiciousRequests.length > 0
      ? {
          heading: language === "ur" ? "غیر سرکاری درخواستیں" : "Unlisted Requests",
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
    pdfTitle: `${knowledge.serviceName} — ${language === "ur" ? "دستاویز تصدیق رپورٹ" : "Document Verification Report"}`,
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
