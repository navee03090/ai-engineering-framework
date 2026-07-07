"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Clock, Coins, ListChecks } from "lucide-react";

import type { AssistantPartialPayload } from "@/lib/civicai/assistant-stream";
import { StatusChip } from "@/components/civicai/shared";
import type { CivicLanguage } from "@/lib/civicai/language";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ProgressiveSolutionProps = {
  partial: AssistantPartialPayload | null;
  language: CivicLanguage;
};

export function ProgressiveSolution({ partial, language }: ProgressiveSolutionProps) {
  if (!partial) return null;

  if (partial.stage === "intent") {
    return (
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">
              {language === "ur" ? "مسئلے کی شناخت" : "Issue Detected"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p className="font-medium">{partial.serviceName}</p>
            <p className="text-muted-foreground">{partial.intent}</p>
            <Badge variant="secondary">{partial.confidence}% confidence</Badge>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (partial.stage === "knowledge") {
    return (
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">
              {language === "ur" ? "سرکاری تفصیلات" : "Official Details"}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <p className="text-xs text-muted-foreground">
                {language === "ur" ? "محکمہ" : "Department"}
              </p>
              <p className="font-medium">{partial.department}</p>
            </div>
            <div className="flex items-start gap-2">
              <Coins className="mt-0.5 size-4 shrink-0 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">
                  {language === "ur" ? "سرکاری فیس" : "Official Fee"}
                </p>
                <p className="font-medium">{partial.fee}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Clock className="mt-0.5 size-4 shrink-0 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">
                  {language === "ur" ? "پروسیسنگ وقت" : "Processing Time"}
                </p>
                <p className="font-medium">{partial.processingTime}</p>
              </div>
            </div>
            <div className="sm:col-span-2">
              <p className="text-xs text-muted-foreground">
                {language === "ur" ? "خلاصہ" : "Summary"}
              </p>
              <p>{partial.description}</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3"
    >
      <Card className="border-primary/20">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm">
            <ListChecks className="size-4 text-primary" />
            {language === "ur" ? "شہری چیک لسٹ" : "Citizen Checklist"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {partial.checklist.map((doc) => (
            <div key={doc.name} className="flex items-center justify-between gap-2 text-sm">
              <span className="truncate">{doc.name}</span>
              <StatusChip status={doc.status} />
            </div>
          ))}
        </CardContent>
      </Card>

      {partial.warnings.length > 0 && (
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm text-amber-700 dark:text-amber-400">
              <AlertTriangle className="size-4" />
              {language === "ur" ? "انتباہات" : "Scam Warnings"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {partial.warnings.map((warning) => (
              <p key={warning} className="text-muted-foreground">
                • {warning}
              </p>
            ))}
          </CardContent>
        </Card>
      )}

      {partial.nextSteps.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">
              {language === "ur" ? "اگلے اقدامات" : "Next Steps"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm text-muted-foreground">
            {partial.nextSteps.slice(0, 4).map((step) => (
              <p key={step}>• {step}</p>
            ))}
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}

const STAGE_ORDER = { intent: 0, knowledge: 1, recommendation: 2 } as const;

type ProgressiveSolutionStackProps = {
  partials: AssistantPartialPayload[];
  language: CivicLanguage;
};

export function ProgressiveSolutionStack({
  partials,
  language,
}: ProgressiveSolutionStackProps) {
  const sorted = [...partials].sort(
    (a, b) => STAGE_ORDER[a.stage] - STAGE_ORDER[b.stage]
  );

  return (
    <div className="space-y-3">
      {sorted.map((partial) => (
        <ProgressiveSolution key={partial.stage} partial={partial} language={language} />
      ))}
    </div>
  );
}
