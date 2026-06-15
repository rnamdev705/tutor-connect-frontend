import { Loader2 } from "lucide-react";

/** Inline spinner + label for in-progress table actions (upload, delete, invite, etc.). */
export function LoadingStatusCell({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs text-muted-foreground ${className ?? ""}`}
    >
      <Loader2 className="h-3.5 w-3.5 animate-spin" />
      {label}
    </span>
  );
}
