import Link from "next/link";

import { CommandIncidentPanel } from "@/components/civic/command-incident-panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { requireUser } from "@/lib/auth/session";
import { civicService } from "@/services/civic.service";
import { incidentService } from "@/services/incident.service";

type CommandDetailPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ new?: string }>;
};

export default async function CommandDetailPage({
  params,
  searchParams,
}: CommandDetailPageProps) {
  await requireUser();
  const { id } = await params;
  const query = await searchParams;
  const incident = await incidentService.getById(id);
  const attachments = await civicService.listAttachments(id);

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-10">
      <section className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <Badge variant="secondary">Incident command view</Badge>
          <h1 className="text-2xl font-semibold tracking-tight">Triage & escalation</h1>
        </div>
        <Link href="/command">
          <Button variant="outline" size="sm">
            ← Command board
          </Button>
        </Link>
      </section>

      <CommandIncidentPanel
        incident={incident}
        attachments={attachments}
        autoAnalyze={query.new === "1"}
      />
    </main>
  );
}
