"use client";

import { StatusBadge, type AppStatus } from "@/components/common/status-badge";
import { LoadingStatusCell } from "@/components/common/loading-status-cell";
import { invitationResponseBlockedReason } from "@/lib/case-invites";
import { textOverflow } from "@/lib/text-overflow";

interface InvitationStatusCellProps {
  invitationStatus: AppStatus;
  caseStatus: string;
  statusMessage?: string | null;
  accepting?: boolean;
  declining?: boolean;
}

export function InvitationStatusCell({
  invitationStatus,
  caseStatus,
  statusMessage,
  accepting = false,
  declining = false,
}: InvitationStatusCellProps) {
  const blockedReason = invitationResponseBlockedReason(invitationStatus, caseStatus);

  if (accepting) {
    return (
      <LoadingStatusCell
        label="Accepting..."
        className="font-medium text-emerald-700"
      />
    );
  }

  if (declining) {
    return (
      <LoadingStatusCell
        label="Declining..."
        className="font-medium text-muted-foreground"
      />
    );
  }

  return (
    <div className="space-y-1">
      <StatusBadge status={invitationStatus} />
      {(statusMessage || blockedReason) && (
        <p className={textOverflow.statusMessage}>
          {blockedReason ?? statusMessage}
        </p>
      )}
    </div>
  );
}
