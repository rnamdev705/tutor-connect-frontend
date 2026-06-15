"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, MoreHorizontal, Trash2, UserPlus, Users, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StatusBadge } from "@/components/common/status-badge";
import { EmptyState } from "@/components/common/empty-state";
import { UserAvatar } from "@/components/common/user-avatar";
import { LoadingStatusCell } from "@/components/common/loading-status-cell";
import { formatDate } from "@/lib/format";
import {
  canInviteTutorsToCase,
  canReinviteTutor,
  canRevokeInvitation,
  inviteClosedMessage,
  reinviteStatusHint,
} from "@/lib/case-invites";
import { PREVIEW_LIMIT } from "@/lib/pagination";
import type { CaseDetail } from "@/api/types.gen";
import type { PendingTutorInvite } from "@/lib/hooks/use-pending-invites";

interface CaseDetailInvitedTutorsCardProps {
  caseId: string;
  caseData: CaseDetail;
  activePendingInvites: PendingTutorInvite[];
  inviteInProgress: boolean;
  hasPendingRevokes: boolean;
  caseIsDeleting: boolean;
  isRevoking: (tutorUserId: string) => boolean;
  invitingTutorIds?: string[];
  onInviteOpen: () => void;
  onReinvite?: (tutorProfileId: string, tutorName: string) => void;
  onRemoveInvitation: (tutorUserId: string, tutorName: string) => void;
}

export function CaseDetailInvitedTutorsCard({
  caseId,
  caseData,
  activePendingInvites,
  inviteInProgress,
  hasPendingRevokes,
  caseIsDeleting,
  invitingTutorIds = [],
  isRevoking,
  onInviteOpen,
  onReinvite,
  onRemoveInvitation,
}: CaseDetailInvitedTutorsCardProps) {
  const router = useRouter();

  const sortedInvitations = [...caseData.invitations].sort(
    (a, b) => Date.parse(b.invitedAt ?? "") - Date.parse(a.invitedAt ?? ""),
  );

  const allTutorRows = [
    ...activePendingInvites.map((inv) => ({ kind: "pending" as const, row: inv })),
    ...sortedInvitations.map((inv) => ({ kind: "invitation" as const, row: inv })),
  ];
  const tutorTotalCount = allTutorRows.length;
  const previewTutorRows = allTutorRows.slice(0, PREVIEW_LIMIT);
  const canInvite = canInviteTutorsToCase(caseData.status);
  const inviteClosedHint = inviteClosedMessage(caseData.status);

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3 space-y-0">
        <div className="min-w-0">
          <CardTitle className="text-base">Invited Tutors</CardTitle>
          <CardDescription>
            {inviteClosedHint ??
              `${caseData.invitations.length + activePendingInvites.length} tutor(s) invited`}
          </CardDescription>
        </div>
        {canInvite && (
          <Button
            size="sm"
            className="shrink-0"
            disabled={inviteInProgress || hasPendingRevokes || caseIsDeleting}
            onClick={onInviteOpen}
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Invite Tutor
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {tutorTotalCount === 0 ? (
          <EmptyState
            icon={Users}
            title="No invited tutors"
            description="No tutors have been invited to this case yet."
            variant="compact"
          />
        ) : (
          <ul className="divide-y">
            {previewTutorRows.map((item) => {
              if (item.kind === "pending") {
                const inv = item.row;
                return (
                  <li
                    key={inv.id}
                    className="flex items-center gap-3 bg-muted/40 py-3 first:pt-0 last:pb-0"
                  >
                    <UserAvatar name={inv.tutorName} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{inv.tutorName}</p>
                      <LoadingStatusCell label="Inviting..." />
                    </div>
                  </li>
                );
              }

              const inv = item.row;
              const revoking = isRevoking(inv.tutorUserId);
              const tutorName = inv.tutor?.displayName ?? "Unknown tutor";
              const reinviting =
                inv.tutorProfileId != null &&
                invitingTutorIds.includes(inv.tutorProfileId);
              const reinviteHint = reinviteStatusHint(inv.status);

              return (
                <li
                  key={inv.id}
                  className={`flex items-center gap-3 py-3 first:pt-0 last:pb-0 ${
                    revoking || reinviting ? "bg-muted/40 opacity-60" : ""
                  }`}
                >
                  <UserAvatar name={tutorName} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{tutorName}</p>
                    {revoking ? (
                      <LoadingStatusCell label="Removing..." />
                    ) : reinviting ? (
                      <LoadingStatusCell label="Re-inviting..." />
                    ) : (
                      <>
                        <p className="text-xs text-muted-foreground">
                          Invited {formatDate(inv.invitedAt)}
                        </p>
                        {reinviteHint && (
                          <p className="text-xs text-muted-foreground">{reinviteHint}</p>
                        )}
                      </>
                    )}
                  </div>
                  {!revoking && !reinviting && <StatusBadge status={inv.status} />}
                  {!revoking && !reinviting && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 shrink-0"
                          disabled={caseIsDeleting}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {inv.tutorProfileId && (
                          <DropdownMenuItem
                            onClick={() => router.push(`/tutors/${inv.tutorProfileId}`)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Profile
                          </DropdownMenuItem>
                        )}
                        {canReinviteTutor(inv.status) &&
                          canInvite &&
                          inv.tutorProfileId &&
                          onReinvite && (
                            <DropdownMenuItem
                              onClick={() =>
                                onReinvite(inv.tutorProfileId!, tutorName)
                              }
                            >
                              <Mail className="mr-2 h-4 w-4" />
                              Re-invite
                            </DropdownMenuItem>
                          )}
                        {canRevokeInvitation(inv.status) && (
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => onRemoveInvitation(inv.tutorUserId, tutorName)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Remove
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </li>
              );
            })}
          </ul>
        )}
        <Button variant="outline" size="sm" className="mt-4 w-full" asChild>
          <Link href={`/cases/${caseId}/tutors`}>
            View all{tutorTotalCount > 0 ? ` (${tutorTotalCount})` : ""}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
