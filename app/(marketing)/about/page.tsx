import Link from "next/link";
import { ArrowRight, Building2, Shield, Sparkles, Users } from "lucide-react";

import { AnimatedCard } from "@/components/civicai/shared";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "About",
  description: "Learn about CivicAI — Pakistan's AI-powered civic navigation platform.",
};

const VALUES = [
  {
    icon: Shield,
    title: "Transparency",
    description: "Official fees, documents, and timelines — no hidden information.",
  },
  {
    icon: Users,
    title: "Citizen-First",
    description: "Built for ordinary Pakistanis navigating complex government systems.",
  },
  {
    icon: Sparkles,
    title: "AI with Purpose",
    description: "Structured decision assistance, not generic chatbot conversations.",
  },
  {
    icon: Building2,
    title: "Government Knowledge",
    description: "Grounded in official procedures across 13 essential services.",
  },
];

export default function AboutPage() {
  return (
    <main className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Badge className="mb-4">About CivicAI</Badge>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Empowering Citizens Through{" "}
          <span className="civic-gradient-text">Transparent AI</span>
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
          CivicAI is an AI Decision Assistant that helps Pakistani citizens navigate
          government services without middlemen. We provide structured guidance on
          documents, fees, processing times, and scam warnings — so you arrive prepared
          and confident at every government office.
        </p>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          We never accuse government officials. Instead, we empower citizens with
          official knowledge and polite advisories when requested documents don&apos;t
          match the official checklist.
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
              Try CivicAI Free
              <ArrowRight className="size-4" />
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
