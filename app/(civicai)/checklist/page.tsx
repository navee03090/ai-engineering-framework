"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";

import { useCivicLanguage } from "@/components/providers/civic-language-provider";
import { StatusChip } from "@/components/civicai/shared";
import { PageHeader } from "@/components/civicai/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getLastAssistantResponse } from "@/lib/civicai/client";
import { DEMO_REPORT } from "@/lib/civicai/data/reports";
import type { DocumentStatus } from "@/lib/civicai/types";

type ChecklistSnapshot = {
  serviceName: string;
  docs: { name: string; status: DocumentStatus }[];
};

function readChecklistSnapshot(): ChecklistSnapshot {
  const last = getLastAssistantResponse();
  if (last) {
    return { serviceName: last.serviceName, docs: last.checklist };
  }
  return {
    serviceName: DEMO_REPORT.serviceName,
    docs: DEMO_REPORT.requiredDocuments,
  };
}

export default function ChecklistPage() {
  const { language } = useCivicLanguage();
  const [snapshot] = useState<ChecklistSnapshot>(readChecklistSnapshot);

  const { serviceName, docs } = snapshot;

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
      <PageHeader
        title={language === "ur" ? "شہری چیک لسٹ" : "Citizen Checklist"}
        description={
          language === "ur"
            ? `${serviceName} کے لیے ثبوت کی چیک لسٹ`
            : `Evidence checklist for ${serviceName}`
        }
      >
        <Link href="/reports/demo">
          <Button>
            <FileText className="size-4" />
            {language === "ur" ? "مکمل رپورٹ" : "Full Report"}
            <ArrowRight className="size-4" />
          </Button>
        </Link>
      </PageHeader>

      <Card>
        <CardHeader>
          <CardTitle>
            {language === "ur"
              ? "ضروری اور اختیاری ثبوت"
              : "Required & Optional Evidence"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {docs.map((doc, i) => (
            <div
              key={doc.name}
              className="flex items-center gap-4 rounded-xl border border-border/60 p-4"
            >
              <div className="flex size-8 items-center justify-center rounded-lg bg-muted text-sm font-bold">
                {i + 1}
              </div>
              <div className="flex flex-1 items-center justify-between gap-2">
                <span className="font-medium">{doc.name}</span>
                <StatusChip status={doc.status} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="mt-6 border-amber-500/20 bg-amber-500/5">
        <CardContent className="pt-6 text-sm text-muted-foreground">
          <strong className="text-foreground">
            {language === "ur" ? "مشورہ:" : "Tip:"}
          </strong>{" "}
          {language === "ur"
            ? "مقام کی تصویر اور GPS پن کے ساتھ رپورٹ کریں۔ حفاظتی فاصلے سے ثبوت جمع کریں۔"
            : "Report with a photo and GPS pin. Gather evidence from a safe distance."}
        </CardContent>
      </Card>
    </div>
  );
}
