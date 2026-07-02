import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export type PipelineStepView = {
  agent: string;
  success: boolean;
  durationMs?: number;
};

type PipelineStepsProps = {
  steps: PipelineStepView[];
  runId?: string;
};

export function PipelineSteps({ steps, runId }: PipelineStepsProps) {
  if (steps.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">AI agent pipeline</CardTitle>
        {runId ? <p className="text-xs text-muted-foreground font-mono">{runId}</p> : null}
      </CardHeader>
      <CardContent className="space-y-3">
        {steps.map((step, index) => (
          <div
            key={`${step.agent}-${index}`}
            className="flex flex-wrap items-center justify-between gap-2 rounded-lg border p-3 text-sm"
          >
            <div className="flex items-center gap-2">
              <span className="font-medium capitalize">{step.agent}</span>
              <Badge variant={step.success ? "default" : "destructive"}>
                {step.success ? "Complete" : "Failed"}
              </Badge>
            </div>
            {step.durationMs ? (
              <span className="text-muted-foreground">{step.durationMs} ms</span>
            ) : null}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
