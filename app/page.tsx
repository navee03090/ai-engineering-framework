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
import { SiteHeader } from "@/components/layout/site-header";

const sprintFeatures = [
  {
    title: "Supabase",
    description: "Browser, server, and service-role clients with migrations and types.",
  },
  {
    title: "Gemini AI",
    description: "Centralized AI layer using gemini-2.5-flash with validation helpers.",
  },
  {
    title: "shadcn/ui",
    description: "Pre-installed component library for rapid UI development.",
  },
  {
    title: "Engineering Docs",
    description: "Constitution, Cursor rules, and architecture guidelines built in.",
  },
];

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-10 px-6 py-16">
      <section className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">AEF v1.0</Badge>
          <Badge>Phase 10 — Authentication</Badge>
        </div>
        <h1 className="text-4xl font-semibold tracking-tight">
          AI Engineering Framework
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          Your reusable foundation for AI applications. Clone this template, import UI
          from v0, and build features — not boilerplate.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/dashboard">
            <Button>Command center</Button>
          </Link>
          <Link href="/docs">
            <Button variant="outline">Read the docs</Button>
          </Link>
          <Link href="/api/health">
            <Button variant="outline">Health check</Button>
          </Link>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        {sprintFeatures.map((feature) => (
          <Card key={feature.title}>
            <CardHeader>
              <CardTitle>{feature.title}</CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
            <CardContent />
          </Card>
        ))}
      </section>

      <section className="rounded-xl border bg-muted/30 p-6 text-sm text-muted-foreground">
        <p>
          First consumer project:{" "}
          <span className="font-medium text-foreground">
            Pakistan Disaster Response AI Command Center
          </span>
        </p>
      </section>
    </main>
    </>
  );
}
