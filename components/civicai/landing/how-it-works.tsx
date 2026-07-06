import { AnimatedCard } from "@/components/civicai/shared";
import { Badge } from "@/components/ui/badge";

const STEPS = [
  {
    step: "01",
    title: "Ask Your Question",
    description:
      'Tell CivicAI what you need — e.g. "I want to renew my driving license."',
  },
  {
    step: "02",
    title: "AI Understands Intent",
    description:
      "Our decision assistant identifies the service, department, and official procedure.",
  },
  {
    step: "03",
    title: "Get Structured Guidance",
    description:
      "Receive documents, fees, timeline, checklist, and scam warnings — all in one report.",
  },
  {
    step: "04",
    title: "Verify Documents (Optional)",
    description:
      "Upload an officer's handwritten note. OCR compares requested docs against the official list.",
  },
  {
    step: "05",
    title: "Visit with Confidence",
    description:
      "Arrive prepared with the right documents and knowledge of official fees. No middleman needed.",
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
            From Confusion to Confidence in 5 Steps
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
