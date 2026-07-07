export type DocumentStatus =
  "required" | "optional" | "unknown" | "missing" | "verified";

export type AssistantApiResponse = {
  serviceName: string;
  serviceId: string;
  department: string;
  fee: string;
  processingTime: string;
  answer: string;
  confidence: number;
  checklist: { name: string; status: DocumentStatus }[];
  warnings: string[];
  sources: { title: string; url: string }[];
  timeline?: { step: string; description: string; duration?: string }[];
  preparationTips?: string[];
  nextSteps?: string[];
  faqs?: { question: string; answer: string }[];
  reportId?: string;
  officeLocation?: {
    officeName: string;
    officeAddress: string;
    lat: number;
    lng: number;
    city: string;
  };
};

export type ServiceCategory =
  | "waste"
  | "recycling"
  | "pollution"
  | "infrastructure"
  | "green"
  | "general";

export type GovernmentService = {
  id: string;
  name: string;
  slug: string;
  category: ServiceCategory;
  department: string;
  description: string;
  fee: string;
  processingTime: string;
  documents: string[];
  icon: string;
  popular?: boolean;
};

export type OcrIntelligence = {
  rawText?: string;
  overallConfidence?: number;
  documents?: { name: string; normalizedName?: string; confidence?: number }[];
  advisory?: string;
  suspiciousRequests?: string[];
};

export type CivicReport = {
  id: string;
  serviceId: string;
  serviceName: string;
  department: string;
  createdAt: string;
  status: "draft" | "ready" | "archived";
  confidence: number;
  fee: string;
  processingTime: string;
  timeline: { step: string; description: string; duration?: string }[];
  requiredDocuments: { name: string; status: DocumentStatus }[];
  missingDocuments: string[];
  warnings: string[];
  tips: string[];
  sources: { title: string; url: string }[];
  reportType?: "query" | "verification";
  summary?: string;
  pdfTitle?: string;
  pdfSections?: { heading: string; body: string }[];
  qrData?: string;
  ocrIntelligence?: OcrIntelligence;
  officeLocation?: {
    officeName: string;
    officeAddress: string;
    lat: number;
    lng: number;
    city: string;
  };
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  confidence?: number;
  sources?: { title: string; url: string }[];
};

export type HistoryItem = {
  id: string;
  query: string;
  serviceName: string;
  createdAt: string;
  status: "completed" | "in_progress" | "failed";
};

export type Testimonial = {
  id: string;
  name: string;
  city: string;
  role: string;
  quote: string;
  rating: number;
};

export type StatItem = {
  label: string;
  value: string;
  change?: string;
};
