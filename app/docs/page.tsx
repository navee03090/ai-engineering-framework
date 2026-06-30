import Link from "next/link";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const coreDocs = [
  "PROJECT_CONSTITUTION.md",
  "CODING_STANDARDS.md",
  "AI_RULES.md",
  "ARCHITECTURE.md",
  "API_GUIDELINES.md",
  "DATABASE_GUIDELINES.md",
  "DEPLOYMENT.md",
  "PROMPT_ENGINEERING.md",
  "AGENT_DESIGN.md",
];

const guides = ["docs/API-REFERENCE.md", "docs/V0-IMPORT-GUIDE.md"];

const phaseDocs = [
  "docs/PHASE-6.md",
  "docs/PHASE-7.md",
  "docs/PHASE-8.md",
  "docs/PHASE-9.md",
  "docs/PHASE-10.md",
  "docs/PHASE-11.md",
  "docs/PHASE-12.md",
  "docs/PHASE-13.md",
  "docs/PHASE-14.md",
];

function DocCard({ doc }: { doc: string }) {
  const label = doc.replace(".md", "").replace(/^docs\//, "").replace(/_/g, " ");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{label}</CardTitle>
        <CardDescription className="font-mono text-xs">{doc}</CardDescription>
      </CardHeader>
    </Card>
  );
}

export default function DocsPage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-6 py-16">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">Engineering Documentation</h1>
        <p className="text-muted-foreground">
          Files live in the repository root and <code className="text-xs">docs/</code>. Open them
          in Cursor or your editor.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Guides</h2>
        <div className="grid gap-3">
          {guides.map((doc) => (
            <DocCard key={doc} doc={doc} />
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Core engineering docs</h2>
        <div className="grid gap-3">
          {coreDocs.map((doc) => (
            <DocCard key={doc} doc={doc} />
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Phase deliverables</h2>
        <div className="grid gap-3">
          {phaseDocs.map((doc) => (
            <DocCard key={doc} doc={doc} />
          ))}
        </div>
      </section>

      <Link className="text-sm text-muted-foreground hover:underline" href="/">
        ← Back to home
      </Link>
    </main>
  );
}
