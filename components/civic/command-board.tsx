"use client";

import Link from "next/link";

import { SeverityBadge } from "@/components/civic/severity-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { isEscalationSeverity } from "@/lib/civic/severity";

export type CommandIncident = {
  id: string;
  title: string;
  location: string | null;
  description: string;
  status: string;
  category: string | null;
  severity: string | null;
  ai_summary: string | null;
  recommended_action: string | null;
  created_at: string;
};

type CommandBoardProps = {
  incidents: CommandIncident[];
};

export function CommandBoard({ incidents }: CommandBoardProps) {
  if (incidents.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No reports yet</CardTitle>
          <CardDescription>
            Submit a civic report or seed demo data for DigTech presentation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/report">
            <Button>Open public report form</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {incidents.map((incident) => (
        <Card key={incident.id}>
          <CardHeader className="pb-2">
            <div className="flex flex-wrap items-center gap-2">
              <SeverityBadge severity={incident.severity} />
              {incident.category ? (
                <Badge variant="outline">{incident.category}</Badge>
              ) : null}
              <Badge variant="secondary">{incident.status}</Badge>
              {isEscalationSeverity(incident.severity) ? (
                <Badge variant="destructive">Escalation watch</Badge>
              ) : null}
            </div>
            <CardTitle className="text-lg">{incident.title}</CardTitle>
            <CardDescription>
              {incident.location ?? "Location n/a"} ·{" "}
              {new Date(incident.created_at).toLocaleString()}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground line-clamp-2">{incident.description}</p>
            {incident.ai_summary ? (
              <p className="text-sm">
                <span className="font-medium">AI summary:</span> {incident.ai_summary}
              </p>
            ) : null}
            <Link href={`/command/${incident.id}`}>
              <Button size="sm" variant="outline">
                Open in command view
              </Button>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
