import type { CivicLanguage } from "@/lib/civicai/language";
import type { AssistantApiResponse, DocumentStatus } from "@/lib/civicai/types";

export const QUERY_PIPELINE_AGENTS = [
  {
    id: "intent",
    labelEn: "Classifying environmental issue",
    labelUr: "ماحولیاتی مسئلے کی درجہ بندی",
    descriptionEn: "Detects waste type, pollution category, or environmental concern",
    descriptionUr: "کچرے کی قسم، آلودگی یا ماحولیاتی مسئلے کی شناخت",
  },
  {
    id: "knowledge",
    labelEn: "Fetching authority data",
    labelUr: "اتھارٹی کا ڈیٹا حاصل کرنا",
    descriptionEn: "Loads responsible authority, procedures, and response times",
    descriptionUr: "ذمہ دار اتھارٹی، طریقہ کار اور جوابی وقت",
  },
  {
    id: "recommendation",
    labelEn: "Building cleanup guidance",
    labelUr: "صفائی کی رہنمائی تیار کرنا",
    descriptionEn: "Creates citizen checklist, safety tips, and reporting steps",
    descriptionUr: "شہری چیک لسٹ، حفاظتی مشورے اور رپورٹنگ کے اقدامات",
  },
  {
    id: "report",
    labelEn: "Generating incident report",
    labelUr: "واقعے کی رپورٹ بنانا",
    descriptionEn: "Compiles your environmental incident report (instant, no extra AI call)",
    descriptionUr: "آپ کی ماحولیاتی واقعے کی رپورٹ تیار کرتا ہے (فوری)",
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
