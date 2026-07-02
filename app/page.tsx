import Link from "next/link";

import { SiteHeader } from "@/components/layout/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getActiveCivicPack } from "@/lib/civic/config";
import { incidentService } from "@/services/incident.service";

export default async function HomePage() {
  const civic = getActiveCivicPack();
  let stats = { total: 0, open: 0, reviewed: 0, critical: 0 };

  try {
    stats = await incidentService.getStats();
  } catch {
    // Supabase may be unavailable during static build.
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-10 px-6 py-16">
        <section className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">DigTech 2026 · Civic OS</Badge>
            <Badge>{civic.label}</Badge>
          </div>
          <h1 className="text-4xl font-semibold tracking-tight">{civic.headline}</h1>
          <p className="text-lg text-muted-foreground">{civic.subhead}</p>
          <p className="text-sm text-muted-foreground">{civic.taglineUrdu}</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/report">
              <Button size="lg">Report civic issue</Button>
            </Link>
            <Link href="/command">
              <Button size="lg" variant="outline">
                Command center
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="ghost">Coordinator sign in</Button>
            </Link>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total reports</CardDescription>
              <CardTitle className="text-3xl">{stats.total}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Open queue</CardDescription>
              <CardTitle className="text-3xl">{stats.open}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>AI reviewed</CardDescription>
              <CardTitle className="text-3xl">{stats.reviewed}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>High / critical</CardDescription>
              <CardTitle className="text-3xl">{stats.critical}</CardTitle>
            </CardHeader>
          </Card>
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Multi-agent AI pipeline</CardTitle>
              <CardDescription>
                Classifier → summarizer with visible steps — not a black-box chatbot.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Evidence + escalation</CardTitle>
              <CardDescription>
                Optional photo proof and automated alerts for high-priority civic cases.
              </CardDescription>
            </CardHeader>
          </Card>
        </section>

        <section className="rounded-xl border bg-muted/30 p-6 text-sm text-muted-foreground">
          <p>
            Theme-day pivot: set{" "}
            <code className="text-xs">CIVIC_PROMPT_PACK=emergency|services|social</code> in
            `.env.local` and restart dev server.
          </p>
        </section>
      </main>
    </>
  );
}
