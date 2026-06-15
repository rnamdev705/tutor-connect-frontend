"use client";

import { useState } from "react";
import Link from "next/link";
import { If, Then, Else } from "react-if";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FileText, Pencil, Upload } from "lucide-react";
import {
  deleteDocumentsByIdMutation,
  getTutorsByIdDocumentsOptions,
  postTutorsMeProfileDocumentsMutation,
} from "@/api/@tanstack/react-query.gen";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserAvatar } from "@/components/common/user-avatar";
import { EmptyState } from "@/components/common/empty-state";
import { DocumentRowActions } from "@/components/documents/document-row-actions";
import {
  DocumentTableSkeleton,
  ProfileActivitySkeleton,
} from "@/components/common/content-skeletons";
import { ErrorState } from "@/components/common/error-state";
import { UploadDocumentModal } from "@/components/modals/upload-document-modal";
import { PendingTutorDocumentRow } from "@/components/documents/pending-document-rows";
import { LoadingStatusCell } from "@/components/common/loading-status-cell";
import { DeleteConfirmationModal } from "@/components/modals/delete-confirmation-modal";
import { useCurrentTutor } from "@/lib/hooks/use-current-tutor";
import { useTutorSubscription } from "@/lib/hooks/use-tutor-subscription";
import { TutorProfileSubscriptionCard } from "@/components/profile/tutor-profile-subscription-card";
import { usePendingDocumentUploads } from "@/lib/hooks/use-pending-document-uploads";
import { usePendingDocumentDeletes } from "@/lib/hooks/use-pending-document-deletes";
import { getApiErrorMessage } from "@/lib/api-error";
import { evictDocumentBlobCache } from "@/lib/document-file";
import { formatDate, formatFileSize } from "@/lib/format";
import { textOverflow } from "@/lib/text-overflow";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function TutorProfileView() {
  const { tutor, isLoading: tutorLoading, isError: tutorError } = useCurrentTutor();
  const { subscription } = useTutorSubscription();
  const queryClient = useQueryClient();
  const [uploadOpen, setUploadOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);
  const { pendingUploads, trackUpload } = usePendingDocumentUploads();
  const { trackDelete, isDeleting, hasPending: hasPendingDeletes } = usePendingDocumentDeletes();

  const { data: documentsData, isLoading: docsLoading } = useQuery({
    ...getTutorsByIdDocumentsOptions({ path: { id: tutor?.id ?? "" } }),
    enabled: !!tutor?.id,
  });

  const uploadMutation = useMutation({
    ...postTutorsMeProfileDocumentsMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getTutorsByIdDocumentsOptions({ path: { id: tutor?.id ?? "" } }).queryKey,
      });
      toast.success("Document uploaded");
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
  const deleteMutation = useMutation({
    ...deleteDocumentsByIdMutation(),
    onSuccess: (_, variables) => {
      evictDocumentBlobCache(variables.path.id);
      queryClient.invalidateQueries({
        queryKey: getTutorsByIdDocumentsOptions({ path: { id: tutor?.id ?? "" } }).queryKey,
      });
      toast.success("Document deleted");
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  if (tutorLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">My Profile</h1>
        </div>
        <ProfileActivitySkeleton />
      </div>
    );
  }

  if (tutorError || !tutor) {
    return (
      <ErrorState
        title="Profile not found"
        message="We couldn't find a tutor profile linked to your account."
        actionLabel="Go to dashboard"
        actionHref="/dashboard"
      />
    );
  }

  const documents = documentsData?.data ?? [];
  const documentCount = documents.length + pendingUploads.length;
  const showDocumentsTable = documentCount > 0;

  const handleUpload = (file: File) => {
    trackUpload(file, () => uploadMutation.mutateAsync({ body: { file } }));
  };

  const handleDelete = () => {
    if (!documentToDelete) return;
    const id = documentToDelete;
    setDeleteOpen(false);
    setDocumentToDelete(null);
    trackDelete(id, () => deleteMutation.mutateAsync({ path: { id } }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">My Profile</h1>
        <Button variant="outline" asChild>
          <Link href="/profile/edit">
            <Pencil className="mr-2 h-4 w-4" />
            Edit Profile
          </Link>
        </Button>
      </div>

      <Card className="shadow-sm" size="sm">
        <CardContent className="flex items-center gap-4">
          <UserAvatar name={tutor.displayName} size="lg" />
          <div className="min-w-0 flex-1">
            <h2 className={cn(textOverflow.cardName, "text-lg")}>{tutor.displayName}</h2>
            <p className={textOverflow.pageSubtitle}>
              {tutor.yearsOfExperience} years experience · Tutor
            </p>
          </div>
        </CardContent>
      </Card>

      <TutorProfileSubscriptionCard subscription={subscription} />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Qualifications</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {tutor.qualifications.map((q) => (
                <li key={q} className={textOverflow.listItem}>{q}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Experience</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm">
              <span className="text-muted-foreground">Years: </span>
              {tutor.yearsOfExperience}
            </p>
            <div>
              <p className="mb-2 text-sm text-muted-foreground">Subjects:</p>
              <p className={textOverflow.listItem}>{tutor.subjectsTaught.join(", ")}</p>
            </div>
            <p className={textOverflow.prose}>
              {tutor.teachingBackground}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3 space-y-0">
          <CardTitle className="text-base">Documents</CardTitle>
          <Button
            size="sm"
            className="shrink-0"
            disabled={hasPendingDeletes}
            onClick={() => setUploadOpen(true)}
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload Document
          </Button>
        </CardHeader>
        <CardContent>
          {docsLoading ? (
            <DocumentTableSkeleton rows={3} />
          ) : (
            <If condition={!showDocumentsTable}>
              <Then>
                <EmptyState
                  icon={FileText}
                  title="No documents yet"
                  description="Upload qualifications or supporting files to your profile."
                  actionLabel="Upload Document"
                  onAction={() => {
                    if (!hasPendingDeletes) setUploadOpen(true);
                  }}
                  variant="compact"
                />
              </Then>
              <Else>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>File Name</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Upload Date</TableHead>
                      <TableHead className="w-24" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingUploads.map((upload) => (
                      <PendingTutorDocumentRow key={upload.id} upload={upload} />
                    ))}
                    {documents.map((d) => {
                      const deleting = isDeleting(d.id);

                      return (
                      <TableRow
                        key={d.id}
                        className={deleting ? "bg-muted/40 opacity-60" : undefined}
                      >
                        <TableCell className={textOverflow.fileName}>
                        {d.originalName}
                      </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatFileSize(d.sizeBytes)}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {deleting ? <LoadingStatusCell label="Deleting..." /> : formatDate(d.createdAt)}
                        </TableCell>
                        <TableCell>
                          {deleting ? null : (
                            <DocumentRowActions
                              document={d}
                              disabled={deleting}
                              canDelete
                              onDelete={() => {
                                setDocumentToDelete(d.id);
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
              </Else>
            </If>
          )}
        </CardContent>
      </Card>

      <UploadDocumentModal
        open={uploadOpen}
        onOpenChange={(open) => {
          if (open && hasPendingDeletes) return;
          setUploadOpen(open);
        }}
        onUpload={handleUpload}
      />
      <DeleteConfirmationModal
        open={deleteOpen}
        onOpenChange={(open) => {
          if (open && hasPendingDeletes) return;
          if (
            open &&
            documentToDelete &&
            isDeleting(documentToDelete)
          ) {
            return;
          }
          setDeleteOpen(open);
        }}
        title="Delete document"
        description="This document will be permanently removed from your profile."
        onConfirm={handleDelete}
      />
    </div>
  );
}
