"use client";

import { motion } from "framer-motion";
import {
  Brain,
  CheckCircle2,
  Circle,
  Database,
  FileText,
  Loader2,
  Sparkles,
  XCircle,
} from "lucide-react";

import {
  getAgentDescription,
  getAgentLabel,
  QUERY_PIPELINE_AGENTS,
  type AgentStepState,
} from "@/lib/civicai/assistant-stream";
import type { CivicLanguage } from "@/lib/civicai/language";
import { cn } from "@/lib/utils";

const AGENT_ICONS = {
  intent: Brain,
  knowledge: Database,
  recommendation: Sparkles,
  report: FileText,
} as const;

type AgentPipelinePanelProps = {
  steps: AgentStepState[];
  language: CivicLanguage;
};

export function AgentPipelinePanel({ steps, language }: AgentPipelinePanelProps) {
  return (
    <div className="rounded-xl border border-primary/20 bg-primary/5 p-3">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-primary">
        {language === "ur" ? "AI ایجنٹ پائپ لائن" : "AI Agent Pipeline"}
      </p>
      <div className="flex gap-2 overflow-x-auto pb-0.5 lg:grid lg:grid-cols-4 lg:overflow-visible">
        {QUERY_PIPELINE_AGENTS.map((agent, index) => {
          const step = steps.find((s) => s.id === agent.id);
          const status = step?.status ?? "pending";
          const Icon = AGENT_ICONS[agent.id];

          return (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              className={cn(
                "flex min-h-[84px] w-[min(100%,160px)] shrink-0 flex-col gap-2 rounded-lg border px-3 py-2.5 transition-colors lg:min-w-0 lg:w-auto",
                status === "running" && "border-primary/50 bg-background shadow-sm ring-1 ring-primary/20",
                status === "done" && "border-emerald-500/35 bg-background/90",
                status === "error" && "border-destructive/35 bg-background/90",
                status === "pending" && "border-border/50 bg-background/50"
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-md",
                    status === "running" && "bg-primary/15 text-primary",
                    status === "done" && "bg-emerald-500/15 text-emerald-600",
                    status === "error" && "bg-destructive/15 text-destructive",
                    status === "pending" && "bg-muted text-muted-foreground"
                  )}
                >
                  {status === "running" ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : status === "done" ? (
                    <CheckCircle2 className="size-3.5" />
                  ) : status === "error" ? (
                    <XCircle className="size-3.5" />
                  ) : (
                    <Icon className="size-3.5" />
                  )}
                </div>
                {status === "running" ? (
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                    {language === "ur" ? "چل رہا" : "Running"}
                  </span>
                ) : status === "pending" ? (
                  <Circle className="size-3.5 shrink-0 text-muted-foreground/35" />
                ) : null}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold leading-snug">
                  {getAgentLabel(agent.id, language)}
                </p>
                <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-muted-foreground">
                  {getAgentDescription(agent.id, language)}
                </p>
                {step?.summary ? (
                  <p className="mt-1 line-clamp-2 text-[11px] font-medium text-foreground/85">
                    {step.summary}
                  </p>
                ) : null}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
