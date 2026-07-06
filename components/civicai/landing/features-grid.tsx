import {
  AlertTriangle,
  Bot,
  CheckCircle2,
  FileSearch,
  ListChecks,
  Shield,
} from "lucide-react";

import { AnimatedCard } from "@/components/civicai/shared";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const FEATURES = [
  {
    icon: Bot,
    title: "AI Decision Assistant",
    description:
      "Structured guidance through government procedures — not open-ended chat. Get clear steps, not vague answers.",
  },
  {
    icon: ListChecks,
    title: "Official Checklists",
    description:
      "Auto-generated document checklists based on official requirements for 13+ government services.",
  },
  {
    icon: FileSearch,
    title: "Document Verification",
    description:
      "Upload officer notes. OCR extracts document names and compares them against the official list.",
  },
  {
    icon: Shield,
    title: "Scam Warnings",
    description:
      "Know official fees and processing times. Get polite warnings about unofficial payments — without accusations.",
  },
  {
    icon: AlertTriangle,
    title: "Missing Document Alerts",
    description:
      "Instantly see which documents are required, optional, unknown, or missing from your submission.",
  },
  {
    icon: CheckCircle2,
    title: "Confidence Scoring",
    description:
      "Every AI response includes a confidence indicator and source references for transparency.",
  },
];

export function FeaturesGrid() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Built for Citizens, Not Bureaucrats
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Premium government technology that puts transparency first.
          </p>
        </div>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, i) => (
            <AnimatedCard key={feature.title} delay={i * 0.08}>
              <Card className="h-full border-border/60 transition-shadow hover:shadow-lg hover:shadow-primary/5">
                <CardHeader>
                  <div className="mb-2 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <feature.icon className="size-5" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </AnimatedCard>
          ))}
        </div>
      </div>
    </section>
  );
}
