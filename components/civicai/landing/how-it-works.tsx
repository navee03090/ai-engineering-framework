import { AnimatedCard } from "@/components/civicai/shared";
import { Badge } from "@/components/ui/badge";

const STEPS = [
  {
    step: "01",
    title: "Report the Issue",
    description:
      'Tell EcoMind AI what you see — e.g. "There is illegal dumping near Ring Road."',
  },
  {
    step: "02",
    title: "AI Classifies Intent",
    description:
      "Intent Agent identifies the environmental issue type and responsible authority.",
  },
  {
    step: "03",
    title: "Get Cleanup Guidance",
    description:
      "Receive citizen checklist, safety tips, map location, and estimated response time.",
  },
  {
    step: "04",
    title: "Upload Evidence (Optional)",
    description:
      "Upload a waste photo or municipal notice. OCR extracts text and Compliance verifies evidence.",
  },
  {
    step: "05",
    title: "Generate Incident Report",
    description:
      "Download PDF, email report to authorities, and track status on your dashboard.",
  },
];

export function HowItWorksTimeline() {
  return (
    <section className="bg-muted/30 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <Badge variant="secondary" className="mb-4">
            How It Works
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            From Report to Cleanup in 5 Steps
          </h2>
        </div>
        <div className="relative mt-14">
          <div className="absolute left-6 top-0 hidden h-full w-px bg-border sm:left-8 sm:block" />
          <div className="space-y-8">
            {STEPS.map((item, i) => (
              <AnimatedCard key={item.step} delay={i * 0.1}>
                <div className="relative flex gap-6 sm:gap-8">
                  <div className="relative z-10 flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-sm font-bold text-primary-foreground shadow-md sm:size-16 sm:text-base">
                    {item.step}
                  </div>
                  <div className="flex-1 rounded-2xl border border-border/60 bg-background p-6 shadow-sm">
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    <p className="mt-2 text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
