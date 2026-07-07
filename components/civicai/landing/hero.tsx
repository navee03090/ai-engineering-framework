"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowRight,
  FileText,
  Leaf,
  MapPin,
  Mic,
  Search,
  Sparkles,
} from "lucide-react";
import { useState } from "react";

import { AnimatedBackground } from "@/components/civicai/animated-background";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const SUGGESTIONS = [
  "There is illegal dumping near Ring Road",
  "My street garbage has not been collected",
  "I found chemical waste near my home",
  "There is smoke from burning garbage",
];

const TRUST_ITEMS = [
  { icon: Sparkles, label: "6 AI Agents" },
  { icon: Mic, label: "Voice Input" },
  { icon: MapPin, label: "Live Maps" },
  { icon: FileText, label: "PDF Reports" },
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
            <Leaf className="size-4" />
            EcoMind AI — Pakistan&apos;s Waste Command Center
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            <span className="civic-gradient-text">Cleaner Cities</span> Through AI
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Report environmental issues, identify responsible authorities, and receive
            AI-powered guidance for a cleaner Pakistan.
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleSearch}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mx-auto mt-10 max-w-2xl"
        >
          <div className="glass flex flex-col gap-3 rounded-2xl p-3 shadow-lg shadow-primary/5 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="There is illegal dumping near my home..."
                className="h-12 border-0 bg-transparent pl-10 text-base shadow-none focus-visible:ring-0"
                aria-label="Report an environmental issue to EcoMind AI"
              />
            </div>
            <Button type="submit" size="lg" className="h-12 px-6 shadow-md">
              Report Waste Issue
              <ArrowRight className="size-4" />
            </Button>
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setQuery(s)}
                className="rounded-full border border-border bg-background/80 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur transition-all hover:border-primary/40 hover:bg-primary/5 hover:text-foreground"
              >
                {s}
              </button>
            ))}
          </div>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/services">
              <Button variant="outline" size="lg" className="h-11">
                Explore Environmental Services
              </Button>
            </Link>
            <Link href="/reports/demo">
              <Button variant="ghost" size="lg" className="h-11 text-muted-foreground">
                View sample incident report
              </Button>
            </Link>
          </div>
        </motion.form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="mx-auto mt-12 flex max-w-lg flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground"
        >
          {TRUST_ITEMS.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2">
              <Icon className="size-4 text-primary" />
              <span>{label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
