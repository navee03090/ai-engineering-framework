"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Search, Sparkles } from "lucide-react";
import { useState } from "react";

import { AnimatedBackground } from "@/components/civicai/animated-background";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const SUGGESTIONS = [
  "Renew my driving license",
  "Passport application documents",
  "CNIC correction procedure",
  "Property transfer in Punjab",
];

export function HeroSection() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim() || SUGGESTIONS[0];
    router.push(`/assistant?q=${encodeURIComponent(q)}`);
  }

  return (
    <section className="relative overflow-hidden px-4 pb-24 pt-16 sm:px-6 sm:pt-24 lg:px-8">
      <AnimatedBackground />
      <div className="relative mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            <Sparkles className="size-4" />
            AI Decision Assistant — Not a Chatbot
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Navigate Pakistan&apos;s{" "}
            <span className="civic-gradient-text">Government Services</span> with
            Confidence
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            CivicAI guides you through official procedures — documents, fees, timelines,
            and scam warnings — so you never need a middleman again.
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleSearch}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mx-auto mt-10 max-w-2xl"
        >
          <div className="glass flex flex-col gap-3 rounded-2xl p-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="I want to renew my driving license..."
                className="h-12 border-0 bg-transparent pl-10 text-base shadow-none focus-visible:ring-0"
                aria-label="Ask CivicAI a question"
              />
            </div>
            <Button type="submit" size="lg" className="h-12 px-6">
              Ask CivicAI
              <ArrowRight className="size-4" />
            </Button>
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setQuery(s)}
                className="rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground"
              >
                {s}
              </button>
            ))}
          </div>
        </motion.form>
      </div>
    </section>
  );
}
