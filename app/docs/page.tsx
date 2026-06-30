import Link from "next/link";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const docs = [
  "PROJECT_CONSTITUTION.md",
  "CODING_STANDARDS.md",
  "AI_RULES.md",
  "ARCHITECTURE.md",
  "API_GUIDELINES.md",
  "DATABASE_GUIDELINES.md",
  "DEPLOYMENT.md",
  "PROMPT_ENGINEERING.md",
  "AGENT_DESIGN.md",
  "docs/V0-IMPORT-GUIDE.md",
  "docs/PHASE-6.md",
  "docs/PHASE-7.md",
  "docs/PHASE-8.md",
  "docs/PHASE-9.md",
];

export default function DocsPage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-16">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">Engineering Documentation</h1>
        <p className="text-muted-foreground">
          These files live in the repository root. Open them in Cursor or your editor.
        </p>
      </div>
      <div className="grid gap-3">
        {docs.map((doc) => (
          <Card key={doc}>
            <CardHeader>
              <CardTitle>{doc.replace(".md", "").replace(/_/g, " ")}</CardTitle>
              <CardDescription className="font-mono text-xs">{doc}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
      <Link className="text-sm text-muted-foreground hover:underline" href="/">
        ← Back to home
      </Link>
    </main>
  );
}
