import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CIVICAI_PRODUCT_NAME } from "@/lib/civicai/brand";

export const metadata = {
  title: "FAQ",
  description: `Frequently asked questions about ${CIVICAI_PRODUCT_NAME}.`,
};

const FAQ_ITEMS = [
  {
    q: `Is ${CIVICAI_PRODUCT_NAME} just a chatbot?`,
    a: "No. EcoMind AI is an environmental decision assistant. It classifies incidents, identifies responsible authorities (LWMC, EPA, WASA), and produces structured reports — not open-ended conversation.",
  },
  {
    q: "What kinds of issues can I report?",
    a: "Illegal dumping, missed garbage collection, chemical waste, burning garbage, sewage overflow, air pollution, recycling requests, and 5 more environmental services across Lahore and Pakistan.",
  },
  {
    q: "Can I upload photos as evidence?",
    a: "Yes. Upload waste photos, municipal notices, or warning signs. Our OCR agent extracts text and the Compliance agent verifies evidence against official reporting requirements.",
  },
  {
    q: "Does EcoMind AI accuse individuals?",
    a: "Never. We provide careful advisories about illegal dumping indicators and compliance gaps — without accusing specific people or officials.",
  },
  {
    q: "Which authorities does it connect to?",
    a: "LWMC (Lahore Waste Management Company), EPA Punjab, WASA, and other municipal bodies. Maps show the nearest facility for your incident type.",
  },
  {
    q: "Is EcoMind AI free?",
    a: "Yes. EcoMind AI is free for citizens during the hackathon demo. The goal is accessible environmental reporting for all Pakistanis.",
  },
  {
    q: "Can I use EcoMind AI in Urdu?",
    a: "Urdu language support is planned. Currently the interface supports English with Urdu content in select areas like reports and advisories.",
  },
  {
    q: "How accurate is the AI?",
    a: "Every response includes a confidence score and source references. Always verify critical information with the responsible authority before taking action.",
  },
];

export default function FaqPage() {
  return (
    <main className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Frequently Asked Questions
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Everything you need to know about {CIVICAI_PRODUCT_NAME}.
        </p>
        <Accordion className="mt-12">
          {FAQ_ITEMS.map((item, i) => (
            <AccordionItem key={item.q} value={`item-${i}`}>
              <AccordionTrigger className="text-left">{item.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </main>
  );
}
