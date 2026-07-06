import { orchestrator } from "@/agents/orchestrator";
import {
  INTENT_CONFIDENCE_THRESHOLD,
  OCR_CONFIDENCE_THRESHOLD,
  type ComplianceOutput,
  type IntentOutput,
  type KnowledgeOutput,
  type OcrOutput,
  type RecommendationOutput,
  type ReportOutput,
} from "@/agents/civicai-schemas";
import type { AgentResult } from "@/agents/types";
import { AppError } from "@/lib/api/errors";
import { CIVICAI_FULL_TITLE } from "@/lib/civicai/brand";
import type {
  AssistantStreamEmitter,
  QueryPipelineAgentId,
} from "@/lib/civicai/assistant-stream";
import { QUERY_PIPELINE_AGENTS } from "@/lib/civicai/assistant-stream";
import type { CivicLanguage } from "@/lib/civicai/language";
import { buildQueryReport, buildVerificationReport } from "@/lib/civicai/build-report";
import {
  formatIntentForRecommendation,
  formatKnowledgeForRecommendation,
} from "@/lib/civicai/pipeline-context";
import { resolveOfficeLocation } from "@/lib/civicai/office-locations";
import type { DocumentStatus } from "@/lib/civicai/types";
import type { Json } from "@/types/database";
import { civicaiPersistence } from "@/services/civicai-persistence.service";
import { civicaiReportEmailService } from "@/services/civicai-report-email.service";
import { governmentKnowledgeService } from "@/services/government-knowledge.service";

function assertGeminiConfigured(): void {
  if (!process.env.GEMINI_API_KEY) {
    throw new AppError("GEMINI_API_KEY is not configured.", 503, "AI_UNAVAILABLE");
  }
}

const CIVIC_CONTEXT = {
  projectName: CIVICAI_FULL_TITLE,
};

async function logRun(
  userId: string,
  parentType: "request" | "verification",
  parentId: string,
  agentName: string,
  result: AgentResult<unknown>
) {
  try {
    await civicaiPersistence.logAgentRun({
      userId,
      parentType,
      parentId,
      agentName,
      agentResult: result,
    });
  } catch {
    // Non-blocking audit logging
  }
}

function mapToAssistantResponse(
  intent: IntentOutput,
  knowledge: KnowledgeOutput,
  recommendation: RecommendationOutput,
  report: ReportOutput,
  reportId?: string
) {
  const office = resolveOfficeLocation(knowledge.serviceSlug, {
    entities: intent.entities,
    query: intent.translatedQuery || intent.intent,
  });

  return {
    serviceName: knowledge.serviceName,
    serviceId: knowledge.serviceSlug,
    department: knowledge.department,
    fee: knowledge.fee,
    processingTime: knowledge.processingTime,
    answer: report.citizenSummary,
    confidence: intent.confidence,
    checklist: recommendation.checklist.map((item) => ({
      name: item.name,
      status: item.status as DocumentStatus,
    })),
    warnings: [...knowledge.warnings, ...recommendation.warnings],
    sources: [
      { title: `${knowledge.department} Guidelines`, url: "#" },
      { title: "Official Fee Schedule", url: "#" },
    ],
    timeline: recommendation.timeline,
    preparationTips: recommendation.preparationTips,
    nextSteps: recommendation.nextSteps,
    faqs: recommendation.faqs,
    reportId,
    report,
    officeLocation: office
      ? {
          ...office,
          officeName: knowledge.officeName ?? office.officeName,
          officeAddress: knowledge.officeAddress ?? office.officeAddress,
        }
      : undefined,
  };
}

function emitAgentStart(emit: AssistantStreamEmitter | undefined, agent: QueryPipelineAgentId) {
  if (!emit) return;
  const step = QUERY_PIPELINE_AGENTS.findIndex((a) => a.id === agent) + 1;
  emit({
    type: "agent_start",
    agent,
    step,
    total: QUERY_PIPELINE_AGENTS.length,
  });
}

function emitAgentComplete(
  emit: AssistantStreamEmitter | undefined,
  agent: QueryPipelineAgentId,
  success: boolean,
  summary?: string,
  durationMs?: number
) {
  if (!emit) return;
  emit({ type: "agent_complete", agent, success, summary, durationMs });
}

async function runAskAssistantPipeline(
  userId: string,
  query: string,
  language: CivicLanguage,
  emit?: AssistantStreamEmitter
) {
  assertGeminiConfigured();

  const request = await civicaiPersistence.createRequest(userId, query, language);

  emitAgentStart(emit, "intent");
  const intentStarted = Date.now();
  const intentResult = await orchestrator.run<IntentOutput>(
    "intent",
    { query, language },
    CIVIC_CONTEXT
  );
  await logRun(userId, "request", request.id, "intent", intentResult);

  if (!intentResult.success || !intentResult.data) {
    emitAgentComplete(emit, "intent", false, intentResult.error, Date.now() - intentStarted);
    await civicaiPersistence.updateRequest(request.id, { status: "failed" });
    throw new AppError(
      intentResult.error ?? "Intent detection failed",
      422,
      "CIVICAI_INTENT_FAILED"
    );
  }

  const intent = intentResult.data;

  if (
    intent.needsClarification ||
    intent.confidence < INTENT_CONFIDENCE_THRESHOLD ||
    intent.serviceSlug === "unknown"
  ) {
    emitAgentComplete(
      emit,
      "intent",
      false,
      intent.clarificationQuestion || "Needs clarification",
      Date.now() - intentStarted
    );
    await civicaiPersistence.updateRequest(request.id, {
      status: "clarify",
      detected_intent: intent.intent,
      confidence: intent.confidence,
      pipeline_result: intent as never,
    });
    throw new AppError(
      intent.clarificationQuestion ||
        "Could you clarify which government service you need help with?",
      422,
      "CIVICAI_NEEDS_CLARIFICATION",
      { intent }
    );
  }

  emitAgentComplete(
    emit,
    "intent",
    true,
    `${intent.serviceName} · ${intent.confidence}%`,
    Date.now() - intentStarted
  );
  emit?.({
    type: "partial",
    data: {
      stage: "intent",
      intent: intent.intent,
      serviceName: intent.serviceName,
      confidence: intent.confidence,
      entities: intent.entities,
    },
  });

  emitAgentStart(emit, "knowledge");
  const knowledgeStarted = Date.now();
  const knowledgeResult = await orchestrator.run<KnowledgeOutput>(
    "knowledge",
    { serviceSlug: intent.serviceSlug },
    CIVIC_CONTEXT
  );
  await logRun(userId, "request", request.id, "knowledge", knowledgeResult);

  if (!knowledgeResult.success || !knowledgeResult.data) {
    emitAgentComplete(emit, "knowledge", false, knowledgeResult.error, Date.now() - knowledgeStarted);
    await civicaiPersistence.updateRequest(request.id, { status: "failed" });
    throw new AppError(
      knowledgeResult.error ?? "Knowledge retrieval failed",
      422,
      "CIVICAI_KNOWLEDGE_FAILED"
    );
  }

  const knowledge = knowledgeResult.data;
  emitAgentComplete(
    emit,
    "knowledge",
    true,
    `${knowledge.department} · ${knowledge.fee}`,
    Date.now() - knowledgeStarted
  );
  emit?.({
    type: "partial",
    data: {
      stage: "knowledge",
      serviceName: knowledge.serviceName,
      department: knowledge.department,
      fee: knowledge.fee,
      processingTime: knowledge.processingTime,
      description: knowledge.description,
    },
  });

  emitAgentStart(emit, "recommendation");
  const recommendationStarted = Date.now();
  const recommendationResult = await orchestrator.run<RecommendationOutput>(
    "recommendation",
    {
      serviceKnowledge: formatKnowledgeForRecommendation(knowledge),
      intentSummary: formatIntentForRecommendation(intent),
      language,
    },
    CIVIC_CONTEXT
  );
  await logRun(userId, "request", request.id, "recommendation", recommendationResult);

  if (!recommendationResult.success || !recommendationResult.data) {
    emitAgentComplete(
      emit,
      "recommendation",
      false,
      recommendationResult.error,
      Date.now() - recommendationStarted
    );
    await civicaiPersistence.updateRequest(request.id, { status: "failed" });
    throw new AppError(
      recommendationResult.error ?? "Recommendation failed",
      422,
      "CIVICAI_RECOMMENDATION_FAILED"
    );
  }

  const recommendation = recommendationResult.data;
  const checklist = recommendation.checklist.map((item) => ({
    name: item.name,
    status: item.status as DocumentStatus,
  }));
  emitAgentComplete(
    emit,
    "recommendation",
    true,
    `${checklist.length} documents · ${recommendation.warnings.length} warnings`,
    Date.now() - recommendationStarted
  );
  emit?.({
    type: "partial",
    data: {
      stage: "recommendation",
      checklist,
      warnings: [...knowledge.warnings, ...recommendation.warnings],
      nextSteps: recommendation.nextSteps,
      preparationTips: recommendation.preparationTips,
    },
  });

  emitAgentStart(emit, "report");
  const reportStarted = Date.now();
  const report = buildQueryReport(intent, knowledge, recommendation, language);
  await logRun(userId, "request", request.id, "report", {
    success: true,
    data: report,
    metadata: { agent: "report", source: "deterministic" },
  });
  emitAgentComplete(emit, "report", true, "Report ready", Date.now() - reportStarted);

  const pipelineResult = { intent, knowledge, recommendation, report };

  const savedReport = await civicaiPersistence.createReport({
    userId,
    requestId: request.id,
    serviceSlug: knowledge.serviceSlug,
    summary: report.citizenSummary,
    reportJson: pipelineResult,
    qrData: report.qrData,
  });

  void civicaiReportEmailService.sendReportReadyEmail(userId, savedReport);

  await civicaiPersistence.updateRequest(request.id, {
    detected_intent: intent.intent,
    service_slug: intent.serviceSlug,
    confidence: intent.confidence,
    status: "completed",
    pipeline_result: pipelineResult as Json,
  });

  const response = mapToAssistantResponse(
    intent,
    knowledge,
    recommendation,
    report,
    savedReport.id
  );

  emit?.({ type: "complete", result: response });
  return response;
}

export const civicaiService = {
  async askAssistant(userId: string, query: string, language: CivicLanguage = "en") {
    return runAskAssistantPipeline(userId, query, language);
  },

  async askAssistantWithEvents(
    userId: string,
    query: string,
    language: CivicLanguage,
    emit: AssistantStreamEmitter
  ) {
    return runAskAssistantPipeline(userId, query, language, emit);
  },

  async verifyDocument(
    userId: string,
    file: File,
    options: { serviceId?: string; language?: CivicLanguage }
  ) {
    assertGeminiConfigured();

    const language = options.language ?? "en";
    const serviceSlug = options.serviceId ?? "driving-license";

    const verification = await civicaiPersistence.createVerification(
      userId,
      serviceSlug,
      file.name,
      file.type
    );

    const storagePath = await civicaiPersistence.uploadDocument(userId, file);

    const knowledge = await governmentKnowledgeService.getBySlug(serviceSlug);

    const buffer = Buffer.from(await file.arrayBuffer());
    const imageBase64 = buffer.toString("base64");

    const ocrResult = await orchestrator.run<OcrOutput>(
      "ocr",
      {
        imageBase64,
        mimeType: file.type,
        serviceName: knowledge.serviceName,
        language,
      },
      CIVIC_CONTEXT
    );
    await logRun(userId, "verification", verification.id, "ocr", ocrResult);

    if (!ocrResult.success || !ocrResult.data) {
      await civicaiPersistence.updateVerification(verification.id, {
        status: "failed",
      });
      throw new AppError(ocrResult.error ?? "OCR failed", 422, "CIVICAI_OCR_FAILED");
    }

    const ocr = ocrResult.data;

    if (ocr.overallConfidence < OCR_CONFIDENCE_THRESHOLD) {
      await civicaiPersistence.updateVerification(verification.id, {
        status: "failed",
        ocr_result: ocr as Json,
      });
      throw new AppError(
        "Image quality is too low. Please upload a clearer photo of the officer note.",
        422,
        "CIVICAI_OCR_LOW_CONFIDENCE",
        { ocr }
      );
    }

    const complianceResult = await orchestrator.run<ComplianceOutput>(
      "compliance",
      {
        serviceName: knowledge.serviceName,
        officialDocuments: knowledge.documents,
        extractedDocuments: ocr.documents,
        language,
      },
      CIVIC_CONTEXT
    );
    await logRun(
      userId,
      "verification",
      verification.id,
      "compliance",
      complianceResult
    );

    if (!complianceResult.success || !complianceResult.data) {
      await civicaiPersistence.updateVerification(verification.id, {
        status: "failed",
      });
      throw new AppError(
        complianceResult.error ?? "Compliance check failed",
        422,
        "CIVICAI_COMPLIANCE_FAILED"
      );
    }

    const compliance = complianceResult.data;

    const report = buildVerificationReport(knowledge, compliance, language);
    await logRun(userId, "verification", verification.id, "report", {
      success: true,
      data: report,
      metadata: { agent: "report", source: "deterministic" },
    });

    const savedReport = await civicaiPersistence.createReport({
      userId,
      verificationId: verification.id,
      serviceSlug,
      summary: report.citizenSummary,
      reportJson: { ocr, compliance, report, knowledge },
      qrData: report.qrData,
    });

    void civicaiReportEmailService.sendReportReadyEmail(userId, savedReport);

    await civicaiPersistence.updateVerification(verification.id, {
      storage_path: storagePath,
      ocr_result: ocr as Json,
      compliance_result: compliance as Json,
      confidence: compliance.complianceScore,
      status: "completed",
    });

    return {
      serviceName: knowledge.serviceName,
      confidence: compliance.complianceScore,
      extractedDocuments: compliance.items.map((item) => ({
        name: item.name,
        status: item.status as DocumentStatus,
      })),
      advisory: compliance.advisory,
      missingDocuments: compliance.missingDocuments,
      suspiciousRequests: compliance.suspiciousRequests,
      ocrRawText: ocr.rawText,
      ocrConfidence: ocr.overallConfidence,
      ocrDocuments: ocr.documents.map((doc) => ({
        name: doc.name,
        normalizedName: doc.normalizedName,
        confidence: doc.confidence,
      })),
      reportId: savedReport.id,
      report,
      verificationId: verification.id,
    };
  },

  async getHistory(userId: string) {
    return civicaiPersistence.listRequests(userId);
  },

  async getReport(userId: string, reportId: string) {
    return civicaiPersistence.getReport(userId, reportId);
  },

  async getStats(userId: string) {
    return civicaiPersistence.getStats(userId);
  },

  async listServices() {
    return governmentKnowledgeService.list();
  },

  async saveLanguagePreference(userId: string, language: CivicLanguage) {
    await civicaiPersistence.updateProfileLanguage(userId, language);
  },
};
