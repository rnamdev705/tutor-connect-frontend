"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Briefcase, Loader2, MoreHorizontal, Plus, Trash2 } from "lucide-react";
import {
  deleteCasesByIdMutation,
  getCasesOptions,
  getCasesQueryKey,
} from "@/api/@tanstack/react-query.gen";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import { DeleteConfirmationModal } from "@/components/modals/delete-confirmation-modal";
import { DeletingStatusCell } from "@/components/documents/pending-document-rows";
import { useAuth } from "@/lib/auth-context";
import { getApiErrorMessage } from "@/lib/api-error";
import { usePendingCaseDeletes } from "@/lib/hooks/use-pending-case-deletes";
import { formatCurrency, formatDate } from "@/lib/format";
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
      <TableCell>{caseItem.invitedTutorIds.length}</TableCell>
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
              View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onNavigate(`/cases/${caseItem.id}/edit`)}>
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
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("all");
  const [level, setLevel] = useState("all");
  const [status, setStatus] = useState("all");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [caseToDelete, setCaseToDelete] = useState<Case | null>(null);
  const { trackDelete, isDeleting } = usePendingCaseDeletes();

  const deleteMutation = useMutation({
    ...deleteCasesByIdMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getCasesQueryKey() });
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

  const { data, isLoading } = useQuery(
    getCasesOptions({
      query: {
        search: search || undefined,
        subject: subject !== "all" ? subject : undefined,
        level: level !== "all" ? level : undefined,
        status:
          status !== "all"
            ? (status as "open" | "matched" | "closed")
            : undefined,
      },
    }),
  );

  const cases = data?.data ?? [];

  const filtered = useMemo(() => cases, [cases]);

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (cases.length === 0 && !search && subject === "all" && level === "all" && status === "all") {
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
      <PageHeader title="My Cases" count={filtered.length}>
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
          <div className="mb-6 flex flex-col gap-3 sm:flex-row">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search cases..."
            />
            <Select value={subject} onValueChange={(v) => v && setSubject(v)}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {SUBJECTS.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={level} onValueChange={(v) => v && setLevel(v)}>
              <SelectTrigger className="w-full sm:w-36">
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                {LEVELS.map((l) => (
                  <SelectItem key={l} value={l}>{l}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={(v) => v && setStatus(v)}>
              <SelectTrigger className="w-full sm:w-36">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="matched">Matched</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filtered.length === 0 ? (
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
                {filtered.map((c) => (
                  <CaseTableRow
                    key={c.id}
                    caseItem={c}
                    isDeleting={isDeleting(c.id)}
                    onNavigate={router.push}
                    onDelete={(item) => {
                      setCaseToDelete(item);
                      setDeleteOpen(true);
                    }}
                  />
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <DeleteConfirmationModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
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
