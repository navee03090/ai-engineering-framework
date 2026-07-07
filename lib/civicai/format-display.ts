import { GOVERNMENT_SERVICES } from "@/lib/civicai/data/services";

const slugToName = new Map(GOVERNMENT_SERVICES.map((s) => [s.slug, s.name]));

export function formatServiceSlug(slug: string | null | undefined): string {
  if (!slug) return "Environmental issue";
  return (
    slugToName.get(slug) ??
    slug
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ")
  );
}

export function formatRequestStatus(status: string): {
  label: string;
  variant: "default" | "secondary" | "destructive" | "outline";
} {
  switch (status) {
    case "completed":
      return { label: "Resolved", variant: "secondary" };
    case "failed":
      return { label: "Failed", variant: "destructive" };
    case "processing":
      return { label: "In progress", variant: "default" };
    case "clarify":
      return { label: "Needs info", variant: "outline" };
    default:
      return { label: status, variant: "outline" };
  }
}

export function truncateText(text: string, max = 48): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1)}…`;
}

export function formatReportStatus(status: string): {
  label: string;
  variant: "default" | "secondary" | "destructive" | "outline";
} {
  switch (status.toLowerCase()) {
    case "completed":
    case "resolved":
      return { label: "Resolved", variant: "secondary" };
    case "pending":
    case "submitted":
      return { label: "Submitted", variant: "default" };
    case "failed":
      return { label: "Failed", variant: "destructive" };
    case "draft":
      return { label: "Draft", variant: "outline" };
    default:
      return {
        label: status.charAt(0).toUpperCase() + status.slice(1),
        variant: "outline",
      };
  }
}
