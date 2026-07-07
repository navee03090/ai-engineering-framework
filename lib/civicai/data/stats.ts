import type { StatItem } from "@/lib/civicai/types";

export const PLATFORM_STATS: StatItem[] = [
  { label: "Issues Reported", value: "8,400+", change: "+22% this month" },
  { label: "Environmental Services", value: "12", change: "Full coverage" },
  { label: "Evidence Verified", value: "5,200+", change: "+31% this month" },
  { label: "Avg. Response Time", value: "36 hrs", change: "Municipal avg." },
];

export const DASHBOARD_STATS = {
  totalRequests: 47,
  completedReports: 38,
  documentsVerified: 22,
  avgConfidence: 91,
};
