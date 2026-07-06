"use client";

import { motion } from "framer-motion";
import type { DocumentStatus } from "@/lib/civicai/types";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<DocumentStatus, string> = {
  required:
    "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
  optional: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
  unknown: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
  missing: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
  verified: "bg-teal-500/10 text-teal-700 dark:text-teal-400 border-teal-500/20",
};

const STATUS_LABELS: Record<DocumentStatus, string> = {
  required: "Required",
  optional: "Optional",
  unknown: "Unknown",
  missing: "Missing",
  verified: "Verified",
};

export function StatusChip({
  status,
  className,
}: {
  status: DocumentStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize",
        STATUS_STYLES[status],
        className
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

export function AnimatedCard({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -2 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 px-6 py-16 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-muted">
        <Icon className="size-7 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
