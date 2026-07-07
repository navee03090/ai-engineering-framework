import { jsPDF } from "jspdf";

import { CIVICAI_FULL_TITLE, CIVICAI_PRODUCT_NAME } from "@/lib/civicai/brand";
import type { CivicReport } from "@/lib/civicai/types";

const MARGIN = 20;
const PAGE_WIDTH = 210;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
const LINE_HEIGHT = 6;

function addWrappedText(
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  fontSize = 10
): number {
  doc.setFontSize(fontSize);
  const lines = doc.splitTextToSize(text, maxWidth) as string[];
  doc.text(lines, x, y);
  return y + lines.length * LINE_HEIGHT;
}

function ensureSpace(doc: jsPDF, y: number, needed: number): number {
  if (y + needed > 280) {
    doc.addPage();
    return MARGIN;
  }
  return y;
}

export function generateCivicReportPdf(report: CivicReport): jsPDF {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  let y = MARGIN;

  // Header
  doc.setFillColor(16, 185, 129);
  doc.rect(0, 0, PAGE_WIDTH, 28, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.text(CIVICAI_PRODUCT_NAME, MARGIN, 12);
  doc.setFontSize(11);
  doc.text(report.pdfTitle ?? report.serviceName, MARGIN, 20);
  doc.setFontSize(8);
  doc.text(
    `Generated ${new Date(report.createdAt).toLocaleDateString("en-PK")} · ${report.confidence}% confidence`,
    MARGIN,
    26
  );

  doc.setTextColor(30, 30, 30);
  y = 38;

  // Summary
  if (report.summary) {
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Environmental Incident Summary", MARGIN, y);
    y += 8;
    doc.setFont("helvetica", "normal");
    y = ensureSpace(doc, y, 30);
    y = addWrappedText(doc, report.summary, MARGIN, y, CONTENT_WIDTH, 10) + 6;
  }

  // Service details
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  y = ensureSpace(doc, y, 20);
  doc.text("Service Details", MARGIN, y);
  y += 8;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  const details = [
    `Department: ${report.department}`,
    `Official Fee: ${report.fee}`,
    `Processing Time: ${report.processingTime}`,
    `Report Type: ${report.reportType ?? "query"}`,
  ];
  for (const line of details) {
    y = ensureSpace(doc, y, LINE_HEIGHT);
    doc.text(line, MARGIN, y);
    y += LINE_HEIGHT;
  }
  y += 4;

  // OCR Intelligence section
  if (report.ocrIntelligence) {
    y = ensureSpace(doc, y, 20);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(16, 185, 129);
    doc.text("OCR Intelligence", MARGIN, y);
    doc.setTextColor(30, 30, 30);
    y += 8;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    if (report.ocrIntelligence.overallConfidence !== undefined) {
      y = ensureSpace(doc, y, LINE_HEIGHT);
      doc.text(
        `OCR Confidence: ${report.ocrIntelligence.overallConfidence}%`,
        MARGIN,
        y
      );
      y += LINE_HEIGHT;
    }

    if (report.ocrIntelligence.rawText) {
      y = ensureSpace(doc, y, 15);
      doc.setFont("helvetica", "bold");
      doc.text("Extracted Text:", MARGIN, y);
      y += 6;
      doc.setFont("helvetica", "normal");
      y =
        addWrappedText(
          doc,
          report.ocrIntelligence.rawText,
          MARGIN,
          y,
          CONTENT_WIDTH,
          9
        ) + 4;
    }

    if (report.ocrIntelligence.documents?.length) {
      y = ensureSpace(doc, y, 10);
      doc.setFont("helvetica", "bold");
      doc.text("Detected Evidence:", MARGIN, y);
      y += 6;
      doc.setFont("helvetica", "normal");
      for (const doc_item of report.ocrIntelligence.documents) {
        y = ensureSpace(doc, y, LINE_HEIGHT);
        const conf =
          doc_item.confidence !== undefined ? ` (${doc_item.confidence}%)` : "";
        doc.text(`• ${doc_item.normalizedName ?? doc_item.name}${conf}`, MARGIN + 2, y);
        y += LINE_HEIGHT;
      }
      y += 2;
    }

    if (report.ocrIntelligence.advisory) {
      y = ensureSpace(doc, y, 15);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(180, 120, 0);
      doc.text("Advisory:", MARGIN, y);
      y += 6;
      doc.setFont("helvetica", "normal");
      doc.setTextColor(30, 30, 30);
      y =
        addWrappedText(
          doc,
          report.ocrIntelligence.advisory,
          MARGIN,
          y,
          CONTENT_WIDTH,
          9
        ) + 4;
    }
  }

  // PDF sections from Report Agent
  if (report.pdfSections?.length) {
    for (const section of report.pdfSections) {
      y = ensureSpace(doc, y, 20);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(section.heading, MARGIN, y);
      y += 8;
      doc.setFont("helvetica", "normal");
      y = addWrappedText(doc, section.body, MARGIN, y, CONTENT_WIDTH, 10) + 6;
    }
  }

  // Required documents
  if (report.requiredDocuments.length) {
    y = ensureSpace(doc, y, 20);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Citizen Checklist", MARGIN, y);
    y += 8;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    for (const doc_item of report.requiredDocuments) {
      y = ensureSpace(doc, y, LINE_HEIGHT);
      doc.text(`• ${doc_item.name} [${doc_item.status}]`, MARGIN, y);
      y += LINE_HEIGHT;
    }
    y += 4;
  }

  // Missing documents
  if (report.missingDocuments.length) {
    y = ensureSpace(doc, y, 15);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(200, 50, 50);
    doc.text("Missing Evidence", MARGIN, y);
    doc.setTextColor(30, 30, 30);
    y += 7;
    doc.setFont("helvetica", "normal");
    for (const missing of report.missingDocuments) {
      y = ensureSpace(doc, y, LINE_HEIGHT);
      doc.text(`• ${missing}`, MARGIN, y);
      y += LINE_HEIGHT;
    }
    y += 4;
  }

  // Timeline
  if (report.timeline.length) {
    y = ensureSpace(doc, y, 20);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Procedure Timeline", MARGIN, y);
    y += 8;
    doc.setFont("helvetica", "normal");
    for (const step of report.timeline) {
      y = ensureSpace(doc, y, 15);
      doc.setFont("helvetica", "bold");
      doc.text(`${step.step}${step.duration ? ` (${step.duration})` : ""}`, MARGIN, y);
      y += 5;
      doc.setFont("helvetica", "normal");
      y = addWrappedText(doc, step.description, MARGIN, y, CONTENT_WIDTH, 9) + 4;
    }
  }

  // Warnings
  if (report.warnings.length) {
    y = ensureSpace(doc, y, 15);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(180, 120, 0);
    doc.text("Warnings", MARGIN, y);
    doc.setTextColor(30, 30, 30);
    y += 7;
    doc.setFont("helvetica", "normal");
    for (const warning of report.warnings) {
      y = ensureSpace(doc, y, LINE_HEIGHT);
      y = addWrappedText(doc, `• ${warning}`, MARGIN, y, CONTENT_WIDTH, 9) + 2;
    }
  }

  // Tips
  if (report.tips.length) {
    y = ensureSpace(doc, y, 15);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Preparation Tips", MARGIN, y);
    y += 7;
    doc.setFont("helvetica", "normal");
    for (const tip of report.tips) {
      y = ensureSpace(doc, y, LINE_HEIGHT);
      y = addWrappedText(doc, `• ${tip}`, MARGIN, y, CONTENT_WIDTH, 9) + 2;
    }
  }

  // QR data footer
  if (report.qrData) {
    y = ensureSpace(doc, y, 20);
    doc.setFontSize(7);
    doc.setTextColor(120, 120, 120);
    doc.text(`QR Data: ${report.qrData.slice(0, 120)}`, MARGIN, y);
  }

  // Footer on all pages
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`${CIVICAI_FULL_TITLE} · Page ${i} of ${pageCount}`, MARGIN, 290);
    doc.text("Mock government data for demonstration.", MARGIN, 295);
  }

  return doc;
}

export function generateCivicReportPdfBuffer(report: CivicReport): Buffer {
  const doc = generateCivicReportPdf(report);
  return Buffer.from(doc.output("arraybuffer"));
}

export function downloadCivicReportPdf(report: CivicReport): void {
  const doc = generateCivicReportPdf(report);
  const filename = `ecomind-${report.serviceId}-${report.id.slice(0, 8)}.pdf`;
  doc.save(filename);
}

export function printCivicReportPdf(report: CivicReport): void {
  const doc = generateCivicReportPdf(report);
  doc.autoPrint();
  window.open(doc.output("bloburl"), "_blank");
}

export async function shareCivicReportPdf(report: CivicReport): Promise<void> {
  const doc = generateCivicReportPdf(report);
  const blob = doc.output("blob");
  const file = new File([blob], `ecomind-${report.serviceId}.pdf`, {
    type: "application/pdf",
  });

  if (navigator.share && navigator.canShare?.({ files: [file] })) {
    await navigator.share({
      title: report.pdfTitle ?? report.serviceName,
      text: report.summary ?? "EcoMind AI Environmental Incident Report",
      files: [file],
    });
    return;
  }

  downloadCivicReportPdf(report);
}
