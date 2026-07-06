"use client";

import { Download, Printer, Share2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  downloadCivicReportPdf,
  printCivicReportPdf,
  shareCivicReportPdf,
} from "@/lib/civicai/generate-pdf";
import type { CivicReport } from "@/lib/civicai/types";

export function ReportActions({ report }: { report: CivicReport }) {
  async function handleShare() {
    try {
      await shareCivicReportPdf(report);
    } catch {
      toast.error("Sharing is not supported on this device. PDF downloaded instead.");
      downloadCivicReportPdf(report);
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          downloadCivicReportPdf(report);
          toast.success("PDF downloaded");
        }}
      >
        <Download className="size-4" />
        Download PDF
      </Button>
      <Button variant="outline" size="sm" onClick={() => printCivicReportPdf(report)}>
        <Printer className="size-4" />
        Print
      </Button>
      <Button variant="outline" size="sm" onClick={handleShare}>
        <Share2 className="size-4" />
        Share
      </Button>
    </div>
  );
}
