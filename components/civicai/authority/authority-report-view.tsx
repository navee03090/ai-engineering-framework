"use client";

import Link from "next/link";
import { ArrowLeft, User } from "lucide-react";
import { useEffect, useState } from "react";

import { ReportView } from "@/components/civicai/report/report-view";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchAuthorityReport } from "@/lib/civicai/authority-client";
import { mapDbReport } from "@/lib/civicai/map-db-report";

export function AuthorityReportView({ reportId }: { reportId: string }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reporterEmail, setReporterEmail] = useState<string | null>(null);
  const [reporterName, setReporterName] = useState<string | null>(null);
  const [report, setReport] = useState<ReturnType<typeof mapDbReport> | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const row = await fetchAuthorityReport(reportId);
        if (cancelled) return;
        setReporterEmail(row.reporterEmail);
        setReporterName(row.reporterName);
        setReport(
          mapDbReport({
            id: row.id,
            summary: row.summary,
            report_json: row.report_json,
            service_slug: row.service_slug,
            qr_data: row.qr_data,
            created_at: row.created_at,
          })
        );
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load report");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [reportId]);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl space-y-4 px-4 py-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-6">
        <p className="text-destructive">{error ?? "Report not found"}</p>
        <Link href="/authority/dashboard">
          <Button className="mt-4" variant="outline">
            Back to authority dashboard
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="border-b border-border/60 bg-muted/30">
        <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/authority/dashboard">
            <Button variant="ghost" size="sm" className="mb-3 gap-2">
              <ArrowLeft className="size-4" />
              Authority dashboard
            </Button>
          </Link>
          <Card className="border-amber-500/20 bg-amber-500/5">
            <CardContent className="flex flex-wrap items-center justify-between gap-3 pt-4">
              <div className="flex items-center gap-2 text-sm">
                <User className="size-4 text-muted-foreground" />
                <span className="font-medium">Submitted by</span>
                <span>{reporterName ?? reporterEmail ?? "Unknown citizen"}</span>
                {reporterName && reporterEmail ? (
                  <span className="text-muted-foreground">({reporterEmail})</span>
                ) : null}
              </div>
              <Badge variant="secondary">Authority view</Badge>
            </CardContent>
          </Card>
        </div>
      </div>
      <ReportView report={report} />
    </div>
  );
}
