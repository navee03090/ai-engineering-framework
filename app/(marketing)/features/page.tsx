import { FeaturesGrid } from "@/components/civicai/landing/features-grid";
import { AgentArchitecture } from "@/components/civicai/landing/agent-architecture";
import { CtaSection } from "@/components/civicai/landing/cta-section";

export const metadata = {
  title: "Features",
  description:
    "Explore EcoMind AI features — incident classification, OCR evidence, maps, and PDF reports.",
};

export default function FeaturesPage() {
  return (
    <main>
      <section className="px-4 pb-8 pt-16 text-center sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Everything You Need for{" "}
            <span className="civic-gradient-text">Environmental Action</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            AI that predicts, prioritizes, and coordinates cleanup across Pakistan.
          </p>
        </div>
      </section>
      <FeaturesGrid />
      <AgentArchitecture />
      <CtaSection />
    </main>
  );
}
