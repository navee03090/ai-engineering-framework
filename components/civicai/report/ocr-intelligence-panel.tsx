import { FileSearch } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { OcrIntelligence } from "@/lib/civicai/types";

export function OcrIntelligencePanel({ ocr }: { ocr: OcrIntelligence }) {
  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <FileSearch className="size-5 text-primary" />
          OCR Intelligence
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {ocr.overallConfidence !== undefined && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">OCR Confidence</span>
            <Badge variant="secondary">{ocr.overallConfidence}%</Badge>
          </div>
        )}

        {ocr.rawText && (
          <div>
            <p className="mb-2 text-sm font-medium">Extracted Text</p>
            <pre className="max-h-40 overflow-auto rounded-lg border border-border/60 bg-background p-3 text-xs leading-relaxed whitespace-pre-wrap">
              {ocr.rawText}
            </pre>
          </div>
        )}

        {ocr.documents && ocr.documents.length > 0 && (
          <div>
            <p className="mb-2 text-sm font-medium">Detected Documents</p>
            <div className="space-y-2">
              {ocr.documents.map((doc) => (
                <div
                  key={doc.name}
                  className="flex items-center justify-between rounded-lg border border-border/60 bg-background px-3 py-2 text-sm"
                >
                  <span>{doc.normalizedName ?? doc.name}</span>
                  {doc.confidence !== undefined && (
                    <Badge variant="outline">{doc.confidence}%</Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {ocr.suspiciousRequests && ocr.suspiciousRequests.length > 0 && (
          <div>
            <p className="mb-2 text-sm font-medium text-amber-700 dark:text-amber-400">
              Documents Not on Official List
            </p>
            <ul className="space-y-1 text-sm text-muted-foreground">
              {ocr.suspiciousRequests.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
        )}

        {ocr.advisory && (
          <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Advisory: </span>
            {ocr.advisory}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
