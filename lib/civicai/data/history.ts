import type { HistoryItem } from "@/lib/civicai/types";

export const REQUEST_HISTORY: HistoryItem[] = [
  {
    id: "h1",
    query: "There is illegal dumping near Ring Road",
    serviceName: "Illegal Dumping",
    createdAt: "2026-07-05T09:15:00Z",
    status: "completed",
  },
  {
    id: "h2",
    query: "My street garbage has not been collected for 3 days",
    serviceName: "Garbage Collection",
    createdAt: "2026-07-04T14:22:00Z",
    status: "completed",
  },
  {
    id: "h3",
    query: "Plastic waste in BRB Canal near Gulberg",
    serviceName: "Plastic Pollution",
    createdAt: "2026-07-03T11:00:00Z",
    status: "completed",
  },
  {
    id: "h4",
    query: "Smoke from burning garbage in Faisalabad",
    serviceName: "Air Pollution",
    createdAt: "2026-07-02T16:45:00Z",
    status: "in_progress",
  },
  {
    id: "h5",
    query: "Blocked drain causing sewage overflow",
    serviceName: "Blocked Drain",
    createdAt: "2026-07-01T08:30:00Z",
    status: "completed",
  },
];
