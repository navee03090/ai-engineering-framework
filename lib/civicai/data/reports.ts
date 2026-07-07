import type { CivicReport } from "@/lib/civicai/types";

export const DEMO_REPORT: CivicReport = {
  id: "demo",
  serviceId: "illegal-dumping",
  serviceName: "Illegal Dumping",
  department: "Lahore Waste Management Company (LWMC)",
  createdAt: "2026-07-05T10:30:00Z",
  status: "ready",
  confidence: 94,
  fee: "Free municipal service",
  processingTime: "24–72 hours",
  timeline: [
    {
      step: "Document Location",
      description:
        "Take photos of dumped waste with GPS location near Ring Road, Lahore.",
      duration: "10 minutes",
    },
    {
      step: "Report to LWMC",
      description:
        "Submit report via EcoMind AI or call LWMC helpline 1139 with location details.",
      duration: "15 minutes",
    },
    {
      step: "Enforcement Inspection",
      description:
        "LWMC enforcement unit inspects the site and schedules cleanup crew.",
      duration: "24–48 hours",
    },
    {
      step: "Cleanup & Follow-up",
      description:
        "Municipal team removes waste and monitors site for repeat dumping.",
      duration: "24–72 hours",
    },
  ],
  requiredDocuments: [
    { name: "Photo of dumped waste", status: "required" },
    { name: "GPS location or landmark", status: "required" },
    { name: "Date observed", status: "required" },
    { name: "Type of waste if known", status: "optional" },
    { name: "Video evidence", status: "optional" },
  ],
  missingDocuments: ["GPS location or landmark"],
  warnings: [
    "Do not confront dumpers directly — report to municipal authority.",
    "Avoid touching chemical or medical waste at the dumping site.",
    "This image may indicate unauthorized waste disposal. Consider reporting it to LWMC.",
  ],
  tips: [
    "Document the exact location using Google Maps pin near Ring Road.",
    "Take photos from multiple angles showing the scale of dumping.",
    "Report during daylight for clearer evidence.",
    "Keep children away from the dumping area until cleanup is complete.",
  ],
  sources: [
    { title: "LWMC Illegal Dumping Guidelines", url: "#" },
    { title: "Punjab Environmental Protection Act", url: "#" },
    { title: "Citizen Reporting Checklist", url: "#" },
  ],
  reportType: "verification",
  summary:
    "Illegal dumping reported near Ring Road, Lahore. EcoMind AI analyzed your evidence against the LWMC reporting checklist. One required item (GPS location) appears to be missing. Download the PDF for a printable incident report.",
  pdfTitle: "Illegal Dumping — Environmental Incident Report",
  pdfSections: [
    {
      heading: "Issue Overview",
      body: "EcoMind AI analyzed an illegal dumping report near Ring Road, Lahore. Responsible authority: Lahore Waste Management Company (LWMC).",
    },
    {
      heading: "Suggested Action",
      body: "Add GPS coordinates to your report and contact LWMC enforcement at helpline 1139 for expedited cleanup scheduling.",
    },
  ],
  qrData: "ecomind://report/demo/illegal-dumping",
  ocrIntelligence: {
    rawText:
      "NO DUMPING — Fine PKR 50,000. LWMC Enforcement. Report: 1139. Ring Road Sector 12.",
    overallConfidence: 91,
    documents: [
      { name: "Warning sign", normalizedName: "Municipal warning sign", confidence: 94 },
      { name: "LWMC 1139", normalizedName: "LWMC helpline number", confidence: 88 },
      { name: "Ring Road", normalizedName: "Location: Ring Road", confidence: 85 },
    ],
    advisory:
      "The uploaded image contains a municipal no-dumping sign with LWMC contact information. This may indicate unauthorized waste disposal. Consider reporting the exact location to LWMC enforcement.",
    suspiciousRequests: [],
  },
  officeLocation: {
    officeName: "LWMC Enforcement Unit — Ring Road Hotspot",
    officeAddress: "Ring Road, near Niazi Chowk, Lahore",
    lat: 31.485,
    lng: 74.32,
    city: "Lahore",
  },
};

export function getReportById(id: string): CivicReport | undefined {
  if (id === "demo" || id === "illegal-dumping-ring-road") {
    return DEMO_REPORT;
  }
  return undefined;
}
