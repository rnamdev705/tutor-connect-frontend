import { Loader2 } from "lucide-react";

function PendingStatusCell({ label, className }: { label: string; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs text-muted-foreground ${className ?? ""}`}
    >
      <Loader2 className="h-3.5 w-3.5 animate-spin" />
      {label}
    </span>
  );
}

export function DeletingStatusCell() {
  return <PendingStatusCell label="Deleting..." />;
}

export function InvitingStatusCell() {
  return <PendingStatusCell label="Inviting..." />;
}

export function RemovingStatusCell() {
  return <PendingStatusCell label="Removing..." />;
}

export function AcceptingStatusCell() {
  return (
    <PendingStatusCell
      label="Accepting..."
      className="font-medium text-emerald-700"
    />
  );
}

export function MatchingStatusCell() {
  return (
    <PendingStatusCell
      label="Matching..."
      className="font-medium text-emerald-700"
    />
  );
}
