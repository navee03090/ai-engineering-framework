import Link from "next/link";
import { ArrowRight, Leaf, MapPin, Shield, Sparkles } from "lucide-react";

import { AnimatedCard } from "@/components/civicai/shared";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CIVICAI_PRODUCT_NAME, CIVICAI_TAGLINE } from "@/lib/civicai/brand";

export const metadata = {
  title: "About",
  description: `Learn about ${CIVICAI_PRODUCT_NAME} — ${CIVICAI_TAGLINE}.`,
};

const VALUES = [
  {
    icon: Leaf,
    title: "Cleaner Cities",
    description:
      "AI that predicts, prioritizes, and coordinates environmental cleanup across Pakistan.",
  },
  {
    icon: Shield,
    title: "Citizen Safety",
    description:
      "Careful advisory language for hazardous waste — never accuses individuals.",
  },
  {
    icon: Sparkles,
    title: "Six-Agent Intelligence",
    description:
      "Intent, Knowledge, OCR, Compliance, Recommendation, and Report agents working together.",
  },
  {
    icon: MapPin,
    title: "Authority Routing",
    description:
      "Routes incidents to LWMC, EPA, WASA, and municipal bodies with map locations.",
  },
];

export default function AboutPage() {
  return (
    <main className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Badge className="mb-4">About {CIVICAI_PRODUCT_NAME}</Badge>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Pakistan&apos;s{" "}
          <span className="civic-gradient-text">Waste Command Center</span>
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
          {CIVICAI_PRODUCT_NAME} helps citizens report environmental issues — illegal
          dumping, missed collection, chemical waste, air pollution — and receive
          AI-powered guidance on responsible authorities, evidence requirements, and
          estimated response times.
        </p>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          Built for the CECOS University hackathon, EcoMind AI reuses a production-grade
          six-agent pipeline to turn citizen reports into actionable incident PDFs with
          maps, checklists, and email delivery.
        </p>

        <div className="mt-16 grid gap-6 sm:grid-cols-2">
          {VALUES.map((v, i) => (
            <AnimatedCard key={v.title} delay={i * 0.08}>
              <Card className="h-full">
                <CardContent className="pt-6">
                  <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <v.icon className="size-5" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">{v.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{v.description}</p>
                </CardContent>
              </Card>
            </AnimatedCard>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link href="/assistant">
            <Button size="lg">
              Report an Issue
              <ArrowRight className="size-4" />
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
