import { AgentArchitecture } from "@/components/civicai/landing/agent-architecture";
import { CtaSection } from "@/components/civicai/landing/cta-section";
import { FeaturesGrid } from "@/components/civicai/landing/features-grid";
import { HeroSection } from "@/components/civicai/landing/hero";
import { HowItWorksTimeline } from "@/components/civicai/landing/how-it-works";
import { ServicesShowcase } from "@/components/civicai/landing/services-showcase";
import { StatsSection } from "@/components/civicai/landing/stats-section";
import { TestimonialsSection } from "@/components/civicai/landing/testimonials";

export default function LandingPage() {
  return (
    <main>
      <HeroSection />
      <StatsSection />
      <FeaturesGrid />
      <HowItWorksTimeline />
      <AgentArchitecture />
      <ServicesShowcase />
      <TestimonialsSection />
      <CtaSection />
    </main>
  );
}
