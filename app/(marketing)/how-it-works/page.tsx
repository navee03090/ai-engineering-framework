import { HowItWorksTimeline } from "@/components/civicai/landing/how-it-works";
import { CtaSection } from "@/components/civicai/landing/cta-section";
import { ServicesShowcase } from "@/components/civicai/landing/services-showcase";

export const metadata = {
  title: "How It Works",
  description:
    "See how CivicAI guides you through Pakistan government services in 5 simple steps.",
};

export default function HowItWorksPage() {
  return (
    <main>
      <section className="px-4 pb-8 pt-16 text-center sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            How CivicAI Works
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            From your question to a complete government service report in minutes.
          </p>
        </div>
      </section>
      <HowItWorksTimeline />
      <ServicesShowcase />
      <CtaSection />
    </main>
  );
}
