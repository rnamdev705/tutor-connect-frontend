import { cn } from "@/lib/utils";
import type { CaseInvitation, CaseStatus } from "@/lib/types";

export type AppStatus = CaseStatus | CaseInvitation["status"];

const statusConfig: Record<
  AppStatus,
  { label: string; className: string }
> = {
  open: {
    label: "Open",
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
  matched: {
    label: "Matched",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  closed: {
    label: "Closed",
    className: "bg-gray-100 text-gray-600 border-gray-200",
  },
  pending: {
    label: "Pending",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  accepted: {
    label: "Accepted",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  declined: {
    label: "Declined",
    className: "bg-gray-100 text-gray-600 border-gray-200",
  },
  superseded: {
    label: "Superseded",
    className: "bg-gray-100 text-gray-500 border-gray-200",
  },
};

interface StatusBadgeProps {
  status: AppStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        config.className,
        className,
      )}
    >
      {config.label}
    </span>
  );
}
