import { Badge } from "@/components/ui/badge";
import { severityBadgeVariant, normalizeSeverity } from "@/lib/civic/severity";

type SeverityBadgeProps = {
  severity?: string | null;
};

export function SeverityBadge({ severity }: SeverityBadgeProps) {
  const level = normalizeSeverity(severity);

  return (
    <Badge variant={severityBadgeVariant(severity)} className="uppercase">
      {level}
    </Badge>
  );
}
