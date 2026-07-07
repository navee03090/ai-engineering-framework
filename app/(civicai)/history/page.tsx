"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { History, Search } from "lucide-react";

import { useCivicLanguage } from "@/components/providers/civic-language-provider";
import { EmptyState } from "@/components/civicai/shared";
import { PageHeader } from "@/components/civicai/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchCivicHistory, type HistoryApiItem } from "@/lib/civicai/client";
import { formatRequestStatus, formatServiceSlug } from "@/lib/civicai/format-display";
import { cn } from "@/lib/utils";

type FilterTab = "all" | "completed" | "failed";

export default function HistoryPage() {
  const { language } = useCivicLanguage();
  const [items, setItems] = useState<HistoryApiItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterTab>("all");

  useEffect(() => {
    fetchCivicHistory()
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        !search ||
        item.query.toLowerCase().includes(search.toLowerCase()) ||
        formatServiceSlug(item.service_slug)
          .toLowerCase()
          .includes(search.toLowerCase());
      const matchesFilter = filter === "all" || item.status === filter;
      return matchesSearch && matchesFilter;
    });
  }, [items, search, filter]);

  const tabs: { id: FilterTab; label: string }[] = [
    { id: "all", label: language === "ur" ? "سب" : "All" },
    { id: "completed", label: language === "ur" ? "مکمل" : "Completed" },
    { id: "failed", label: language === "ur" ? "ناکام" : "Failed" },
  ];

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl space-y-4 px-4 py-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
      <PageHeader
        title={language === "ur" ? "رپورٹس کی تاریخ" : "Report History"}
        description={
          language === "ur"
            ? "آپ کی ماحولیاتی رپورٹس اور AI تجزیہ کی تاریخ۔"
            : "Your environmental reports and AI analysis history."
        }
      />

      <div className="mb-4 flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilter(tab.id)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
              filter === tab.id
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border hover:bg-muted"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={
            language === "ur"
              ? "رپورٹ یا سروس تلاش کریں..."
              : "Search reports or services..."
          }
          className="pl-9"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={History}
          title={language === "ur" ? "ابھی کوئی تاریخ نہیں" : "No history yet"}
          description={
            language === "ur"
              ? "آپ کی ماحولیاتی رپورٹس یہاں ظاہر ہوں گی۔"
              : "Your environmental reports will appear here after you use the assistant."
          }
          action={
            <Link href="/assistant">
              <Button>
                {language === "ur" ? "پہلی رپورٹ کریں" : "Submit First Report"}
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => {
            const status = formatRequestStatus(item.status);
            return (
              <Card key={item.id} className="transition-colors hover:bg-muted/30">
                <CardContent className="flex items-start justify-between gap-4 py-4">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium leading-snug">{item.query}</p>
                    <p className="mt-1 text-sm text-primary/90">
                      {formatServiceSlug(item.service_slug)}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(item.created_at), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                  <Badge variant={status.variant}>{status.label}</Badge>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
