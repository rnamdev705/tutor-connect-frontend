"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Briefcase, Eye, MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";
import { deleteCasesByIdMutation } from "@/api/@tanstack/react-query.gen";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import { DeleteConfirmationModal } from "@/components/modals/delete-confirmation-modal";
import { PaginationControls } from "@/components/common/pagination-controls";
import { DeletingStatusCell } from "@/components/common/pending-status-cells";
import {
  FilterSelect,
  ListFilterToolbar,
  useDebouncedValue,
} from "@/components/common/list-filter-toolbar";
import { useAuth } from "@/lib/auth-context";
import { getApiErrorMessage } from "@/lib/api-error";
import { usePendingCaseDeletes } from "@/lib/hooks/use-pending-case-deletes";
import { formatCurrency, formatDate } from "@/lib/format";
import {
  DEFAULT_PAGE_SIZE,
  resolvePaginationMeta,
} from "@/lib/pagination";
import { casesListQueryOptions } from "@/lib/queries/list-queries";
import { invalidateAllCasesList } from "@/lib/queries/invalidate";
import { LEVELS, SUBJECTS } from "@/lib/constants";
import type { Case } from "@/api/types.gen";
import { toast } from "sonner";

function CaseTableRow({
  caseItem,
  onNavigate,
  onDelete,
  isDeleting,
}: {
  caseItem: Case;
  onNavigate: (path: string) => void;
  onDelete: (caseItem: Case) => void;
  isDeleting: boolean;
}) {
  return (
    <TableRow className={isDeleting ? "bg-muted/40" : undefined}>
      <TableCell className="font-medium">{caseItem.title}</TableCell>
      <TableCell className="text-muted-foreground">{caseItem.subject}</TableCell>
      <TableCell className="text-muted-foreground">{caseItem.level}</TableCell>
      <TableCell>{formatCurrency(caseItem.budgetPerHour)}/hr</TableCell>
      <TableCell>
        {isDeleting ? <DeletingStatusCell /> : <StatusBadge status={caseItem.status} />}
      </TableCell>
      <TableCell>{caseItem.invitedCount}</TableCell>
      <TableCell className="text-muted-foreground">
        {formatDate(caseItem.updatedAt)}
      </TableCell>
      <TableCell>
        {!isDeleting && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onNavigate(`/cases/${caseItem.id}`)}>
                <Eye className="mr-2 h-4 w-4" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onNavigate(`/cases/${caseItem.id}/edit`)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => onDelete(caseItem)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </TableCell>
    </TableRow>
  );
}

export function CasesListView() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("all");
  const [level, setLevel] = useState("all");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [caseToDelete, setCaseToDelete] = useState<Case | null>(null);
  const { trackDelete, isDeleting, hasPending } = usePendingCaseDeletes();
  const debouncedSearch = useDebouncedValue(search);

  useEffect(() => {
    const initialSearch = searchParams.get("search");
    if (initialSearch) setSearch(initialSearch);
  }, [searchParams]);

  const queryOptions = useMemo(
    () =>
      casesListQueryOptions({
        page,
        limit: DEFAULT_PAGE_SIZE,
        ...(debouncedSearch.trim() ? { search: debouncedSearch.trim() } : {}),
        ...(subject !== "all" ? { subject } : {}),
        ...(level !== "all" ? { level } : {}),
        ...(status !== "all"
          ? { status: status as "open" | "matched" | "closed" }
          : {}),
      }),
    [page, debouncedSearch, subject, level, status],
  );

  const { data, isLoading, isFetching } = useQuery(queryOptions);
  const cases = data?.data ?? [];
  const pagination = resolvePaginationMeta(data?.meta, page, DEFAULT_PAGE_SIZE);

  const deleteMutation = useMutation({
    ...deleteCasesByIdMutation(),
    onSuccess: () => {
      void invalidateAllCasesList(queryClient);
      toast.success("Case deleted");
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  const handleDeleteCase = () => {
    if (!caseToDelete) return;
    const id = caseToDelete.id;
    setDeleteOpen(false);
    setCaseToDelete(null);
    trackDelete(id, () => deleteMutation.mutateAsync({ path: { id } }));
  };

  const hasActiveFilters =
    !!debouncedSearch || subject !== "all" || level !== "all" || status !== "all";
  const showInitialEmpty =
    !isLoading && !isFetching && cases.length === 0 && !hasActiveFilters;

  if (showInitialEmpty) {
    return (
      <div className="space-y-6">
        <PageHeader title="My Cases" description="Manage your tutoring cases" />
        <EmptyState
          icon={Briefcase}
          title="No cases yet"
          description="Create your first tutoring case to start finding qualified tutors for your child."
          actionLabel="Create first case"
          onAction={() => router.push("/cases/new")}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="My Cases" count={pagination.total}>
        {user?.role === "parent" && (
          <Button asChild>
            <Link href="/cases/new">
              <Plus className="mr-2 h-4 w-4" />
              Create Case
            </Link>
          </Button>
        )}
      </PageHeader>

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
              value={subject}
              onValueChange={(value) => {
                setSubject(value);
                setPage(1);
              }}
              placeholder="Subject"
              items={[
                { value: "all", label: "All Subjects" },
                ...SUBJECTS.map((s) => ({ value: s, label: s })),
              ]}
            />
            <FilterSelect
              value={level}
              onValueChange={(value) => {
                setLevel(value);
                setPage(1);
              }}
              placeholder="Level"
              className="w-full sm:w-36"
              items={[
                { value: "all", label: "All Levels" },
                ...LEVELS.map((l) => ({ value: l, label: l })),
              ]}
            />
            <FilterSelect
              value={status}
              onValueChange={(value) => {
                setStatus(value);
                setPage(1);
              }}
              placeholder="Status"
              className="w-full sm:w-36"
              items={[
                { value: "all", label: "All Statuses" },
                { value: "open", label: "Open" },
                { value: "matched", label: "Matched" },
                { value: "closed", label: "Closed" },
              ]}
            />
          </ListFilterToolbar>

          {isLoading ? (
            <TableContentSkeleton />
          ) : cases.length === 0 ? (
            <EmptyState
              icon={Briefcase}
              title="No matching cases"
              description="Try adjusting your search or filters to find cases."
              variant="compact"
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Invited</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {cases.map((c) => (
                  <CaseTableRow
                    key={c.id}
                    caseItem={c}
                    isDeleting={isDeleting(c.id)}
                    onNavigate={router.push}
                    onDelete={(item) => {
                      if (hasPending || isDeleting(item.id)) return;
                      setCaseToDelete(item);
                      setDeleteOpen(true);
                    }}
                  />
                ))}
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

      <DeleteConfirmationModal
        open={deleteOpen}
        onOpenChange={(open) => {
          if (open && hasPending) return;
          setDeleteOpen(open);
        }}
        title="Delete case"
        description={
          caseToDelete
            ? `"${caseToDelete.title}" and all its documents and invitations will be permanently removed.`
            : "This case and all related data will be permanently removed."
        }
        onConfirm={handleDeleteCase}
      />
    </div>
  );
}
