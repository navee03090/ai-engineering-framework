import Link from "next/link";

import { CivicReportForm } from "@/components/civic/report-form";
import { SiteHeader } from "@/components/layout/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getActiveCivicPack } from "@/lib/civic/config";

export default function ReportPage() {
  const civic = getActiveCivicPack();

  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-6 py-10">
        <section className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>DigTech Civic OS</Badge>
            <Badge variant="secondary">{civic.label}</Badge>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Report a civic issue
          </h1>
          <p className="text-muted-foreground">
            No account required. Coordinators triage reports in the command center with
            multi-agent AI.
          </p>
        </section>
        <CivicReportForm
          titleLabel={civic.reportTitleLabel}
          descriptionPlaceholder={civic.reportDescriptionPlaceholder}
          taglineUrdu={civic.taglineUrdu}
        />
        <p className="text-sm text-muted-foreground">
          Coordinators:{" "}
          <Link className="underline" href="/login">
            sign in
          </Link>{" "}
          to open{" "}
          <Link className="underline" href="/command">
            command center
          </Link>
          .
        </p>
        <Link href="/">
          <Button variant="ghost" size="sm">
            ← Back to home
          </Button>
        </Link>
      </main>
    </>
  );
}
