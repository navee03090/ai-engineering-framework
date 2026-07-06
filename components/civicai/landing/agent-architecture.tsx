import { Brain, FileSearch, ListChecks, MessageSquare, Sparkles } from "lucide-react";

import { AnimatedCard } from "@/components/civicai/shared";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AGENTS = [
  {
    icon: MessageSquare,
    name: "Intake Agent",
    role: "Parses citizen queries and normalizes intent",
  },
  {
    icon: Brain,
    name: "Classifier Agent",
    role: "Maps intent to government service and department",
  },
  {
    icon: ListChecks,
    name: "Procedure Agent",
    role: "Retrieves documents, fees, and timelines",
  },
  {
    icon: FileSearch,
    name: "OCR Agent",
    role: "Extracts text from uploaded officer notes",
  },
  {
    icon: Sparkles,
    name: "Advisor Agent",
    role: "Compares docs and generates citizen guidance",
  },
];

export function AgentArchitecture() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Multi-Agent AI Architecture
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Specialized agents orchestrated for accuracy — not one generic chatbot.
          </p>
        </div>
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {AGENTS.map((agent, i) => (
            <AnimatedCard key={agent.name} delay={i * 0.08}>
              <Card className="h-full text-center">
                <CardHeader className="pb-2">
                  <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <agent.icon className="size-5" />
                  </div>
                  <CardTitle className="text-sm">{agent.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">{agent.role}</p>
                </CardContent>
              </Card>
            </AnimatedCard>
          ))}
        </div>
      </div>
    </section>
  );
}
