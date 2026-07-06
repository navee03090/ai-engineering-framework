import type { CivicReport } from "@/lib/civicai/types";

export const DEMO_REPORT: CivicReport = {
  id: "demo",
  serviceId: "driving-license",
  serviceName: "Driving License Renewal",
  department: "Traffic Police / Licensing Authority",
  createdAt: "2026-07-05T10:30:00Z",
  status: "ready",
  confidence: 94,
  fee: "PKR 1,800",
  processingTime: "7–14 working days",
  timeline: [
    {
      step: "Gather Documents",
      description:
        "Collect CNIC, old license, medical certificate, and passport photos.",
      duration: "1 day",
    },
    {
      step: "Visit Licensing Center",
      description:
        "Submit application at your district traffic police licensing office.",
      duration: "1–2 hours",
    },
    {
      step: "Biometric & Photo",
      description: "Complete biometric verification and photograph capture on-site.",
      duration: "30 minutes",
    },
    {
      step: "Fee Payment",
      description:
        "Pay official fee of PKR 1,800 at the designated counter. Keep receipt.",
      duration: "15 minutes",
    },
    {
      step: "Collection",
      description:
        "Collect renewed license after processing period (7–14 working days).",
      duration: "7–14 days",
    },
  ],
  requiredDocuments: [
    { name: "Original CNIC", status: "required" },
    { name: "Expired Driving License", status: "required" },
    { name: "Medical Fitness Certificate", status: "required" },
    { name: "Passport-size Photographs (2)", status: "required" },
    { name: "Copy of CNIC", status: "optional" },
    { name: "Affidavit for lost license", status: "unknown" },
  ],
  missingDocuments: ["Medical Fitness Certificate"],
  warnings: [
    "Only pay the official fee of PKR 1,800 at the designated counter. Avoid unofficial 'facilitation' fees.",
    "Medical certificate must be from a government-approved medical officer.",
    "If an officer requests documents not on this list, you may politely ask for the official written requirement.",
  ],
  tips: [
    "Visit early morning to avoid long queues at licensing centers.",
    "Bring both original and photocopies of all documents.",
    "Check your license expiry date — renewal is easier within 30 days of expiry.",
    "Save your fee receipt until you collect the new license.",
  ],
  sources: [
    { title: "Traffic Police Licensing Guidelines", url: "#" },
    { title: "Official Fee Schedule 2026", url: "#" },
    { title: "Required Documents Checklist", url: "#" },
  ],
  reportType: "verification",
  summary:
    "Your officer note was analyzed against the official driving license renewal checklist. One required document appears to be missing. Download the PDF report for a printable summary.",
  pdfTitle: "Driving License Renewal — Document Verification Report",
  pdfSections: [
    {
      heading: "Verification Result",
      body: "CivicAI compared the officer's handwritten note with the official document checklist for driving license renewal.",
    },
    {
      heading: "Next Steps",
      body: "Obtain a Medical Fitness Certificate from a government-approved medical officer before your next visit to the licensing center.",
    },
  ],
  qrData: "civicai://report/demo/driving-license",
  ocrIntelligence: {
    rawText:
      "Please bring CNIC, old license, passport photos x2. Medical certificate required. Fee PKR 1800.",
    overallConfidence: 88,
    documents: [
      { name: "CNIC", normalizedName: "Original CNIC", confidence: 92 },
      {
        name: "Old License",
        normalizedName: "Expired Driving License",
        confidence: 85,
      },
      {
        name: "Photos",
        normalizedName: "Passport-size Photographs (2)",
        confidence: 78,
      },
    ],
    advisory:
      "The officer note matches most official requirements. Medical Fitness Certificate was requested but not found in the extracted text.",
    suspiciousRequests: [],
  },
  officeLocation: {
    officeName: "Islamabad Traffic Police Licensing Center",
    officeAddress: "H-9, Islamabad Traffic Police HQ, Islamabad",
    lat: 33.6498,
    lng: 73.0672,
    city: "Islamabad",
  },
};

export function getReportById(id: string): CivicReport | undefined {
  if (id === "demo" || id === "driving-license-renewal") {
    return DEMO_REPORT;
  }
  return undefined;
}
