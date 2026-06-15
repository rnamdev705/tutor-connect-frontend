"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { If, Then, Else } from "react-if";
import { ArrowLeft, Eye, Mail, MoreHorizontal, Trash2, UserPlus, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StatusBadge } from "@/components/common/status-badge";
import { SearchInput } from "@/components/common/search-input";
import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { InvitedTutorListSkeleton } from "@/components/common/content-skeletons";
import { PaginationControls } from "@/components/common/pagination-controls";
import { UserAvatar } from "@/components/common/user-avatar";
import { InviteTutorModal } from "@/components/modals/invite-tutor-modal";
import { LoadingStatusCell } from "@/components/common/loading-status-cell";
import { useAuth } from "@/lib/auth-context";
import { canInviteTutorsToCase, canReinviteTutor, canRevokeInvitation, invitationHistoryHint } from "@/lib/case-invites";
import { formatDate } from "@/lib/format";
import { textOverflow } from "@/lib/text-overflow";
import { cn } from "@/lib/utils";
import { DEFAULT_PAGE_SIZE, paginateItems } from "@/lib/pagination";
import { caseDetailQueryOptions } from "@/lib/queries/list-queries";
import { useCaseInvitationMutations } from "@/lib/hooks/use-case-invitation-mutations";
import { usePendingTutorInvites } from "@/lib/hooks/use-pending-invites";
import { usePendingInvitationRevokes } from "@/lib/hooks/use-pending-invitation-revokes";

interface CaseInvitedTutorsViewProps {
  caseId: string;
}

export function CaseInvitedTutorsView({ caseId }: CaseInvitedTutorsViewProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [inviteOpen, setInviteOpen] = useState(false);
  const { pendingInvites, trackInvite } = usePendingTutorInvites(caseId);
  const { trackRevoke, isRevoking, hasPending: hasPendingRevokes } =
    usePendingInvitationRevokes(caseId);
  const { inviteMutation, revokeMutation } = useCaseInvitationMutations(caseId);

  const { data: caseData, isLoading, isError } = useQuery(caseDetailQueryOptions(caseId));

  const activePendingInvites = useMemo(() => {
    if (!caseData) return [];
    return pendingInvites.filter(
      (pending) =>
        !caseData.invitations.some((inv) => inv.tutorProfileId === pending.tutorProfileId),
    );
  }, [caseData, pendingInvites]);

  const filteredItems = useMemo(() => {
    if (!caseData) return [];

    const pendingRows = activePendingInvites.map((inv) => ({
      kind: "pending" as const,
      id: inv.id,
      tutorName: inv.tutorName,
      tutorProfileId: inv.tutorProfileId,
      status: "pending" as const,
      invitedAt: null as string | null,
      tutorUserId: null as string | null,
    }));

    const invitationRows = [...caseData.invitations]
      .sort((a, b) => Date.parse(b.invitedAt ?? "") - Date.parse(a.invitedAt ?? ""))
      .map((inv) => ({
        kind: "invitation" as const,
        id: inv.id,
        tutorName: inv.tutor?.displayName ?? "Unknown tutor",
        tutorProfileId: inv.tutorProfileId,
        status: inv.status,
        invitedAt: inv.invitedAt,
        tutorUserId: inv.tutorUserId,
      }));

    return [...pendingRows, ...invitationRows].filter((row) => {
      if (search && !row.tutorName.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      if (statusFilter !== "all" && row.status !== statusFilter) {
        return false;
      }
      return true;
    });
  }, [activePendingInvites, caseData, search, statusFilter]);

  const pagination = useMemo(
    () => paginateItems(filteredItems, page, DEFAULT_PAGE_SIZE),
    [filteredItems, page],
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/cases/${caseId}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Invited Tutors</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage tutors invited to this case
            </p>
          </div>
        </div>
        <Card className="shadow-sm">
          <CardContent className="pt-6">
            <InvitedTutorListSkeleton />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError || !caseData) {
    return (
      <ErrorState
        title="Case not found"
        message="This case does not exist or you do not have access."
        actionLabel="Back to cases"
        actionHref="/cases"
      />
    );
  }

  const isOwner = user?.id === caseData.ownerId;
  const canManage = user?.role === "parent" && isOwner;

  if (!canManage) {
    return (
      <ErrorState
        title="Access denied"
        message="Only the case owner can manage invited tutors."
        actionLabel="Back to case"
        actionHref={`/cases/${caseId}`}
      />
    );
  }

  const inviteInProgress = activePendingInvites.length > 0;
  const totalCount = caseData.invitations.length + activePendingInvites.length;
  const canInvite = canInviteTutorsToCase(caseData.status);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/cases/${caseId}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="min-w-0 flex-1">
            <h1 className={textOverflow.pageTitle}>Invited Tutors</h1>
            <p className={cn(textOverflow.pageSubtitle, "truncate")}>
              {caseData.title} · {totalCount} tutor(s) invited
            </p>
          </div>
        </div>
        {canInvite && (
          <Button
            disabled={inviteInProgress || hasPendingRevokes}
            onClick={() => setInviteOpen(true)}
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Invite Tutor
          </Button>
        )}
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">All invited tutors</CardTitle>
          <CardDescription>Search and filter tutors invited to this case.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <SearchInput
              value={search}
              onChange={(value) => {
                setSearch(value);
                setPage(1);
              }}
              placeholder="Search by tutor name..."
            />
            <Select
              value={statusFilter}
              onValueChange={(value) => {
                if (value) {
                  setStatusFilter(value);
                  setPage(1);
                }
              }}
            >
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="declined">Declined</SelectItem>
                <SelectItem value="superseded">Superseded</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <If condition={filteredItems.length === 0}>
            <Then>
              <EmptyState
                icon={Users}
                title="No tutors found"
                description="Try adjusting your search or filters."
                variant="compact"
              />
            </Then>
            <Else>
              <ul className="divide-y rounded-lg border">
                {pagination.items.map((row) => {
                  const revoking = row.tutorUserId ? isRevoking(row.tutorUserId) : false;
                  const tutorInvitePending = row.kind === "pending";
                  const reinviting =
                    row.tutorProfileId != null &&
                    pendingInvites.some((p) => p.tutorProfileId === row.tutorProfileId);
                  const historyHint =
                    row.kind === "invitation"
                      ? invitationHistoryHint(row.status, caseData.status)
                      : null;

                  return (
                    <li
                      key={row.id}
                      className={`flex items-center gap-3 px-4 py-3 ${
                        tutorInvitePending || revoking || reinviting
                          ? "bg-muted/40 opacity-60"
                          : ""
                      }`}
                    >
                      <UserAvatar name={row.tutorName} size="sm" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{row.tutorName}</p>
                        {tutorInvitePending ? (
                          <LoadingStatusCell label="Inviting..." />
                        ) : revoking ? (
                          <LoadingStatusCell label="Removing..." />
                        ) : reinviting ? (
                          <LoadingStatusCell label="Re-inviting..." />
                        ) : (
                          <>
                            <p className="text-xs text-muted-foreground">
                              Invited {formatDate(row.invitedAt)}
                            </p>
                            {historyHint && (
                              <p className="text-xs text-muted-foreground">{historyHint}</p>
                            )}
                          </>
                        )}
                      </div>
                      {!tutorInvitePending && !revoking && !reinviting && (
                        <StatusBadge status={row.status} />
                      )}
                      {!tutorInvitePending && !revoking && !reinviting && row.tutorUserId && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {row.tutorProfileId && (
                              <DropdownMenuItem
                                onClick={() => router.push(`/tutors/${row.tutorProfileId}`)}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View Profile
                              </DropdownMenuItem>
                            )}
                            {canReinviteTutor(row.status, caseData.status) &&
                              canInvite &&
                              row.tutorProfileId && (
                                <DropdownMenuItem
                                  onClick={() =>
                                    trackInvite(row.tutorProfileId!, row.tutorName, () =>
                                      inviteMutation.mutateAsync({
                                        path: { id: caseId },
                                        body: { tutorProfileId: row.tutorProfileId! },
                                      }),
                                    )
                                  }
                                >
                                  <Mail className="mr-2 h-4 w-4" />
                                  Re-invite
                                </DropdownMenuItem>
                              )}
                            {canRevokeInvitation(row.status) && row.tutorUserId && (
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() =>
                                  trackRevoke(row.tutorUserId!, row.tutorName, () =>
                                    revokeMutation.mutateAsync({
                                      path: {
                                        id: caseId,
                                        tutorId: row.tutorUserId!,
                                      },
                                    }),
                                  )
                                }
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
            </Else>
          </If>

          <PaginationControls
            page={pagination.page}
            totalPages={pagination.totalPages}
            total={pagination.total}
            pageSize={DEFAULT_PAGE_SIZE}
            onPageChange={setPage}
          />
        </CardContent>
      </Card>

      {canInvite && (
        <InviteTutorModal
          open={inviteOpen}
          caseStatus={caseData.status}
          onOpenChange={(open) => {
            if (open && (inviteInProgress || hasPendingRevokes)) return;
            setInviteOpen(open);
          }}
          invitedTutors={caseData.invitations
            .filter((inv) => inv.tutorProfileId)
            .map((inv) => ({
              tutorProfileId: inv.tutorProfileId!,
              status: inv.status,
            }))}
          invitingTutorIds={pendingInvites.map((invite) => invite.tutorProfileId)}
          onInvite={(tutor) =>
            trackInvite(tutor.id, tutor.displayName, () =>
              inviteMutation.mutateAsync({
                path: { id: caseId },
                body: { tutorProfileId: tutor.id },
              }),
            )
          }
        />
      )}
    </div>
  );
}
