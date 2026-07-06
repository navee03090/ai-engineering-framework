import type { HistoryItem } from "@/lib/civicai/types";

export const REQUEST_HISTORY: HistoryItem[] = [
  {
    id: "h1",
    query: "How do I renew my driving license?",
    serviceName: "Driving License Renewal",
    createdAt: "2026-07-05T09:15:00Z",
    status: "completed",
  },
  {
    id: "h2",
    query: "Documents needed for passport renewal",
    serviceName: "Passport Application",
    createdAt: "2026-07-04T14:22:00Z",
    status: "completed",
  },
  {
    id: "h3",
    query: "CNIC correction procedure",
    serviceName: "CNIC / NICOP",
    createdAt: "2026-07-03T11:00:00Z",
    status: "completed",
  },
  {
    id: "h4",
    query: "Property transfer stamp duty in Punjab",
    serviceName: "Property Transfer",
    createdAt: "2026-07-02T16:45:00Z",
    status: "in_progress",
  },
  {
    id: "h5",
    query: "FIR filing process",
    serviceName: "Police Complaint (FIR)",
    createdAt: "2026-07-01T08:30:00Z",
    status: "completed",
  },
];
