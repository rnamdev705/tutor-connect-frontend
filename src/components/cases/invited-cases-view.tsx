"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, Loader2, Mail, MoreHorizontal } from "lucide-react";
import {
  getInvitationsOptions,
  getInvitationsQueryKey,
  patchInvitationsByIdMutation,
} from "@/api/@tanstack/react-query.gen";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { SearchInput } from "@/components/common/search-input";
import { StatusBadge } from "@/components/common/status-badge";
import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { PaginationControls } from "@/components/common/pagination-controls";
import { useAuth } from "@/lib/auth-context";
import { getApiErrorMessage } from "@/lib/api-error";
import { formatCurrency, formatDate } from "@/lib/format";
import { DEFAULT_PAGE_SIZE, resolvePaginationMeta } from "@/lib/pagination";
import { toast } from "sonner";

export function InvitedCasesView() {
  const { user } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [invitationFilter, setInvitationFilter] = useState("all");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery(
    getInvitationsOptions({
      query: {
        page,
        limit: DEFAULT_PAGE_SIZE,
        search: search || undefined,
        status:
          invitationFilter !== "all"
            ? (invitationFilter as "pending" | "accepted" | "declined" | "superseded")
            : undefined,
      },
    }),
  );

  const acceptMutation = useMutation({
    ...patchInvitationsByIdMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getInvitationsQueryKey() });
      toast.success("Case invitation accepted");
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  const invitations = data?.data ?? [];
  const paginationMeta = resolvePaginationMeta(data?.meta, page);

  const rows = useMemo(() => {
    return invitations
      .map((inv) => ({ invitation: inv, case: inv.case }))
      .filter(({ case: c }) => {
        if (status !== "all" && c.status !== status) return false;
        return true;
      });
  }, [invitations, status]);

  const handleAccept = (invitationId: string) => {
    acceptMutation.mutate({
      path: { id: invitationId },
      body: { status: "accepted" },
    });
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
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Invited Cases"
        description="Cases you've been invited to tutor"
        count={paginationMeta.total}
      />

      <Card className="shadow-sm">
        <CardContent className="pt-6">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row">
            <SearchInput
              value={search}
              onChange={(value) => {
                setSearch(value);
                setPage(1);
              }}
              placeholder="Search cases..."
            />
            <Select
              value={status}
              onValueChange={(v) => {
                if (v) {
                  setStatus(v);
                  setPage(1);
                }
              }}
            >
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Case status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="matched">Matched</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={invitationFilter}
              onValueChange={(v) => {
                if (v) {
                  setInvitationFilter(v);
                  setPage(1);
                }
              }}
            >
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue placeholder="Invitation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Invitations</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="declined">Declined</SelectItem>
                <SelectItem value="superseded">Superseded</SelectItem>
              </SelectContent>
            </Select>
          </div>

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
                {rows.map(({ case: c, invitation }) => (
                  <TableRow key={invitation.id}>
                    <TableCell className="font-medium">{c.title}</TableCell>
                    <TableCell className="text-muted-foreground">{c.subject}</TableCell>
                    <TableCell className="text-muted-foreground">{c.level}</TableCell>
                    <TableCell>{formatCurrency(c.budgetPerHour)}/hr</TableCell>
                    <TableCell><StatusBadge status={c.status} /></TableCell>
                    <TableCell>
                      <StatusBadge status={invitation.status} />
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(invitation.invitedAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {invitation.status === "pending" && (
                          <Button
                            size="sm"
                            disabled={acceptMutation.isPending}
                            onClick={() => handleAccept(invitation.id)}
                          >
                            <Check className="mr-1.5 h-3.5 w-3.5" />
                            Accept
                          </Button>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => router.push(`/cases/${c.id}`)}
                            >
                              View Case
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          <PaginationControls
            page={paginationMeta.page}
            totalPages={paginationMeta.totalPages}
            total={paginationMeta.total}
            pageSize={paginationMeta.limit}
            onPageChange={setPage}
          />
        </CardContent>
      </Card>
    </div>
  );
}
