"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Eye, Mail, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/common/page-header";
import { TableContentSkeleton } from "@/components/common/content-skeletons";
import { StatusBadge } from "@/components/common/status-badge";
import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { PaginationControls } from "@/components/common/pagination-controls";
import { LoadingStatusCell } from "@/components/common/loading-status-cell";
import { InvitationStatusCell } from "@/components/cases/invitation-status-cell";
import { TutorInvitationResponseActions } from "@/components/cases/tutor-invitation-response-actions";
import { ConfirmActionModal } from "@/components/modals/confirm-action-modal";
import {
  FilterSelect,
  ListFilterToolbar,
  useUrlSyncedSearch,
} from "@/components/common/list-filter-toolbar";
import { useAuth } from "@/lib/auth-context";
import { formatCurrency, formatDate } from "@/lib/format";
import { DEFAULT_PAGE_SIZE, resolvePaginationMeta } from "@/lib/pagination";
import { invitationsListQueryOptions } from "@/lib/queries/list-queries";
import { useTutorInvitationResponse } from "@/lib/hooks/use-tutor-invitation-response";

export function InvitedCasesView() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlSearch = searchParams.get("search") ?? "";
  const [invitationFilter, setInvitationFilter] = useState("all");
  const [declineTargetId, setDeclineTargetId] = useState<string | null>(null);
  const [acceptTargetId, setAcceptTargetId] = useState<string | null>(null);
  const { search, setSearch, debouncedSearch, page, setPage } =
    useUrlSyncedSearch(urlSearch);

  const { accept, decline, isResponding, getResponseAction } =
    useTutorInvitationResponse();

  const queryOptions = useMemo(
    () =>
      invitationsListQueryOptions({
        page,
        limit: DEFAULT_PAGE_SIZE,
        ...(debouncedSearch.trim() ? { search: debouncedSearch.trim() } : {}),
        ...(invitationFilter !== "all"
          ? {
              status: invitationFilter as
                | "pending"
                | "accepted"
                | "declined"
                | "superseded",
            }
          : {}),
      }),
    [page, debouncedSearch, invitationFilter],
  );

  const { data, isLoading } = useQuery({
    ...queryOptions,
    enabled: user?.role === "tutor",
  });

  const rows = useMemo(
    () => (data?.data ?? []).map((invitation) => ({ invitation, case: invitation.case })),
    [data?.data],
  );

  const pagination = resolvePaginationMeta(data?.meta, page, DEFAULT_PAGE_SIZE);

  const declineTarget = rows.find((row) => row.invitation.id === declineTargetId);
  const acceptTarget = rows.find((row) => row.invitation.id === acceptTargetId);

  if (user?.role !== "tutor") {
    return (
      <ErrorState
        title="Access denied"
        message="Only tutors can view invited cases."
        actionLabel="Go to dashboard"
        actionHref="/dashboard"
      />
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Invited Cases" description="Cases you've been invited to tutor" />
        <Card className="shadow-sm">
          <CardContent className="pt-6">
            <TableContentSkeleton />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Invited Cases"
        description="Cases you've been invited to tutor"
        count={pagination.total}
      />

      <Card className="shadow-sm">
        <CardContent className="pt-6">
          <ListFilterToolbar
            search={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search cases..."
          >
            <FilterSelect
              value={invitationFilter}
              onValueChange={(value) => {
                setInvitationFilter(value);
                setPage(1);
              }}
              placeholder="Invitation"
              className="w-full sm:w-44"
              items={[
                { value: "all", label: "All Invitations" },
                { value: "pending", label: "Pending" },
                { value: "accepted", label: "Accepted" },
                { value: "declined", label: "Declined" },
                { value: "superseded", label: "Superseded" },
              ]}
            />
          </ListFilterToolbar>

          {rows.length === 0 ? (
            <EmptyState
              icon={Mail}
              title="No invited cases"
              description="No invited cases match your current filters."
              variant="compact"
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Case Title</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead>Case Status</TableHead>
                  <TableHead>Invitation</TableHead>
                  <TableHead>Invitation Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map(({ case: c, invitation }) => {
                  const responding = isResponding(invitation.id);
                  const responseAction = getResponseAction(invitation.id);
                  const accepting = responding && responseAction === "accept";
                  const declining = responding && responseAction === "decline";

                  return (
                    <TableRow
                      key={invitation.id}
                      className={responding ? "bg-muted/40" : undefined}
                    >
                      <TableCell className="font-medium">{c.title}</TableCell>
                      <TableCell className="text-muted-foreground">{c.subject}</TableCell>
                      <TableCell className="text-muted-foreground">{c.level}</TableCell>
                      <TableCell>{formatCurrency(c.budgetPerHour)}/hr</TableCell>
                      <TableCell>
                        {accepting ? (
                          <LoadingStatusCell
                            label="Matching..."
                            className="font-medium text-emerald-700"
                          />
                        ) : (
                          <StatusBadge status={c.status} />
                        )}
                      </TableCell>
                      <TableCell>
                        <InvitationStatusCell
                          invitationStatus={invitation.status}
                          caseStatus={c.status}
                          statusMessage={invitation.statusMessage}
                          accepting={accepting}
                          declining={declining}
                        />
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(invitation.invitedAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <TutorInvitationResponseActions
                            invitationId={invitation.id}
                            invitationStatus={invitation.status}
                            caseStatus={c.status}
                            isResponding={isResponding}
                            getResponseAction={getResponseAction}
                            onAcceptRequest={setAcceptTargetId}
                            onDeclineRequest={setDeclineTargetId}
                          />
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                disabled={responding}
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => router.push(`/cases/${c.id}`)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Case
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
          <PaginationControls
            page={pagination.page}
            totalPages={pagination.totalPages}
            total={pagination.total}
            pageSize={DEFAULT_PAGE_SIZE}
            onPageChange={setPage}
          />
        </CardContent>
      </Card>

      <ConfirmActionModal
        open={acceptTargetId !== null}
        onOpenChange={(open) => {
          if (!open) setAcceptTargetId(null);
        }}
        title="Accept invitation"
        description={
          acceptTarget
            ? `Accept the invitation to tutor "${acceptTarget.case.title}"? You will be matched with this case and other pending tutors will no longer be able to accept.`
            : "Accept this case invitation?"
        }
        confirmLabel="Accept invitation"
        onConfirm={() => {
          if (!acceptTargetId) return;
          accept(acceptTargetId);
          setAcceptTargetId(null);
        }}
      />

      <ConfirmActionModal
        open={declineTargetId !== null}
        onOpenChange={(open) => {
          if (!open) setDeclineTargetId(null);
        }}
        title="Decline invitation"
        description={
          declineTarget
            ? `Decline the invitation to tutor "${declineTarget.case.title}"? The parent can invite you again later if the case is still open.`
            : "Decline this case invitation?"
        }
        confirmLabel="Decline invitation"
        onConfirm={() => {
          if (!declineTargetId) return;
          decline(declineTargetId);
          setDeclineTargetId(null);
        }}
      />
    </div>
  );
}
