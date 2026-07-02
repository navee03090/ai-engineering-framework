import Link from "next/link";

import { CommandBoard } from "@/components/civic/command-board";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getActiveCivicPack } from "@/lib/civic/config";
import { requireUser } from "@/lib/auth/session";
import { incidentService } from "@/services/incident.service";

export default async function CommandPage() {
  const user = await requireUser();
  const civic = getActiveCivicPack();
  const incidents = await incidentService.listSortedByPriority();
  const stats = await incidentService.getStats();

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8 px-6 py-10">
      <section className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <Badge>Civic Command Center</Badge>
          <Badge variant="secondary">{civic.label}</Badge>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight">Priority command board</h1>
        <p className="text-muted-foreground">
          Signed in as <span className="font-medium text-foreground">{user.email}</span>
        </p>
        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
          <span>{stats.total} total</span>
          <span>{stats.open} open</span>
          <span>{stats.reviewed} reviewed</span>
          <span>{stats.critical} high/critical</span>
        </div>
      </section>

      <div className="flex flex-wrap gap-3">
        <Link href="/report">
          <Button>Simulate citizen report</Button>
        </Link>
        <Link href="/notifications">
          <Button variant="outline">Alert channels</Button>
        </Link>
      </div>

      <CommandBoard incidents={incidents} />
    </main>
  );
}
