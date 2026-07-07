"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import {
  ArrowRight,
  Building2,
  FileText,
  RefreshCw,
  Shield,
  TrendingUp,
  Upload,
  Users,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  PageHeader,
  ReporterBadge,
} from "@/components/civicai/authority/authority-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  fetchAuthorityRequests,
  fetchAuthorityStats,
  type AuthorityStats,
} from "@/lib/civicai/authority-client";
import {
  formatRequestStatus,
  formatServiceSlug,
} from "@/lib/civicai/format-display";
import type { AuthorityRequestItem } from "@/services/civicai-authority.service";

type StatusFilter = "all" | "completed" | "processing" | "failed" | "clarify";

export function AuthorityDashboard() {
  const [stats, setStats] = useState<AuthorityStats | null>(null);
  const [requests, setRequests] = useState<AuthorityRequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const loadData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const [nextStats, nextRequests] = await Promise.all([
        fetchAuthorityStats(),
        fetchAuthorityRequests(),
      ]);
      setStats(nextStats);
      setRequests(nextRequests);
    } catch {
      /* keep previous data on refresh failure */
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const [nextStats, nextRequests] = await Promise.all([
          fetchAuthorityStats(),
          fetchAuthorityRequests(),
        ]);
        if (!active) return;
        setStats(nextStats);
        setRequests(nextRequests);
      } catch {
        /* keep previous data on refresh failure */
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    if (statusFilter === "all") return requests;
    return requests.filter((item) => item.status === statusFilter);
  }, [requests, statusFilter]);

  const completedCount = stats?.byStatus.completed ?? 0;
  const totalRequests = stats?.totalRequests ?? 0;
  const responseRate =
    totalRequests > 0 ? Math.round((completedCount / totalRequests) * 100) : 0;

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl space-y-4 px-4 py-6 sm:px-6 lg:px-8">
        <Skeleton className="h-10 w-72" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <PageHeader
        title="Authority Command Center"
        description="Monitor all citizen environmental reports, evidence uploads, and incident PDFs city-wide."
      >
        <Button
          variant="outline"
          size="icon"
          onClick={() => void loadData(true)}
          disabled={refreshing}
          aria-label="Refresh dashboard"
        >
          <RefreshCw className={`size-4 ${refreshing ? "animate-spin" : ""}`} />
        </Button>
      </PageHeader>

      <div className="mb-6 rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 via-background to-primary/5 p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-amber-600 text-white shadow-sm">
              <Shield className="size-5" />
            </div>
            <div>
              <p className="font-semibold">Municipal oversight — all citizen submissions</p>
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                LWMC, EPA, and WASA coordinators can review every EcoMind AI report,
                open full incident PDFs, and track response status across the city.
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="w-fit gap-1">
            <Users className="size-3" />
            {stats?.uniqueCitizens ?? 0} citizens reporting
          </Badge>
        </div>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Citizen Reports", value: stats?.totalRequests ?? 0, icon: TrendingUp },
          { label: "Evidence Uploads", value: stats?.totalVerifications ?? 0, icon: Upload },
          { label: "Incident PDFs", value: stats?.totalReports ?? 0, icon: FileText },
          { label: "Active Citizens", value: stats?.uniqueCitizens ?? 0, icon: Users },
        ].map((stat) => (
          <Card key={stat.label} className="border-border/60 shadow-sm">
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <stat.icon className="size-5" />
              </div>
              <div>
                <p className="text-2xl font-bold tabular-nums">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mb-6">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>All Citizen Reports</CardTitle>
          <div className="flex flex-wrap gap-2">
            {(["all", "completed", "processing", "failed", "clarify"] as const).map(
              (filter) => (
                <Button
                  key={filter}
                  size="sm"
                  variant={statusFilter === filter ? "default" : "outline"}
                  onClick={() => setStatusFilter(filter)}
                >
                  {filter === "all" ? "All" : formatRequestStatus(filter).label}
                  {filter !== "all" && stats?.byStatus[filter] != null
                    ? ` (${stats.byStatus[filter]})`
                    : ""}
                </Button>
              )
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {filtered.length === 0 ? (
            <div className="rounded-lg border border-dashed py-12 text-center text-sm text-muted-foreground">
              <Building2 className="mx-auto mb-2 size-8 opacity-40" />
              <p>No reports match this filter.</p>
            </div>
          ) : (
            filtered.map((item) => {
              const status = formatRequestStatus(item.status);
              return (
                <div
                  key={item.id}
                  className="rounded-xl border border-border/60 p-4 transition-colors hover:bg-muted/30"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex-1 space-y-2">
                      <p className="font-medium leading-snug">{item.query}</p>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                        <ReporterBadge
                          email={item.reporterEmail}
                          name={item.reporterName}
                        />
                        <span>{formatServiceSlug(item.service_slug)}</span>
                        <span>
                          {formatDistanceToNow(new Date(item.created_at), {
                            addSuffix: true,
                          })}
                        </span>
                        {item.confidence != null ? (
                          <span>{item.confidence}% confidence</span>
                        ) : null}
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <Badge variant={status.variant}>{status.label}</Badge>
                      {item.reportId ? (
                        <Link href={`/authority/reports/${item.reportId}`}>
                          <Button size="sm" variant="outline" className="gap-1">
                            View report
                            <ArrowRight className="size-3" />
                          </Button>
                        </Link>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pipeline Health</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="size-3 animate-pulse rounded-full bg-emerald-500" />
            <div className="flex-1">
              <p className="font-medium">Six-agent environmental pipeline operational</p>
              <p className="text-sm text-muted-foreground">
                {completedCount} completed · {stats?.byStatus.failed ?? 0} failed ·{" "}
                {stats?.byStatus.clarify ?? 0} need clarification
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">{responseRate}%</p>
              <p className="text-xs text-muted-foreground">Completion rate</p>
            </div>
          </div>
          <Progress value={responseRate || 0} className="mt-4 h-2" />
        </CardContent>
      </Card>
    </div>
  );
}
