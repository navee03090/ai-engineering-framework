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

const TEMPLATE_URL =
  "https://github.com/navee03090/ai-engineering-framework/generate";

const features = [
  {
    title: "Supabase",
    description: "Auth, Postgres, storage, RLS, and typed clients.",
  },
  {
    title: "Gemini AI",
    description: "Agents, prompts, orchestrator — gemini-2.5-flash ready.",
  },
  {
    title: "Integrations",
    description: "Resend email, n8n webhooks, file uploads, notifications.",
  },
  {
    title: "Engineering docs",
    description: "Constitution, Cursor rules, API reference, template setup.",
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
            <Badge>15 phases complete</Badge>
            <Badge variant="outline">GitHub template</Badge>
          </div>
          <h1 className="text-4xl font-semibold tracking-tight">
            AI Engineering Framework
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            Your reusable foundation for AI applications. Use this template on GitHub,
            run <code className="text-sm">npm run setup</code>, import UI from v0, and
            build features — not boilerplate.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href={TEMPLATE_URL} target="_blank" rel="noreferrer">
              <Button>Use this template</Button>
            </a>
            <Link href="/docs">
              <Button variant="outline">Read the docs</Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline">Command center</Button>
            </Link>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          {features.map((feature) => (
            <Card key={feature.title}>
              <CardHeader>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent />
            </Card>
          ))}
        </section>

        <section className="rounded-xl border bg-muted/30 p-6 space-y-2 text-sm text-muted-foreground">
          <p>
            <span className="font-medium text-foreground">New project?</span> See{" "}
            <code className="text-xs">docs/TEMPLATE-SETUP.md</code> after generating
            from GitHub.
          </p>
          <p>
            First consumer:{" "}
            <span className="font-medium text-foreground">
              Pakistan Disaster Response AI Command Center
            </span>
          </p>
        </section>
      </main>
    </>
  );
}
