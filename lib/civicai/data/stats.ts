import type { StatItem } from "@/lib/civicai/types";

export const PLATFORM_STATS: StatItem[] = [
  { label: "Citizens Guided", value: "12,400+", change: "+18% this month" },
  { label: "Government Services", value: "13", change: "Expanding" },
  { label: "Documents Verified", value: "8,200+", change: "+24% this month" },
  { label: "Avg. Time Saved", value: "4.2 hrs", change: "Per request" },
];

export const DASHBOARD_STATS = {
  totalRequests: 47,
  completedReports: 38,
  documentsVerified: 22,
  avgConfidence: 91,
};
