import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { requireUser } from "@/lib/auth/session";

export default async function DashboardPage() {
  const user = await requireUser();

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-6 py-10">
      <section className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <Badge>Phase 10 — Auth</Badge>
          <Badge variant="secondary">Protected route</Badge>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight">Command Center</h1>
        <p className="text-muted-foreground">
          Signed in as <span className="font-medium text-foreground">{user.email}</span>
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Incidents API</CardTitle>
            <CardDescription>Create and analyze disaster incidents via services.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/api/incidents">
              <Button variant="outline" size="sm">
                View API
              </Button>
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>AI Agents</CardTitle>
            <CardDescription>Classifier and summarizer agents for response workflows.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/api/agents">
              <Button variant="outline" size="sm">
                List agents
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      <p className="text-sm text-muted-foreground">
        Import v0 UI into this dashboard area for Pakistan Disaster Response AI.
      </p>
    </main>
  );
}
