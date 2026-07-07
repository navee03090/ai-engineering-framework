import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="civic-gradient relative overflow-hidden rounded-3xl border border-primary/20 px-8 py-16 text-center sm:px-16">
          <div className="relative z-10">
            <Sparkles className="mx-auto size-10 text-primary" />
            <h2 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to Build Cleaner Cities?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
              Join citizens across Pakistan using EcoMind AI to report waste, detect
              pollution, and coordinate municipal cleanup.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/assistant">
                <Button size="lg" className="h-12 px-8">
                  Report Waste Issue
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
              <Link href="/services">
                <Button size="lg" variant="outline" className="h-12 px-8">
                  Explore Environmental Services
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
