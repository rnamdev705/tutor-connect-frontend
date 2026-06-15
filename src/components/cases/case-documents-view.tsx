"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { If, Then, Else } from "react-if";
import { ArrowLeft, FileText, Upload } from "lucide-react";
import {
  deleteDocumentsByIdMutation,
  getCasesByCaseIdDocumentsOptions,
  postCasesByCaseIdDocumentsMutation,
} from "@/api/@tanstack/react-query.gen";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SearchInput } from "@/components/common/search-input";
import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { DocumentTableSkeleton } from "@/components/common/content-skeletons";
import { PaginationControls } from "@/components/common/pagination-controls";
import { UploadDocumentModal } from "@/components/modals/upload-document-modal";
import { DeleteConfirmationModal } from "@/components/modals/delete-confirmation-modal";
import {
  PendingCaseDocumentRow,
} from "@/components/documents/pending-document-rows";
import { LoadingStatusCell } from "@/components/common/loading-status-cell";
import { DocumentRowActions } from "@/components/documents/document-row-actions";
import { useAuth } from "@/lib/auth-context";
import { getApiErrorMessage } from "@/lib/api-error";
import { formatDate, formatFileSize } from "@/lib/format";
import { evictDocumentBlobCache } from "@/lib/document-file";
import { DEFAULT_PAGE_SIZE, paginateItems } from "@/lib/pagination";
import { caseDetailQueryOptions } from "@/lib/queries/list-queries";
import { usePendingDocumentUploads } from "@/lib/hooks/use-pending-document-uploads";
import { usePendingDocumentDeletes } from "@/lib/hooks/use-pending-document-deletes";
import { textOverflow } from "@/lib/text-overflow";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface CaseDocumentsViewProps {
  caseId: string;
}

type DocumentRow =
  | {
      kind: "pending";
      id: string;
      fileName: string;
      mimeType: string;
      sizeBytes: number;
      uploadedByName: string | null;
      createdAt: string | null;
      uploadedById: string | null;
    }
  | {
      kind: "document";
      id: string;
      fileName: string;
      mimeType: string;
      sizeBytes: number;
      uploadedByName: string;
      createdAt: string | null;
      uploadedById: string;
    };

function getFileTypeCategory(mimeType: string) {
  if (mimeType === "application/pdf") return "pdf";
  if (mimeType.startsWith("image/")) return "image";
  if (
    mimeType.includes("word") ||
    mimeType === "application/msword"
  ) {
    return "document";
  }
  return "other";
}

export function CaseDocumentsView({ caseId }: CaseDocumentsViewProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);
  const { pendingUploads, trackUpload } = usePendingDocumentUploads(caseId);
  const { trackDelete, isDeleting: isDeletingDocument } = usePendingDocumentDeletes();

  const { data: caseData, isLoading: caseLoading, isError } = useQuery(
    caseDetailQueryOptions(caseId),
  );

  const { data: documentsData, isLoading: docsLoading } = useQuery({
    ...getCasesByCaseIdDocumentsOptions({ path: { caseId } }),
    enabled: !!caseData,
  });

  const uploadMutation = useMutation({
    ...postCasesByCaseIdDocumentsMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getCasesByCaseIdDocumentsOptions({ path: { caseId } }).queryKey,
      });
      toast.success("Document uploaded successfully");
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  const deleteDocumentMutation = useMutation({
    ...deleteDocumentsByIdMutation(),
    onSuccess: (_, variables) => {
      evictDocumentBlobCache(variables.path.id);
      queryClient.invalidateQueries({
        queryKey: getCasesByCaseIdDocumentsOptions({ path: { caseId } }).queryKey,
      });
      toast.success("Document deleted");
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  const documents = documentsData?.data ?? [];

  const allRows = useMemo<DocumentRow[]>(() => {
    const pendingRows: DocumentRow[] = pendingUploads.map((upload) => ({
      kind: "pending",
      id: upload.id,
      fileName: upload.fileName,
      mimeType: upload.mimeType,
      sizeBytes: upload.sizeBytes,
      uploadedByName: null,
      createdAt: null,
      uploadedById: null,
    }));

    const documentRows: DocumentRow[] = [...documents]
      .sort((a, b) => Date.parse(b.createdAt ?? "") - Date.parse(a.createdAt ?? ""))
      .map((doc) => ({
        kind: "document" as const,
        id: doc.id,
        fileName: doc.originalName,
        mimeType: doc.mimeType,
        sizeBytes: doc.sizeBytes,
        uploadedByName: doc.uploadedByName,
        createdAt: doc.createdAt,
        uploadedById: doc.uploadedById,
      }));

    return [...pendingRows, ...documentRows];
  }, [documents, pendingUploads]);

  const filteredRows = useMemo(
    () =>
      allRows.filter((row) => {
        if (search && !row.fileName.toLowerCase().includes(search.toLowerCase())) {
          return false;
        }
        if (typeFilter !== "all" && getFileTypeCategory(row.mimeType) !== typeFilter) {
          return false;
        }
        return true;
      }),
    [allRows, search, typeFilter],
  );

  const pagination = useMemo(
    () => paginateItems(filteredRows, page, DEFAULT_PAGE_SIZE),
    [filteredRows, page],
  );

  const handleDeleteDocument = () => {
    if (!documentToDelete) return;
    const id = documentToDelete;
    setDeleteOpen(false);
    setDocumentToDelete(null);
    trackDelete(id, () =>
      deleteDocumentMutation.mutateAsync({ path: { id } }),
    );
  };

  if (caseLoading || docsLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/cases/${caseId}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Documents</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Case documents and uploads
            </p>
          </div>
        </div>
        <Card className="shadow-sm">
          <CardContent className="pt-6">
            <DocumentTableSkeleton />
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
        actionLabel={user?.role === "tutor" ? "Back to invited cases" : "Back to cases"}
        actionHref={user?.role === "tutor" ? "/invitations" : "/cases"}
      />
    );
  }

  const isParent = user?.role === "parent";
  const isOwner = user?.id === caseData.ownerId;
  const canManage = isParent && isOwner;
  const isInvitedTutor =
    user?.role === "tutor" &&
    caseData.invitations.some((inv) => inv.tutorUserId === user.id);

  if (user?.role === "tutor" && !isInvitedTutor) {
    return (
      <ErrorState
        title="Access denied"
        message="You can only view documents for cases you have been invited to."
        actionLabel="Back to case"
        actionHref={`/cases/${caseId}`}
      />
    );
  }

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
            <h1 className={textOverflow.pageTitle}>Documents</h1>
            <p className={cn(textOverflow.pageSubtitle, "truncate")}>
              {caseData.title} · {allRows.length} file(s)
            </p>
          </div>
        </div>
        {canManage && (
          <Button onClick={() => setUploadOpen(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Upload
          </Button>
        )}
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">All documents</CardTitle>
          <CardDescription>Search and filter documents attached to this case.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <SearchInput
              value={search}
              onChange={(value) => {
                setSearch(value);
                setPage(1);
              }}
              placeholder="Search by file name..."
            />
            <Select
              value={typeFilter}
              onValueChange={(value) => {
                if (value) {
                  setTypeFilter(value);
                  setPage(1);
                }
              }}
            >
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue placeholder="File type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="document">Word</SelectItem>
                <SelectItem value="image">Images</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <If condition={filteredRows.length === 0}>
            <Then>
              <EmptyState
                icon={FileText}
                title="No documents found"
                description={
                  canManage
                    ? "Try adjusting your search or filters, or upload a new file."
                    : "Try adjusting your search or filters."
                }
                actionLabel={canManage ? "Upload Document" : undefined}
                onAction={canManage ? () => setUploadOpen(true) : undefined}
                variant="compact"
              />
            </Then>
            <Else>
              <div className="overflow-x-auto rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[180px]">File Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Uploaded By</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="w-32" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pagination.items.map((row) => {
                      if (row.kind === "pending") {
                        return (
                          <PendingCaseDocumentRow
                            key={row.id}
                            upload={{
                              id: row.id,
                              fileName: row.fileName,
                              mimeType: row.mimeType,
                              sizeBytes: row.sizeBytes,
                            }}
                          />
                        );
                      }

                      const canDeleteDocument = canManage;
                      const deleting = isDeletingDocument(row.id);

                      return (
                        <TableRow
                          key={row.id}
                          className={deleting ? "bg-muted/40 opacity-60" : undefined}
                        >
                          <TableCell className={textOverflow.fileName}>
                            {row.fileName}
                          </TableCell>
                          <TableCell className="text-muted-foreground text-xs">
                            {row.mimeType.split("/").pop()?.toUpperCase()}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {formatFileSize(row.sizeBytes)}
                          </TableCell>
                          <TableCell className={textOverflow.tableMeta}>
                            {row.uploadedByName}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {deleting ? (
                              <LoadingStatusCell label="Deleting..." />
                            ) : (
                              formatDate(row.createdAt)
                            )}
                          </TableCell>
                          <TableCell>
                            {deleting ? null : (
                              <DocumentRowActions
                                document={{
                                  id: row.id,
                                  originalName: row.fileName,
                                  mimeType: row.mimeType,
                                }}
                                canDelete={canDeleteDocument}
                                onDelete={() => {
                                  if (deleting) return;
                                  setDocumentToDelete(row.id);
                                  setDeleteOpen(true);
                                }}
                              />
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
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

      <UploadDocumentModal
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        onUpload={(file) =>
          trackUpload(file, () =>
            uploadMutation.mutateAsync({
              path: { caseId },
              body: { file },
            }),
          )
        }
      />
      <DeleteConfirmationModal
        open={deleteOpen}
        onOpenChange={(open) => {
          if (
            open &&
            documentToDelete &&
            isDeletingDocument(documentToDelete)
          ) {
            return;
          }
          setDeleteOpen(open);
          if (!open) setDocumentToDelete(null);
        }}
        title="Delete document"
        description="This document will be permanently removed from this case."
        onConfirm={handleDeleteDocument}
      />
    </div>
  );
}
