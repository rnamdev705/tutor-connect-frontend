"use client";

import { StatusBadge, type AppStatus } from "@/components/common/status-badge";
import { LoadingStatusCell } from "@/components/common/loading-status-cell";
import {
  blocksNewInviteForInvitationStatus,
  canReinviteTutor,
} from "@/lib/case-invites";

interface InvitePickerStatusProps {
  status?: AppStatus | string;
  isInviting?: boolean;
}

/** Status chip for tutor/case rows inside invite picker modals. */
export function InvitePickerStatus({ status, isInviting = false }: InvitePickerStatusProps) {
  if (isInviting) {
    return <LoadingStatusCell label="Inviting..." />;
  }

  if (!status) {
    return null;
  }

  if (canReinviteTutor(status)) {
    return (
      <div className="flex shrink-0 flex-col items-end gap-1">
        <StatusBadge status={status as AppStatus} />
        <span className="text-[10px] font-medium text-primary">Re-invite</span>
      </div>
    );
  }

  if (blocksNewInviteForInvitationStatus(status)) {
    return <StatusBadge status={status as AppStatus} className="shrink-0" />;
  }

  return <StatusBadge status={status as AppStatus} className="shrink-0" />;
}
