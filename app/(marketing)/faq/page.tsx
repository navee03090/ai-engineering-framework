import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata = {
  title: "FAQ",
  description: "Frequently asked questions about CivicAI.",
};

const FAQ_ITEMS = [
  {
    q: "Is CivicAI a chatbot?",
    a: "No. CivicAI is an AI Decision Assistant. It provides structured guidance — documents, fees, timelines, and checklists — not open-ended conversation.",
  },
  {
    q: "Is the government data official?",
    a: "For this demo, we use mock government data based on publicly known procedures. In production, data would be verified against official sources.",
  },
  {
    q: "Can CivicAI verify officer requests?",
    a: "Yes. Upload a photo of a handwritten officer note. Our OCR agent extracts document names and compares them against the official checklist.",
  },
  {
    q: "Does CivicAI accuse government officials?",
    a: "Never. We provide polite advisories to citizens when requested documents don't match official requirements, without making accusations.",
  },
  {
    q: "Which services are supported?",
    a: "13 essential services including driving license, passport, CNIC, birth/death/marriage certificates, domicile, tax registration, vehicle registration, property transfer, utilities, police complaints, and land records.",
  },
  {
    q: "Is CivicAI free?",
    a: "Yes. CivicAI is free for citizens during the hackathon demo. Future pricing will remain accessible for all Pakistanis.",
  },
  {
    q: "Can I use CivicAI in Urdu?",
    a: "Urdu language support is planned. Currently the interface supports English with Urdu content in select areas.",
  },
  {
    q: "How accurate is the AI?",
    a: "Every response includes a confidence score and source references. Always verify critical information at the official government office.",
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
          Everything you need to know about CivicAI.
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
