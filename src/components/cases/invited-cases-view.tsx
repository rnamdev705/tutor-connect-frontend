"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, Eye, Loader2, Mail, MoreHorizontal } from "lucide-react";
import { patchInvitationsByIdMutation } from "@/api/@tanstack/react-query.gen";
import type { GetInvitationsResponse } from "@/api/types.gen";
import {
  invalidateCaseData,
  setInvitationInListCache,
} from "@/lib/queries/invalidate";
import { isQueryKey, queryKeyIds } from "@/lib/queries/query-keys";
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
import {
  FilterSelect,
  ListFilterToolbar,
  useDebouncedValue,
} from "@/components/common/list-filter-toolbar";
import {
  AcceptingStatusCell,
  MatchingStatusCell,
} from "@/components/common/pending-status-cells";
import { useAuth } from "@/lib/auth-context";
import { getApiErrorMessage } from "@/lib/api-error";
import { formatCurrency, formatDate } from "@/lib/format";
import { DEFAULT_PAGE_SIZE, resolvePaginationMeta } from "@/lib/pagination";
import { invitationsListQueryOptions } from "@/lib/queries/list-queries";
import { usePendingInvitationResponses } from "@/lib/hooks/use-pending-invitation-responses";
import { toast } from "sonner";

export function InvitedCasesView() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [invitationFilter, setInvitationFilter] = useState("all");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebouncedValue(search);

  useEffect(() => {
    const initialSearch = searchParams.get("search");
    if (initialSearch) setSearch(initialSearch);
  }, [searchParams]);

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

  const { trackResponse, isResponding, getResponseAction } =
    usePendingInvitationResponses();

  const acceptMutation = useMutation({
    ...patchInvitationsByIdMutation(),
    onMutate: async () => {
      await queryClient.cancelQueries({
        predicate: (query) => isQueryKey(query, queryKeyIds.invitations),
      });
      const previous = queryClient.getQueriesData<GetInvitationsResponse>({
        predicate: (query) => isQueryKey(query, queryKeyIds.invitations),
      });
      return { previous };
    },
    onSuccess: (updated) => {
      setInvitationInListCache(queryClient, updated);
      void invalidateCaseData(queryClient, updated.caseId);
      toast.success("Case invitation accepted");
    },
    onError: (error, _variables, context) => {
      context?.previous.forEach(([key, value]) => {
        queryClient.setQueryData(key, value);
      });
      toast.error(getApiErrorMessage(error));
    },
  });

  const rows = useMemo(
    () => (data?.data ?? []).map((invitation) => ({ invitation, case: invitation.case })),
    [data?.data],
  );

  const pagination = resolvePaginationMeta(data?.meta, page, DEFAULT_PAGE_SIZE);

  const handleAccept = (invitationId: string) => {
    trackResponse(invitationId, "accept", () =>
      acceptMutation.mutateAsync({
        path: { id: invitationId },
        body: { status: "accepted" },
      }),
    );
  };

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
            onSearchChange={(value) => {
              setSearch(value);
              setPage(1);
            }}
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
                  const accepting =
                    isResponding(invitation.id) &&
                    getResponseAction(invitation.id) === "accept";

                  return (
                    <TableRow
                      key={invitation.id}
                      className={accepting ? "bg-muted/40" : undefined}
                    >
                      <TableCell className="font-medium">{c.title}</TableCell>
                      <TableCell className="text-muted-foreground">{c.subject}</TableCell>
                      <TableCell className="text-muted-foreground">{c.level}</TableCell>
                      <TableCell>{formatCurrency(c.budgetPerHour)}/hr</TableCell>
                      <TableCell>
                        {accepting ? <MatchingStatusCell /> : <StatusBadge status={c.status} />}
                      </TableCell>
                      <TableCell>
                        {accepting ? (
                          <AcceptingStatusCell />
                        ) : (
                          <StatusBadge status={invitation.status} />
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(invitation.invitedAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {invitation.status === "pending" &&
                            (accepting ? (
                              <Button size="sm" disabled>
                                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                                Accepting...
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                disabled={isResponding(invitation.id)}
                                onClick={() => handleAccept(invitation.id)}
                              >
                                <Check className="mr-1.5 h-3.5 w-3.5" />
                                Accept
                              </Button>
                            ))}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                disabled={accepting}
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
    </div>
  );
}
