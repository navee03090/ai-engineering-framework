"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import {
  PipelineSteps,
  type PipelineStepView,
} from "@/components/civic/pipeline-steps";
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

type IncidentDetail = {
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

type Attachment = {
  id: string;
  file_name: string;
  mime_type: string;
  category: string;
};

type CommandIncidentPanelProps = {
  incident: IncidentDetail;
  attachments: Attachment[];
  autoAnalyze?: boolean;
};

export function CommandIncidentPanel({
  incident,
  attachments,
  autoAnalyze,
}: CommandIncidentPanelProps) {
  const [current, setCurrent] = useState(incident);
  const [pipelineSteps, setPipelineSteps] = useState<PipelineStepView[]>([]);
  const [runId, setRunId] = useState<string>();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [escalated, setEscalated] = useState(false);
  const autoRan = useRef(false);

  const runAnalyze = useCallback(async () => {
    setIsAnalyzing(true);

    try {
      const response = await fetch(`/api/civic/incidents/${incident.id}/analyze`, {
        method: "POST",
      });
      const body = await response.json();

      if (!response.ok || !body.success) {
        throw new Error(body.error?.message ?? "Analysis failed");
      }

      setCurrent(body.data.incident);
      setPipelineSteps(body.data.pipeline.steps);
      setRunId(body.data.pipeline.runId);
      setEscalated(Boolean(body.data.escalated));

      if (body.data.escalated) {
        toast.success("Critical case escalated to alert channel");
      } else {
        toast.success("AI pipeline complete");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Analysis failed";
      toast.error(message);
    } finally {
      setIsAnalyzing(false);
    }
  }, [incident.id]);

  useEffect(() => {
    if (autoAnalyze && current.status === "open" && !autoRan.current) {
      autoRan.current = true;
      void runAnalyze();
    }
  }, [autoAnalyze, current.status, runAnalyze]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center gap-2">
            <SeverityBadge severity={current.severity} />
            {current.category ? (
              <Badge variant="outline">{current.category}</Badge>
            ) : null}
            <Badge variant="secondary">{current.status}</Badge>
            {escalated ? <Badge variant="destructive">Alert sent</Badge> : null}
            {isEscalationSeverity(current.severity) && !escalated ? (
              <Badge variant="destructive">Escalation eligible</Badge>
            ) : null}
          </div>
          <CardTitle>{current.title}</CardTitle>
          <CardDescription>
            {current.location ?? "Location n/a"} ·{" "}
            {new Date(current.created_at).toLocaleString()}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm">{current.description}</p>
          {current.ai_summary ? (
            <div className="rounded-lg border bg-muted/30 p-4 text-sm">
              <p className="font-medium">AI operational summary</p>
              <p className="mt-1 text-muted-foreground">{current.ai_summary}</p>
            </div>
          ) : null}
          {current.recommended_action ? (
            <div className="rounded-lg border p-4 text-sm">
              <p className="font-medium">Recommended action</p>
              <p className="mt-1">{current.recommended_action}</p>
            </div>
          ) : null}
          <Button onClick={() => void runAnalyze()} disabled={isAnalyzing}>
            {isAnalyzing ? "Running AI pipeline…" : "Run AI triage pipeline"}
          </Button>
        </CardContent>
      </Card>

      <PipelineSteps steps={pipelineSteps} runId={runId} />

      {attachments.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Evidence attachments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {attachments.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between rounded border p-2"
              >
                <span>{file.file_name}</span>
                <Badge variant="secondary">{file.category}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
