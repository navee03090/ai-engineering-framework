export type SeverityLevel = "critical" | "high" | "medium" | "low" | "unknown";

const SEVERITY_RANK: Record<SeverityLevel, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
  unknown: 4,
};

export function normalizeSeverity(value?: string | null): SeverityLevel {
  const normalized = value?.toLowerCase();
  if (
    normalized === "critical" ||
    normalized === "high" ||
    normalized === "medium" ||
    normalized === "low"
  ) {
    return normalized;
  }
  return "unknown";
}

export function compareSeverity(a?: string | null, b?: string | null): number {
  return SEVERITY_RANK[normalizeSeverity(a)] - SEVERITY_RANK[normalizeSeverity(b)];
}

export function isEscalationSeverity(severity?: string | null): boolean {
  const level = normalizeSeverity(severity);
  return level === "high" || level === "critical";
}

export function severityBadgeVariant(
  severity?: string | null
): "default" | "secondary" | "destructive" | "outline" {
  const level = normalizeSeverity(severity);
  if (level === "critical" || level === "high") {
    return "destructive";
  }
  if (level === "medium") {
    return "default";
  }
  return "secondary";
}
