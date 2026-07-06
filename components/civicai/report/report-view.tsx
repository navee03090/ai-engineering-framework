import { AlertTriangle, Building2, Clock, Lightbulb, Receipt } from "lucide-react";

import Link from "next/link";

import { OfficeMap } from "@/components/civicai/maps/office-map";
import { OcrIntelligencePanel } from "@/components/civicai/report/ocr-intelligence-panel";

import { ReportActions } from "@/components/civicai/report/report-actions";

import { StatusChip } from "@/components/civicai/shared";

import { PageHeader } from "@/components/civicai/layout/app-shell";

import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Separator } from "@/components/ui/separator";

import type { CivicReport } from "@/lib/civicai/types";

export function ReportView({ report }: { report: CivicReport }) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
      <PageHeader
        title={report.pdfTitle ?? report.serviceName}

        description={`Generated report · ${new Date(report.createdAt).toLocaleDateString("en-PK", { dateStyle: "long" })}`}
      >
        <ReportActions report={report} />
      </PageHeader>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Badge>{report.status}</Badge>

        <Badge variant="secondary">{report.confidence}% confidence</Badge>

        <Badge variant="outline">{report.department}</Badge>

        {report.reportType && <Badge variant="outline">{report.reportType}</Badge>}
      </div>

      {report.summary && (
        <Card className="mb-6 border-primary/20 bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Citizen Summary</CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {report.summary}
            </p>
          </CardContent>
        </Card>
      )}

      {report.ocrIntelligence && (
        <div className="mb-6">
          <OcrIntelligencePanel ocr={report.ocrIntelligence} />
        </div>
      )}

      {report.officeLocation && (
        <div className="mb-6">
          <OfficeMap
            location={report.officeLocation}
            title="Office Location"
            height={300}
          />
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Building2 className="size-4" />
              Department
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="font-medium">{report.department}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Receipt className="size-4" />
              Official Fee
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-2xl font-bold text-primary">{report.fee}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="size-4" />
              Estimated Time
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="font-medium">{report.processingTime}</p>
          </CardContent>
        </Card>
      </div>

      {report.pdfSections && report.pdfSections.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Report Sections</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {report.pdfSections.map((section) => (
              <div key={section.heading}>
                <p className="font-semibold">{section.heading}</p>

                <p className="mt-1 text-sm text-muted-foreground whitespace-pre-wrap">
                  {section.body}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {report.timeline.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Procedure Timeline</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="relative space-y-0">
              {report.timeline.map((step, i) => (
                <div key={step.step} className="relative flex gap-4 pb-8 last:pb-0">
                  {i < report.timeline.length - 1 && (
                    <div className="absolute left-[15px] top-8 h-full w-px bg-border" />
                  )}

                  <div className="relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {i + 1}
                  </div>

                  <div className="flex-1 pt-0.5">
                    <p className="font-semibold">{step.step}</p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {step.description}
                    </p>

                    {step.duration && (
                      <Badge variant="secondary" className="mt-2">
                        {step.duration}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Required Documents</CardTitle>
          </CardHeader>

          <CardContent className="space-y-2">
            {report.requiredDocuments.map((doc) => (
              <div
                key={doc.name}

                className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2"
              >
                <span className="text-sm">{doc.name}</span>

                <StatusChip status={doc.status} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-red-500/20">
          <CardHeader>
            <CardTitle className="text-red-600 dark:text-red-400">
              Missing Documents
            </CardTitle>
          </CardHeader>

          <CardContent>
            {report.missingDocuments.length > 0 ? (
              <ul className="space-y-2">
                {report.missingDocuments.map((doc) => (
                  <li key={doc} className="flex items-center gap-2 text-sm">
                    <AlertTriangle className="size-4 text-red-500" />

                    {doc}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                All required documents identified.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {report.warnings.length > 0 && (
        <Card className="mt-6 border-amber-500/20 bg-amber-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
              <AlertTriangle className="size-5" />
              Warnings
            </CardTitle>
          </CardHeader>

          <CardContent>
            <ul className="space-y-2">
              {report.warnings.map((w) => (
                <li key={w} className="text-sm text-muted-foreground">
                  • {w}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {report.tips.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="size-5 text-primary" />
              Preparation Tips
            </CardTitle>
          </CardHeader>

          <CardContent>
            <ul className="space-y-2">
              {report.tips.map((tip) => (
                <li key={tip} className="text-sm text-muted-foreground">
                  • {tip}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <Separator className="my-8" />

      <div className="flex flex-wrap gap-3">
        <Link href="/assistant">
          <Button>Ask Another Question</Button>
        </Link>

        <Link href="/checklist">
          <Button variant="outline">View Checklist</Button>
        </Link>

        <Link href="/upload">
          <Button variant="outline">Upload Another Document</Button>
        </Link>
      </div>
    </div>
  );
}
