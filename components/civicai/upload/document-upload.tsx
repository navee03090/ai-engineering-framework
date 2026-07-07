"use client";

import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  Camera,
  CheckCircle2,
  FileImage,
  FileSearch,
  FileText,
  ImageIcon,
  Loader2,
  Upload,
  X,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { useCivicLanguage } from "@/components/providers/civic-language-provider";
import { StatusChip } from "@/components/civicai/shared";
import { PageHeader } from "@/components/civicai/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { verifyCivicDocument } from "@/lib/civicai/client";
import { GOVERNMENT_SERVICES } from "@/lib/civicai/data/services";
import type { DocumentStatus } from "@/lib/civicai/types";
import { cn } from "@/lib/utils";

type ExtractedDoc = { name: string; status: DocumentStatus };

export function DocumentUploadPanel() {
  const { language } = useCivicLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [serviceId, setServiceId] = useState("illegal-dumping");
  const [ocrProgress, setOcrProgress] = useState(0);
  const [ocrComplete, setOcrComplete] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [extractedDocs, setExtractedDocs] = useState<ExtractedDoc[]>([]);
  const [advisory, setAdvisory] = useState("");
  const [confidence, setConfidence] = useState<number | null>(null);
  const [ocrRawText, setOcrRawText] = useState("");
  const [ocrConfidence, setOcrConfidence] = useState<number | null>(null);
  const [ocrDocuments, setOcrDocuments] = useState<
    { name: string; normalizedName?: string; confidence?: number }[]
  >([]);
  const [missingDocuments, setMissingDocuments] = useState<string[]>([]);
  const [suspiciousRequests, setSuspiciousRequests] = useState<string[]>([]);
  const [reportId, setReportId] = useState<string | null>(null);

  const handleFile = useCallback(
    (f: File) => {
      if (!f.type.startsWith("image/")) {
        toast.error(
          language === "ur"
            ? "براہ کرم تصویر اپ لوڈ کریں"
            : "Please upload an image file"
        );
        return;
      }
      setFile(f);
      setPreview(URL.createObjectURL(f));
      setOcrComplete(false);
      setOcrProgress(0);
      setExtractedDocs([]);
      setAdvisory("");
      setConfidence(null);
      setOcrRawText("");
      setOcrConfidence(null);
      setOcrDocuments([]);
      setMissingDocuments([]);
      setSuspiciousRequests([]);
    },
    [language]
  );

  async function runOcr() {
    if (!file) return;
    setIsProcessing(true);
    setOcrProgress(0);

    const progressInterval = setInterval(() => {
      setOcrProgress((p) => Math.min(p + 8, 90));
    }, 400);

    try {
      const result = await verifyCivicDocument(file, { serviceId, language });
      clearInterval(progressInterval);
      setOcrProgress(100);
      setExtractedDocs(result.extractedDocuments);
      setAdvisory(result.advisory);
      setConfidence(result.confidence);
      setOcrRawText(result.ocrRawText ?? "");
      setOcrConfidence(result.ocrConfidence ?? null);
      setOcrDocuments(result.ocrDocuments ?? []);
      setMissingDocuments(result.missingDocuments ?? []);
      setSuspiciousRequests(result.suspiciousRequests ?? []);
      setReportId(result.reportId ?? null);
      setOcrComplete(true);
      toast.success(
        language === "ur" ? "ثبوت کا تجزیہ مکمل" : "Evidence analysis complete"
      );
    } catch (error) {
      clearInterval(progressInterval);
      const message = error instanceof Error ? error.message : "Verification failed";
      toast.error(message);
    } finally {
      setIsProcessing(false);
    }
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
      <PageHeader
        title={language === "ur" ? "کچرے کی تصویر اپ لوڈ" : "Upload Waste Photo"}
        description={
          language === "ur"
            ? "کچرے، نوٹس بورڈ، یا ماحولیاتی وارننگ کی تصویر اپ لوڈ کریں۔ EcoMind AI ثبوت کی تصدیق کرے گا۔"
            : "Upload a waste photo, notice board, or environmental warning. EcoMind AI will extract and verify evidence."
        }
      />

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-sm flex-1">
          <label className="mb-2 block text-sm font-medium">
            {language === "ur" ? "مسئلے کی قسم" : "Incident type"}
          </label>
          <Select
            value={serviceId}
            onValueChange={(v) => setServiceId(v ?? "illegal-dumping")}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {GOVERNMENT_SERVICES.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Card className="border-primary/20 bg-primary/5 sm:max-w-xs">
          <CardContent className="flex items-start gap-3 p-4">
            <Camera className="mt-0.5 size-4 shrink-0 text-primary" />
            <p className="text-xs leading-relaxed text-muted-foreground">
              {language === "ur"
                ? "واضح تصویر لیں — کچرا، مقام، اور کوئی نوٹس بورڈ نظر آئے۔"
                : "Take a clear photo showing waste, location landmarks, and any notice boards."}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="overflow-hidden">
          <CardHeader className="border-b border-border/60 bg-muted/30">
            <CardTitle className="flex items-center gap-2 text-base">
              <ImageIcon className="size-4 text-primary" />
              {language === "ur" ? "ثبوت کی تصویر" : "Evidence Photo"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              className={cn(
                "relative flex min-h-[280px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all",
                dragOver
                  ? "border-primary bg-primary/10 scale-[1.01]"
                  : "border-border hover:border-primary/40 hover:bg-muted/30"
              )}
            >
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 cursor-pointer opacity-0"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFile(f);
                }}
                aria-label="Upload document image"
              />
              {preview ? (
                <div className="relative w-full p-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={preview}
                    alt="Uploaded document preview"
                    className="mx-auto max-h-48 rounded-lg object-contain"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                      setPreview(null);
                      setOcrComplete(false);
                    }}
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10">
                    <Upload className="size-7 text-primary" />
                  </div>
                  <p className="mt-4 font-medium">
                    {language === "ur"
                      ? "تصویر یہاں ڈراپ کریں"
                      : "Drag & drop your photo here"}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {language === "ur"
                      ? "JPG, PNG — زیادہ سے زیادہ 10MB"
                      : "JPG, PNG — up to 10MB"}
                  </p>
                </>
              )}
            </div>

            {file && !ocrComplete && (
              <Button onClick={runOcr} disabled={isProcessing} className="w-full">
                {isProcessing ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    {language === "ur" ? "OCR جاری ہے..." : "Processing OCR..."}
                  </>
                ) : (
                  <>
                    <FileImage className="size-4" />
                    {language === "ur" ? "تصویر کا تجزیہ" : "Analyze Image"}
                  </>
                )}
              </Button>
            )}

            {isProcessing && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{language === "ur" ? "OCR پیش رفت" : "OCR Progress"}</span>
                  <span>{ocrProgress}%</span>
                </div>
                <Progress value={ocrProgress} />
              </div>
            )}
          </CardContent>
        </Card>

        {!ocrComplete && (
          <Card className="hidden border-dashed lg:flex lg:flex-col lg:items-center lg:justify-center lg:bg-muted/20">
            <CardContent className="flex flex-col items-center p-8 text-center">
              <FileSearch className="size-10 text-muted-foreground/50" />
              <p className="mt-4 font-medium text-muted-foreground">
                {language === "ur"
                  ? "تجزیہ کا نتیجہ یہاں ظاہر ہوگا"
                  : "Analysis results will appear here"}
              </p>
              <p className="mt-2 max-w-xs text-sm text-muted-foreground/80">
                {language === "ur"
                  ? "تصویر اپ لوڈ کریں اور OCR تجزیہ شروع کریں"
                  : "Upload a photo and run OCR analysis to see extracted evidence, compliance score, and advisory."}
              </p>
            </CardContent>
          </Card>
        )}

        <AnimatePresence>
          {ocrComplete && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              {confidence !== null && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">
                        {language === "ur" ? "تطابق کا اعتماد" : "Compliance Score"}
                      </span>
                      <span className="font-bold text-primary">{confidence}%</span>
                    </div>
                    <Progress value={confidence} className="mt-2 h-2" />
                  </CardContent>
                </Card>
              )}

              {(ocrRawText || ocrDocuments.length > 0) && (
                <Card className="border-primary/20 bg-primary/5">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <FileSearch className="size-5 text-primary" />
                      {language === "ur" ? "OCR ذہانت" : "OCR Intelligence"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {ocrConfidence !== null && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          {language === "ur" ? "OCR اعتماد" : "OCR Confidence"}
                        </span>
                        <span className="font-bold">{ocrConfidence}%</span>
                      </div>
                    )}
                    {ocrRawText && (
                      <div>
                        <p className="mb-2 text-sm font-medium">
                          {language === "ur" ? "نکالا گیا متن" : "Extracted Text"}
                        </p>
                        <pre className="max-h-32 overflow-auto rounded-lg border border-border/60 bg-background p-3 text-xs leading-relaxed whitespace-pre-wrap">
                          {ocrRawText}
                        </pre>
                      </div>
                    )}
                    {ocrDocuments.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium">
                          {language === "ur"
                            ? "پہچانی گئی دستاویزات"
                            : "Detected Evidence"}
                        </p>
                        {ocrDocuments.map((doc) => (
                          <div
                            key={doc.name}
                            className="flex items-center justify-between rounded-lg border border-border/60 bg-background px-3 py-2 text-sm"
                          >
                            <span>{doc.normalizedName ?? doc.name}</span>
                            {doc.confidence !== undefined && (
                              <span className="text-muted-foreground">
                                {doc.confidence}%
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <CheckCircle2 className="size-5 text-emerald-500" />
                    {language === "ur" ? "نکالا گیا ثبوت" : "Extracted Evidence"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {extractedDocs.map((doc) => (
                    <div
                      key={doc.name}
                      className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2"
                    >
                      <span className="text-sm">{doc.name}</span>
                      <StatusChip status={doc.status} />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {missingDocuments.length > 0 && (
                <Card className="border-red-500/20">
                  <CardHeader>
                    <CardTitle className="text-base text-red-600 dark:text-red-400">
                      {language === "ur" ? "غائب ثبوت" : "Missing Evidence"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      {missingDocuments.map((doc) => (
                        <li key={doc}>• {doc}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {suspiciousRequests.length > 0 && (
                <Card className="border-amber-500/20 bg-amber-500/5">
                  <CardHeader>
                    <CardTitle className="text-base text-amber-700 dark:text-amber-400">
                      {language === "ur"
                        ? "سرکاری فہرست میں نہیں"
                        : "Not on Official List"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      {suspiciousRequests.map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {advisory && (
                <Card className="border-amber-500/20 bg-amber-500/5">
                  <CardContent className="flex gap-3 pt-6">
                    <AlertTriangle className="size-5 shrink-0 text-amber-500" />
                    <div className="text-sm">
                      <p className="font-medium">
                        {language === "ur" ? "مشورہ" : "Advisory"}
                      </p>
                      <p className="mt-1 text-muted-foreground">{advisory}</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Link href={reportId ? `/reports/${reportId}` : "/reports/demo"}>
                <Button className="w-full" size="lg">
                  <FileText className="size-4" />
                  {language === "ur" ? "PDF رپورٹ دیکھیں" : "View PDF Report"}
                </Button>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
