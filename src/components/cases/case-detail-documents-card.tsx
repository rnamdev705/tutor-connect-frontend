"use client";

import Link from "next/link";
import { FileText, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/common/empty-state";
import { LoadingStatusCell } from "@/components/common/loading-status-cell";
import { PendingCaseDocumentRow } from "@/components/documents/pending-document-rows";
import { DocumentRowActions } from "@/components/documents/document-row-actions";
import { formatDate, formatFileSize } from "@/lib/format";
import { PREVIEW_LIMIT } from "@/lib/pagination";
import type { Document } from "@/api/types.gen";
import type { PendingDocumentUpload } from "@/lib/hooks/use-pending-document-uploads";

interface CaseDetailDocumentsCardProps {
  caseId: string;
  documents: Document[];
  pendingUploads: PendingDocumentUpload[];
  documentsLoading: boolean;
  caseIsDeleting: boolean;
  canManage: boolean;
  userId?: string;
  isDeletingDocument: (id: string) => boolean;
  onUploadOpen: () => void;
  onDeleteDocument: (documentId: string) => void;
}

export function CaseDetailDocumentsCard({
  caseId,
  documents,
  pendingUploads,
  documentsLoading,
  caseIsDeleting,
  canManage,
  userId,
  isDeletingDocument,
  onUploadOpen,
  onDeleteDocument,
}: CaseDetailDocumentsCardProps) {
  const allDocumentRows = [
    ...pendingUploads.map((upload) => ({ kind: "pending" as const, row: upload })),
    ...documents.map((doc) => ({ kind: "document" as const, row: doc })),
  ];
  const documentCount = allDocumentRows.length;
  const showDocumentsSkeleton = documentsLoading && pendingUploads.length === 0;
  const showDocumentsEmpty = !documentsLoading && documentCount === 0;
  const previewDocumentRows = allDocumentRows.slice(0, PREVIEW_LIMIT);

  return (
    <Card className="shadow-sm lg:col-span-2">
      <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3 space-y-0">
        <div className="min-w-0">
          <CardTitle className="text-base">Documents</CardTitle>
          {showDocumentsSkeleton ? (
            <Skeleton className="h-4 w-20" />
          ) : (
            <CardDescription>{documentCount} file(s)</CardDescription>
          )}
        </div>
        <Button
          size="sm"
          className="shrink-0"
          disabled={caseIsDeleting}
          onClick={onUploadOpen}
        >
          <Upload className="mr-2 h-4 w-4" />
          Upload
        </Button>
      </CardHeader>
      <CardContent>
        {showDocumentsSkeleton ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-10 w-full" />
            ))}
          </div>
        ) : showDocumentsEmpty ? (
          <EmptyState
            icon={FileText}
            title="No documents yet"
            description="Upload supporting files for this case."
            actionLabel="Upload Document"
            onAction={() => {
              if (!caseIsDeleting) onUploadOpen();
            }}
            variant="compact"
          />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[140px]">File Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Uploaded By</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="w-32" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {previewDocumentRows.map((item) => {
                  if (item.kind === "pending") {
                    return <PendingCaseDocumentRow key={item.row.id} upload={item.row} />;
                  }

                  const d = item.row;
                  const canDeleteDocument = canManage || userId === d.uploadedById;
                  const deleting = isDeletingDocument(d.id);

                  return (
                    <TableRow
                      key={d.id}
                      className={deleting ? "bg-muted/40 opacity-60" : undefined}
                    >
                      <TableCell className="max-w-[200px] truncate font-medium">
                        {d.originalName}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs">
                        {d.mimeType.split("/").pop()?.toUpperCase()}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatFileSize(d.sizeBytes)}
                      </TableCell>
                      <TableCell className="max-w-[120px] truncate text-muted-foreground">
                        {d.uploadedByName}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {deleting ? <LoadingStatusCell label="Deleting..." /> : formatDate(d.createdAt)}
                      </TableCell>
                      <TableCell>
                        {!deleting && (
                          <DocumentRowActions
                            document={{
                              id: d.id,
                              originalName: d.originalName,
                              mimeType: d.mimeType,
                            }}
                            disabled={caseIsDeleting || deleting}
                            canDelete={canDeleteDocument}
                            onDelete={() => {
                              if (deleting || caseIsDeleting) return;
                              onDeleteDocument(d.id);
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
        )}
        {!showDocumentsSkeleton && (
          <Button variant="outline" size="sm" className="mt-4 w-full" asChild>
            <Link href={`/cases/${caseId}/documents`}>
              View all{documentCount > 0 ? ` (${documentCount})` : ""}
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
