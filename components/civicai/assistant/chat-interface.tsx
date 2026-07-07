"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  CheckCircle2,
  FileText,
  Mic,
  MicOff,
  Paperclip,
  Send,
  Sparkles,
  Upload,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { AgentPipelinePanel } from "@/components/civicai/assistant/agent-pipeline-panel";
import { ProgressiveSolutionStack } from "@/components/civicai/assistant/progressive-solution";
import { OfficeMap } from "@/components/civicai/maps/office-map";
import { useCivicLanguage } from "@/components/providers/civic-language-provider";
import { StatusChip } from "@/components/civicai/shared";
import { PageHeader } from "@/components/civicai/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  askCivicAssistantStream,
  streamTextEffect,
  type AssistantApiResponse,
} from "@/lib/civicai/client";
import {
  createInitialAgentSteps,
  type AgentStepState,
  type AssistantPartialPayload,
  type AssistantStreamEvent,
} from "@/lib/civicai/assistant-stream";
import { getPopularServices } from "@/lib/civicai/data/services";
import type { ChatMessage, DocumentStatus } from "@/lib/civicai/types";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { cn } from "@/lib/utils";

const SUGGESTIONS_EN = [
  "There is illegal dumping near Ring Road",
  "My street garbage has not been collected",
  "I found chemical waste near my home",
  "There is smoke from burning garbage",
  "My drain is blocked",
];

const SUGGESTIONS_UR = [
  "میرے گھر کے قریب غیر قانونی ڈمپنگ ہے",
  "میرے گلی کا کچرا نہیں اٹھایا گیا",
  "میں نے کیمیائی فضلہ پایا",
  "کچرا جلنے سے دھواں آ رہا ہے",
  "میرا نالہ بند ہے",
];

export function AssistantChat() {
  const searchParams = useSearchParams();
  const { language } = useCivicLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [agentSteps, setAgentSteps] = useState<AgentStepState[]>(createInitialAgentSteps);
  const [partials, setPartials] = useState<AssistantPartialPayload[]>([]);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [checklist, setChecklist] = useState<
    { name: string; status: DocumentStatus }[]
  >([]);
  const [sources, setSources] = useState<{ title: string; url: string }[]>([]);
  const [lastReportId, setLastReportId] = useState<string | null>(null);
  const [officeLocation, setOfficeLocation] =
    useState<AssistantApiResponse["officeLocation"]>();
  const initialQueryHandled = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const services = getPopularServices();
  const suggestions = language === "ur" ? SUGGESTIONS_UR : SUGGESTIONS_EN;

  const handleTranscript = useCallback((text: string) => {
    setInput(text);
  }, []);

  const handleSpeechError = useCallback((message: string) => {
    toast.error(message);
  }, []);

  const { isListening, isSupported, toggleListening, stopListening } =
    useSpeechRecognition({
      language,
      onTranscript: handleTranscript,
      onError: handleSpeechError,
    });

  useEffect(() => {
    if (isListening) {
      stopListening();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  useEffect(() => {
    const q = searchParams.get("q");
    if (q && !initialQueryHandled.current) {
      initialQueryHandled.current = true;
      setInput(q);
      void handleSend(q);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingText, isTyping, partials, agentSteps]);

  function applyPartialToSidebar(data: AssistantPartialPayload) {
    if (data.stage === "intent") {
      setConfidence(data.confidence);
    }
    if (data.stage === "recommendation") {
      setChecklist(data.checklist);
    }
  }

  function handleStreamEvent(event: AssistantStreamEvent) {
    if (event.type === "agent_start") {
      setAgentSteps((prev) =>
        prev.map((step) => {
          if (step.id === event.agent) {
            return { ...step, status: "running" };
          }
          const agentIndex = event.step - 1;
          const stepIndex = prev.findIndex((s) => s.id === step.id);
          if (stepIndex < agentIndex && step.status === "pending") {
            return { ...step, status: "done" };
          }
          return step;
        })
      );
      return;
    }

    if (event.type === "agent_complete") {
      setAgentSteps((prev) =>
        prev.map((step) =>
          step.id === event.agent
            ? {
                ...step,
                status: event.success ? "done" : "error",
                summary: event.summary,
              }
            : step
        )
      );
      return;
    }

    if (event.type === "partial") {
      setPartials((prev) => {
        const next = prev.filter((item) => item.stage !== event.data.stage);
        return [...next, event.data];
      });
      applyPartialToSidebar(event.data);
    }
  }

  async function handleSend(text?: string) {
    const content = (text ?? input).trim();
    if (!content || isTyping) return;

    if (isListening) {
      stopListening();
    }

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    setStreamingText("");
    setConfidence(null);
    setChecklist([]);
    setSources([]);
    setOfficeLocation(undefined);
    setAgentSteps(createInitialAgentSteps());
    setPartials([]);

    try {
      const result = await askCivicAssistantStream(content, language, handleStreamEvent);
      applyAssistantResult(result);

      await streamTextEffect(result.answer, setStreamingText);

      setIsTyping(false);
      const assistantMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: result.answer,
        timestamp: new Date().toISOString(),
        confidence: result.confidence,
        sources: result.sources,
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setStreamingText("");
    } catch (error) {
      setIsTyping(false);
      setStreamingText("");
      setAgentSteps((prev) =>
        prev.map((step) =>
          step.status === "running" ? { ...step, status: "error" } : step
        )
      );
      const message = error instanceof Error ? error.message : "Request failed";
      toast.error(message);
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            language === "ur"
              ? "معذرت، AI اس وقت دستیاب نہیں ہے۔ براہ کرم GEMINI_API_KEY چیک کریں۔"
              : "Sorry, the AI assistant is unavailable. Please check GEMINI_API_KEY configuration.",
          timestamp: new Date().toISOString(),
        },
      ]);
    }
  }

  function applyAssistantResult(result: AssistantApiResponse) {
    setConfidence(result.confidence);
    setChecklist(result.checklist);
    setSources(result.sources);
    setLastReportId(result.reportId ?? null);
    setOfficeLocation(result.officeLocation);
  }

  const placeholder =
    language === "ur"
      ? "ماحولیاتی مسئلے کی رپورٹ کریں..."
      : "Report an environmental issue...";

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <PageHeader
        title={language === "ur" ? "ماحولیاتی AI معاون" : "Environmental AI Assistant"}
        description={
          language === "ur"
            ? "کچرا، آلودگی، یا ماحولیاتی مسائل کی رپورٹ کریں — واضح رہنمائی حاصل کریں۔"
            : "Report waste, pollution, or environmental issues. Get structured guidance, not vague chat."
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="flex h-[calc(100vh-14rem)] flex-col overflow-hidden">
            <ScrollArea className="min-h-0 flex-1">
              <div className="space-y-4 p-4">
              {messages.length === 0 && !isTyping && (
                <div className="flex min-h-[320px] flex-col items-center justify-center py-8 text-center">
                  <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-4 ring-primary/10">
                    <Sparkles className="size-8" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">
                    {language === "ur"
                      ? "EcoMind AI کیسے مدد کرے؟"
                      : "How can EcoMind AI help you?"}
                  </h3>
                  <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                    {language === "ur"
                      ? "غیر قانونی ڈمپنگ، کچرا، آلودگی کی رپورٹ کریں یا ثبوت اپ لوڈ کریں۔"
                      : "Report illegal dumping, garbage issues, pollution, or upload evidence for analysis."}
                  </p>
                  <p className="mt-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {language === "ur" ? "مثال کے سوالات" : "Try a demo query"}
                  </p>
                  <div className="mt-3 flex max-w-md flex-wrap justify-center gap-2">
                    {suggestions.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => handleSend(s)}
                        className="rounded-full border border-border bg-background px-3 py-1.5 text-xs transition-all hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                  <p className="mt-6 text-xs text-muted-foreground">
                    {language === "ur"
                      ? "مائیک دبائیں یا ٹائپ کریں — 6 AI ایجنٹس آپ کی مدد کریں گے"
                      : "Use the mic or type — 6 AI agents will classify and guide you"}
                  </p>
                </div>
              )}

                <AnimatePresence>
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        "flex gap-3",
                        msg.role === "user" ? "justify-end" : "justify-start"
                      )}
                    >
                      {msg.role === "assistant" && (
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Bot className="size-4" />
                        </div>
                      )}
                      <div
                        className={cn(
                          "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                          msg.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        )}
                      >
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                        {msg.confidence !== undefined && (
                          <div className="mt-2 flex items-center gap-2 text-xs opacity-80">
                            <CheckCircle2 className="size-3" />
                            {msg.confidence}% confidence
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {isTyping && partials.length > 0 && (
                  <ProgressiveSolutionStack partials={partials} language={language} />
                )}

                {isTyping && streamingText && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-3"
                  >
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Bot className="size-4" />
                    </div>
                    <div className="max-w-[85%] rounded-2xl bg-muted px-4 py-3 text-sm leading-relaxed">
                      <p className="whitespace-pre-wrap">{streamingText}</p>
                      <span className="inline-block h-4 w-0.5 animate-pulse bg-primary" />
                    </div>
                  </motion.div>
                )}

                <div ref={scrollRef} />
              </div>
            </ScrollArea>

            {isTyping && (
              <div className="shrink-0 border-t border-border/60 bg-muted/20 px-4 py-3">
                <AgentPipelinePanel steps={agentSteps} language={language} />
              </div>
            )}

            <div className="shrink-0 border-t border-border/60 p-4">
              {isListening && (
                <p className="mb-2 flex items-center gap-2 text-xs text-primary">
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75" />
                    <span className="relative inline-flex size-2 rounded-full bg-primary" />
                  </span>
                  {language === "ur"
                    ? "سن رہا ہے… (انگریزی حروف میں ظاہر ہو سکتا ہے — AI سمجھ جائے گا) پھر بھیجیں دبائیں"
                    : "Listening… click mic to stop, then press Send when ready"}
                </p>
              )}
              <div className="flex gap-2">
                <Link href="/upload">
                  <Button variant="outline" size="icon" aria-label="Upload document">
                    <Paperclip className="size-4" />
                  </Button>
                </Link>
                <Button
                  variant={isListening ? "default" : "outline"}
                  size="icon"
                  aria-label={
                    isListening
                      ? language === "ur"
                        ? "آواز بند کریں"
                        : "Stop voice input"
                      : language === "ur"
                        ? "آواز سے لکھیں"
                        : "Voice input"
                  }
                  aria-pressed={isListening}
                  disabled={!isSupported || isTyping}
                  onClick={() => {
                    if (!isSupported) {
                      toast.error(
                        language === "ur"
                          ? "یہ براؤزر آواز سپورٹ نہیں کرتا۔ Chrome یا Edge استعمال کریں۔"
                          : "Voice input needs Chrome or Edge browser."
                      );
                      return;
                    }
                    const wasListening = isListening;
                    toggleListening();
                    if (!wasListening) {
                      toast.message(
                        language === "ur"
                          ? "اردو میں بولیں — متن انگریزی حروف میں آ سکتا ہے، پھر بھیجیں دبائیں"
                          : "Speak now — text will appear below, then click Send"
                      );
                    }
                  }}
                  className={cn(isListening && "animate-pulse")}
                >
                  {isListening ? (
                    <MicOff className="size-4" />
                  ) : (
                    <Mic className="size-4" />
                  )}
                </Button>
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder={placeholder}
                  className="flex-1"
                  disabled={isTyping}
                />
                <Button
                  onClick={() => handleSend()}
                  disabled={isTyping || !input.trim()}
                >
                  <Send className="size-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          {confidence !== null && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">
                  {language === "ur" ? "اعتماد" : "Confidence"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-primary">{confidence}%</span>
                  <Badge variant="secondary">
                    {confidence >= 80 ? "High" : confidence >= 60 ? "Medium" : "Low"}
                  </Badge>
                </div>
                <Progress value={confidence} className="mt-2 h-2" />
              </CardContent>
            </Card>
          )}

          {checklist.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">
                  {language === "ur" ? "شہری چیک لسٹ" : "Citizen Checklist"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {checklist.map((doc) => (
                  <div
                    key={doc.name}
                    className="flex items-center justify-between gap-2 text-sm"
                  >
                    <span className="truncate">{doc.name}</span>
                    <StatusChip status={doc.status} />
                  </div>
                ))}
                <Link href="/checklist">
                  <Button variant="outline" size="sm" className="mt-2 w-full">
                    <FileText className="size-4" />
                    {language === "ur" ? "مکمل چیک لسٹ" : "Full Checklist"}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {sources.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">
                  {language === "ur" ? "ذرائع" : "Sources"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {sources.map((s) => (
                  <a
                    key={s.title}
                    href={s.url}
                    className="block text-sm text-primary hover:underline"
                  >
                    {s.title}
                  </a>
                ))}
              </CardContent>
            </Card>
          )}

          {officeLocation && (
            <OfficeMap
              location={officeLocation}
              title={language === "ur" ? "قریبی سہولت" : "Nearest Facility"}
              height={220}
            />
          )}

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">
                {language === "ur" ? "فوری اقدامات" : "Quick Actions"}
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              <Link href="/upload">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Upload className="size-4" />
                  {language === "ur" ? "کچرے کی تصویر اپ لوڈ کریں" : "Upload Waste Photo"}
                </Button>
              </Link>
              <Link href={lastReportId ? `/reports/${lastReportId}` : "/reports/demo"}>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <FileText className="size-4" />
                  {language === "ur" ? "رپورٹ دیکھیں" : "View Report"}
                </Button>
              </Link>
            </CardContent>
          </Card>

          <div className="grid gap-2">
            {services.slice(0, 3).map((s) => (
              <Link key={s.id} href={`/services?highlight=${s.id}`}>
                <Card className="p-3 transition-colors hover:bg-muted/50">
                  <p className="text-sm font-medium">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.fee}</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
