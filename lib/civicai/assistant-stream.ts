import type { CivicLanguage } from "@/lib/civicai/language";
import type { AssistantApiResponse, DocumentStatus } from "@/lib/civicai/types";

export const QUERY_PIPELINE_AGENTS = [
  {
    id: "intent",
    labelEn: "Understanding your request",
    labelUr: "آپ کے سوال کو سمجھنا",
    descriptionEn: "Detects which government service you need",
    descriptionUr: "یہ طے کرتا ہے کہ آپ کو کون سی سرکاری سروس چاہیے",
  },
  {
    id: "knowledge",
    labelEn: "Fetching official data",
    labelUr: "سرکاری ڈیٹا حاصل کرنا",
    descriptionEn: "Loads verified fees, documents, and timelines from database",
    descriptionUr: "ڈیٹابیس سے تصدیق شدہ فیس، دستاویزات اور وقت",
  },
  {
    id: "recommendation",
    labelEn: "Building guidance",
    labelUr: "رہنمائی تیار کرنا",
    descriptionEn: "Creates checklist, steps, and scam warnings",
    descriptionUr: "چیک لسٹ، اقدامات اور اسکیم انتباہات بناتا ہے",
  },
  {
    id: "report",
    labelEn: "Generating report",
    labelUr: "رپورٹ بنانا",
    descriptionEn: "Compiles your citizen-ready report (instant, no extra AI call)",
    descriptionUr: "آپ کی مکمل شہری رپورٹ تیار کرتا ہے (فوری، اضافی AI نہیں)",
  },
] as const;

export type QueryPipelineAgentId = (typeof QUERY_PIPELINE_AGENTS)[number]["id"];

export type AgentStepStatus = "pending" | "running" | "done" | "error";

export type AgentStepState = {
  id: QueryPipelineAgentId;
  status: AgentStepStatus;
  summary?: string;
};

export type AssistantPartialIntent = {
  stage: "intent";
  intent: string;
  serviceName: string;
  confidence: number;
  entities: string[];
};

export type AssistantPartialKnowledge = {
  stage: "knowledge";
  serviceName: string;
  department: string;
  fee: string;
  processingTime: string;
  description: string;
};

export type AssistantPartialRecommendation = {
  stage: "recommendation";
  checklist: { name: string; status: DocumentStatus }[];
  warnings: string[];
  nextSteps: string[];
  preparationTips: string[];
};

export type AssistantPartialPayload =
  | AssistantPartialIntent
  | AssistantPartialKnowledge
  | AssistantPartialRecommendation;

export type AssistantStreamEvent =
  | {
      type: "agent_start";
      agent: QueryPipelineAgentId;
      step: number;
      total: number;
    }
  | {
      type: "agent_complete";
      agent: QueryPipelineAgentId;
      success: boolean;
      summary?: string;
      durationMs?: number;
    }
  | {
      type: "partial";
      data: AssistantPartialPayload;
    }
  | {
      type: "answer_chunk";
      text: string;
    }
  | {
      type: "complete";
      result: AssistantApiResponse;
    }
  | {
      type: "error";
      message: string;
      code?: string;
    };

export type AssistantStreamEmitter = (event: AssistantStreamEvent) => void;

export function getAgentLabel(
  agentId: QueryPipelineAgentId,
  language: CivicLanguage
): string {
  const agent = QUERY_PIPELINE_AGENTS.find((a) => a.id === agentId);
  if (!agent) return agentId;
  return language === "ur" ? agent.labelUr : agent.labelEn;
}

export function getAgentDescription(
  agentId: QueryPipelineAgentId,
  language: CivicLanguage
): string {
  const agent = QUERY_PIPELINE_AGENTS.find((a) => a.id === agentId);
  if (!agent) return "";
  return language === "ur" ? agent.descriptionUr : agent.descriptionEn;
}

export function createInitialAgentSteps(): AgentStepState[] {
  return QUERY_PIPELINE_AGENTS.map((agent) => ({
    id: agent.id,
    status: "pending" as const,
  }));
}
