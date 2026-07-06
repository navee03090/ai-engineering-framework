import { FeaturesGrid } from "@/components/civicai/landing/features-grid";
import { AgentArchitecture } from "@/components/civicai/landing/agent-architecture";
import { CtaSection } from "@/components/civicai/landing/cta-section";

export const metadata = {
  title: "Features",
  description:
    "Explore CivicAI features — AI guidance, document verification, and scam warnings.",
};

export default function FeaturesPage() {
  return (
    <main>
      <section className="px-4 pb-8 pt-16 text-center sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Everything You Need for{" "}
            <span className="civic-gradient-text">Civic Navigation</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Premium government technology designed for Pakistani citizens.
          </p>
        </div>
      </section>
      <FeaturesGrid />
      <AgentArchitecture />
      <CtaSection />
    </main>
  );
}
