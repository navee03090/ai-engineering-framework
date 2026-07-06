"use client";

import Link from "next/link";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ArrowRight, Bell, FileText, Sparkles, TrendingUp, Upload } from "lucide-react";
import { useEffect, useState } from "react";

import { PageHeader } from "@/components/civicai/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchCivicHistory, fetchCivicStats } from "@/lib/civicai/client";
import type { HistoryApiItem } from "@/lib/civicai/client";

export function DashboardOverview() {
  const [stats, setStats] = useState({
    totalRequests: 0,
    totalVerifications: 0,
    totalReports: 0,
  });
  const [history, setHistory] = useState<HistoryApiItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchCivicStats(), fetchCivicHistory()])
      .then(([s, h]) => {
        setStats(s);
        setHistory(h);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
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

  const chartData = history
    .slice(0, 7)
    .reverse()
    .map((item, i) => ({
      label: `#${i + 1}`,
      requests: 1,
    }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <PageHeader
        title="Dashboard"
        description="Your civic navigation hub — requests, reports, and AI status."
      >
        <Link href="/assistant">
          <Button>
            <Sparkles className="size-4" />
            New Request
          </Button>
        </Link>
      </PageHeader>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Requests", value: stats.totalRequests, icon: TrendingUp },
          { label: "Verifications", value: stats.totalVerifications, icon: Upload },
          { label: "Reports", value: stats.totalReports, icon: FileText },
          { label: "Agents Online", value: "6", icon: Sparkles },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <stat.icon className="size-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Request Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData.length ? chartData : [{ label: "—", requests: 0 }]}
                >
                  <defs>
                    <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="label" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="requests"
                    stroke="var(--primary)"
                    fill="url(#colorRequests)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="size-4" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {history.slice(0, 3).map((item) => (
              <div key={item.id} className="rounded-lg border border-border/60 p-3">
                <p className="text-sm">{item.query}</p>
                <p className="mt-1 text-xs text-muted-foreground">{item.status}</p>
              </div>
            ))}
            {history.length === 0 && (
              <p className="text-sm text-muted-foreground">No notifications yet.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Requests</CardTitle>
            <Link href="/history">
              <Button variant="ghost" size="sm">
                View all
                <ArrowRight className="size-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {history.slice(0, 4).map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-lg border border-border/60 p-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{item.query}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.service_slug ?? "—"}
                  </p>
                </div>
                <Badge variant={item.status === "completed" ? "secondary" : "outline"}>
                  {item.status}
                </Badge>
              </div>
            ))}
            {history.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No requests yet. Ask the AI assistant.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {[
              { href: "/assistant", label: "Ask AI", icon: Sparkles },
              { href: "/upload", label: "Upload Document", icon: Upload },
              { href: "/services", label: "Browse Services", icon: FileText },
              { href: "/reports/demo", label: "Sample Report", icon: FileText },
            ].map((action) => (
              <Link key={action.href} href={action.href}>
                <Button variant="outline" className="h-auto w-full flex-col gap-2 py-4">
                  <action.icon className="size-5" />
                  {action.label}
                </Button>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>AI Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="size-3 rounded-full bg-emerald-500 animate-pulse" />
            <div className="flex-1">
              <p className="font-medium">All agents operational</p>
              <p className="text-sm text-muted-foreground">
                Classifier, Procedure, OCR, and Advisor agents online
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">6/6</p>
              <p className="text-xs text-muted-foreground">Agents online</p>
            </div>
          </div>
          <Progress value={100} className="mt-4 h-2" />
        </CardContent>
      </Card>
    </div>
  );
}
