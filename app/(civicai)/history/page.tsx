"use client";

import { useEffect, useState } from "react";
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

export default function HistoryPage() {
  const { language } = useCivicLanguage();
  const [items, setItems] = useState<HistoryApiItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchCivicHistory()
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = items.filter(
    (item) =>
      !search ||
      item.query.toLowerCase().includes(search.toLowerCase()) ||
      (item.service_slug ?? "").toLowerCase().includes(search.toLowerCase())
  );

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
        title={language === "ur" ? "درخواستوں کی تاریخ" : "Request History"}
        description={
          language === "ur"
            ? "آپ کی محفوظ شدہ AI درخواستیں Supabase میں。"
            : "Your saved AI requests persisted in Supabase."
        }
      />

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={language === "ur" ? "تلاش..." : "Search history..."}
          className="pl-9"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={History}
          title={language === "ur" ? "ابھی کوئی تاریخ نہیں" : "No history yet"}
          description={
            language === "ur"
              ? "آپ کی AI درخواستیں یہاں ظاہر ہوں گی。"
              : "Your AI requests and reports will appear here."
          }
          action={
            <Link href="/assistant">
              <Button>
                {language === "ur" ? "پہلی درخواست" : "Start Your First Request"}
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <Card key={item.id} className="transition-colors hover:bg-muted/30">
              <CardContent className="flex items-center justify-between gap-4 py-4">
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{item.query}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.service_slug ?? item.detected_intent ?? "—"}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(item.created_at), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
                <Badge variant={item.status === "completed" ? "secondary" : "outline"}>
                  {item.status}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
