import {
  AlertTriangle,
  Bot,
  CheckCircle2,
  FileSearch,
  ListChecks,
  MapPin,
} from "lucide-react";

import { AnimatedCard } from "@/components/civicai/shared";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const FEATURES = [
  {
    icon: Bot,
    title: "Six-Agent AI Pipeline",
    description:
      "Intent, Knowledge, OCR, Compliance, Recommendation, and Report agents — specialized for environmental intelligence.",
  },
  {
    icon: ListChecks,
    title: "Citizen Checklists",
    description:
      "Auto-generated evidence checklists for 12+ waste and environmental services across Pakistan.",
  },
  {
    icon: FileSearch,
    title: "OCR Evidence Analysis",
    description:
      "Upload waste photos or municipal notices. OCR extracts text and compares against reporting requirements.",
  },
  {
    icon: MapPin,
    title: "Interactive Maps",
    description:
      "View municipal offices, recycling centers, and pollution hotspots on Google Maps.",
  },
  {
    icon: AlertTriangle,
    title: "Safety & Compliance",
    description:
      "Careful advisory language for illegal dumping indicators — never accuses individuals.",
  },
  {
    icon: CheckCircle2,
    title: "PDF + Email Reports",
    description:
      "Download environmental incident reports and receive them by email with full audit trail.",
  },
];

export function FeaturesGrid() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Built for Citizens & Municipalities
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Premium environmental technology that predicts, prioritizes, and coordinates cleanup.
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
