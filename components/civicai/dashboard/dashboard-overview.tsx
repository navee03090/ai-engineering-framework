"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  AlertTriangle,
  ArrowRight,
  Bell,
  FileText,
  Leaf,
  MapPin,
  Mic,
  RefreshCw,
  Sparkles,
  TrendingUp,
  Upload,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { PageHeader } from "@/components/civicai/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchCivicHistory, fetchCivicStats } from "@/lib/civicai/client";
import type { HistoryApiItem } from "@/lib/civicai/client";
import {
  formatRequestStatus,
  formatServiceSlug,
  truncateText,
} from "@/lib/civicai/format-display";

export function DashboardOverview() {
  const [stats, setStats] = useState({
    totalRequests: 0,
    totalVerifications: 0,
    totalReports: 0,
  });
  const [history, setHistory] = useState<HistoryApiItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const [s, h] = await Promise.all([fetchCivicStats(), fetchCivicHistory()]);
      setStats(s);
      setHistory(h);
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
        const [s, h] = await Promise.all([fetchCivicStats(), fetchCivicHistory()]);
        if (!active) return;
        setStats(s);
        setHistory(h);
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

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl space-y-4 px-4 py-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const recent = history.slice(0, 7).reverse();
  const chartData = recent.map((item, i) => ({
    label: truncateText(item.query, 18) || `#${i + 1}`,
    requests: 1,
    fullQuery: item.query,
  }));

  const completedCount = history.filter((h) => h.status === "completed").length;
  const responseRate =
    history.length > 0 ? Math.round((completedCount / history.length) * 100) : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <PageHeader
        title="Command Center"
        description="Track environmental reports, evidence uploads, and municipal response status."
      >
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => void loadData(true)}
            disabled={refreshing}
            aria-label="Refresh dashboard"
          >
            <RefreshCw className={`size-4 ${refreshing ? "animate-spin" : ""}`} />
          </Button>
          <Link href="/assistant">
            <Button>
              <Sparkles className="size-4" />
              New Report
            </Button>
          </Link>
        </div>
      </PageHeader>

      <div className="mb-6 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-accent/5 p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <Leaf className="size-5" />
            </div>
            <div>
              <p className="font-semibold">EcoMind AI — Waste Command Center</p>
              <p className="mt-1 max-w-xl text-sm text-muted-foreground">
                Report illegal dumping, pollution, and waste issues. Six AI agents
                classify, verify evidence, and route to the right authority.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="gap-1">
              <Mic className="size-3" /> Voice
            </Badge>
            <Badge variant="secondary" className="gap-1">
              <MapPin className="size-3" /> Maps
            </Badge>
            <Badge variant="secondary" className="gap-1">
              <FileText className="size-3" /> PDF
            </Badge>
          </div>
        </div>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Reports", value: stats.totalRequests, icon: TrendingUp },
          { label: "Evidence Uploads", value: stats.totalVerifications, icon: Upload },
          { label: "Incident Reports", value: stats.totalReports, icon: FileText },
          { label: "Agents Online", value: "6/6", icon: Sparkles },
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

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Report Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[240px] w-full">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="label" className="text-xs" tick={{ fontSize: 10 }} />
                    <YAxis className="text-xs" hide />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (!active || !payload?.[0]) return null;
                        const data = payload[0].payload as { fullQuery?: string };
                        return (
                          <div className="rounded-lg border bg-background px-3 py-2 text-xs shadow-md">
                            {data.fullQuery}
                          </div>
                        );
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="requests"
                      stroke="var(--primary)"
                      fill="url(#colorRequests)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full flex-col items-center justify-center text-center text-sm text-muted-foreground">
                  <TrendingUp className="mb-2 size-8 opacity-40" />
                  <p>No report activity yet.</p>
                  <Link href="/assistant" className="mt-2 text-primary hover:underline">
                    Submit your first environmental report →
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="size-4" />
              Environmental Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {history.slice(0, 3).map((item) => {
              const status = formatRequestStatus(item.status);
              return (
                <div
                  key={item.id}
                  className="rounded-lg border border-border/60 bg-muted/20 p-3"
                >
                  <p className="line-clamp-2 text-sm">{item.query}</p>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <span className="text-xs text-muted-foreground">
                      {formatServiceSlug(item.service_slug)}
                    </span>
                    <Badge variant={status.variant} className="text-[10px]">
                      {status.label}
                    </Badge>
                  </div>
                </div>
              );
            })}
            {history.length === 0 && (
              <div className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
                <AlertTriangle className="mx-auto mb-2 size-5 opacity-50" />
                No alerts yet. Try: &quot;illegal dumping near Ring Road&quot;
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Reports</CardTitle>
            <Link href="/history">
              <Button variant="ghost" size="sm">
                View all
                <ArrowRight className="size-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {history.slice(0, 4).map((item) => {
              const status = formatRequestStatus(item.status);
              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-border/60 p-3 transition-colors hover:bg-muted/30"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{item.query}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatServiceSlug(item.service_slug)} ·{" "}
                      {formatDistanceToNow(new Date(item.created_at), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                  <Badge variant={status.variant}>{status.label}</Badge>
                </div>
              );
            })}
            {history.length === 0 && (
              <div className="py-8 text-center text-sm text-muted-foreground">
                <p>No reports yet.</p>
                <Link href="/assistant">
                  <Button className="mt-3" size="sm">
                    Report an issue
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {[
              {
                href: "/assistant",
                label: "Voice Report",
                desc: "Speak your issue",
                icon: Mic,
              },
              {
                href: "/upload",
                label: "Upload Evidence",
                desc: "Photo or notice",
                icon: Upload,
              },
              {
                href: "/services",
                label: "Find Authority",
                desc: "12 services",
                icon: MapPin,
              },
              {
                href: "/reports/demo",
                label: "Sample Report",
                desc: "Ring Road demo",
                icon: FileText,
              },
            ].map((action) => (
              <Link key={action.href} href={action.href}>
                <Button
                  variant="outline"
                  className="h-auto w-full flex-col items-start gap-1 py-4 text-left"
                >
                  <action.icon className="size-5 text-primary" />
                  <span className="font-medium">{action.label}</span>
                  <span className="text-xs font-normal text-muted-foreground">
                    {action.desc}
                  </span>
                </Button>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Municipal Response Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="size-3 rounded-full bg-emerald-500 animate-pulse" />
            <div className="flex-1">
              <p className="font-medium">All environmental agents operational</p>
              <p className="text-sm text-muted-foreground">
                Intent → Knowledge → OCR → Compliance → Recommendation → Report
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">{responseRate}%</p>
              <p className="text-xs text-muted-foreground">Completion rate</p>
            </div>
          </div>
          <Progress value={responseRate || 100} className="mt-4 h-2" />
        </CardContent>
      </Card>
    </div>
  );
}
