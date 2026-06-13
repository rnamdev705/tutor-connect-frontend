import { cn } from "@/lib/utils";
import type { CaseStatus } from "@/lib/types";

const statusStyles: Record<CaseStatus, string> = {
  open: "bg-blue-50 text-blue-700 border-blue-200",
  matched: "bg-emerald-50 text-emerald-700 border-emerald-200",
  closed: "bg-gray-100 text-gray-600 border-gray-200",
};

const statusLabels: Record<CaseStatus, string> = {
  open: "Open",
  matched: "Matched",
  closed: "Closed",
};

interface StatusBadgeProps {
  status: CaseStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        statusStyles[status],
        className,
      )}
    >
      {statusLabels[status]}
    </span>
  );
}
