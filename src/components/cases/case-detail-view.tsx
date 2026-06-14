"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { If, Then, Else, When } from "react-if";
import {
  Download,
  FileText,
  Loader2,
  MoreHorizontal,
  Pencil,
  Trash2,
  Upload,
  UserPlus,
  Users,
} from "lucide-react";
import {
  deleteCasesByIdInvitationsByTutorIdMutation,
  deleteCasesByIdMutation,
  deleteDocumentsByIdMutation,
  getCasesByCaseIdDocumentsOptions,
  getCasesByIdOptions,
  getCasesByIdQueryKey,
  getCasesQueryKey,
  postCasesByCaseIdDocumentsMutation,
  postCasesByIdInvitationsMutation,
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
import { StatusBadge } from "@/components/common/status-badge";
import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { ActionBusyOverlay } from "@/components/common/action-busy-overlay";
import { UserAvatar } from "@/components/common/user-avatar";
import { InviteTutorModal } from "@/components/modals/invite-tutor-modal";
import { UploadDocumentModal } from "@/components/modals/upload-document-modal";
import { DeleteConfirmationModal } from "@/components/modals/delete-confirmation-modal";
import { PendingCaseDocumentRow, DeletingStatusCell, InvitingStatusCell, RemovingStatusCell } from "@/components/documents/pending-document-rows";
import { useAuth } from "@/lib/auth-context";
import { getApiErrorMessage } from "@/lib/api-error";
import { formatCurrency, formatDate, formatFileSize } from "@/lib/format";
import { PREVIEW_LIMIT } from "@/lib/pagination";
import { usePendingDocumentUploads } from "@/lib/hooks/use-pending-document-uploads";
import { usePendingDocumentDeletes } from "@/lib/hooks/use-pending-document-deletes";
import { usePendingCaseDeletes } from "@/lib/hooks/use-pending-case-deletes";
import { usePendingTutorInvites } from "@/lib/hooks/use-pending-invites";
import { usePendingInvitationRevokes } from "@/lib/hooks/use-pending-invitation-revokes";
import { toast } from "sonner";
import type { CaseDetail } from "@/api/types.gen";

interface CaseDetailViewProps {
  caseId: string;
}

export function CaseDetailView({ caseId }: CaseDetailViewProps) {
  const { user } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [inviteOpen, setInviteOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [deleteCaseOpen, setDeleteCaseOpen] = useState(false);
  const [deleteDocOpen, setDeleteDocOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);
  const { pendingUploads, trackUpload } = usePendingDocumentUploads(caseId);
  const { trackDelete, isDeleting: isDeletingDocument } = usePendingDocumentDeletes();
  const { trackDelete: trackCaseDelete, isDeleting: isDeletingCase } = usePendingCaseDeletes();
  const { pendingInvites, trackInvite } = usePendingTutorInvites(caseId);
  const { trackRevoke, isRevoking, hasPending: hasPendingRevokes } = usePendingInvitationRevokes(caseId);

  const { data: caseData, isLoading, isError } = useQuery(
    getCasesByIdOptions({ path: { id: caseId } }),
  );

  const { data: documentsData } = useQuery({
    ...getCasesByCaseIdDocumentsOptions({ path: { caseId } }),
    enabled: !!caseData,
  });

  const inviteMutation = useMutation({
    ...postCasesByIdInvitationsMutation(),
    onSuccess: (invitation, variables) => {
      const tutorProfileId = variables.body?.tutorProfileId;

      queryClient.setQueryData(
        getCasesByIdQueryKey({ path: { id: caseId } }),
        (old: CaseDetail | undefined) => {
          if (!old) return old;

          if (
            old.invitations.some(
              (item) =>
                item.id === invitation.id ||
                (tutorProfileId && item.tutorProfileId === tutorProfileId),
            )
          ) {
            return old;
          }

          return {
            ...old,
            invitedTutorIds:
              tutorProfileId && !old.invitedTutorIds.includes(tutorProfileId)
                ? [...old.invitedTutorIds, tutorProfileId]
                : old.invitedTutorIds,
            invitations: [{ ...invitation, caseId }, ...old.invitations],
          };
        },
      );

      void queryClient.invalidateQueries({ queryKey: getCasesQueryKey() });
      toast.success("Tutor invited successfully");
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  const revokeMutation = useMutation({
    ...deleteCasesByIdInvitationsByTutorIdMutation(),
    onSuccess: (_, variables) => {
      const tutorUserId = variables.path.tutorId;

      queryClient.setQueryData(
        getCasesByIdQueryKey({ path: { id: caseId } }),
        (old: CaseDetail | undefined) => {
          if (!old) return old;

          const removed = old.invitations.find(
            (inv) => inv.tutorUserId === tutorUserId,
          );

          return {
            ...old,
            invitedTutorIds: removed?.tutorProfileId
              ? old.invitedTutorIds.filter((id) => id !== removed.tutorProfileId)
              : old.invitedTutorIds,
            invitations: old.invitations.filter(
              (inv) => inv.tutorUserId !== tutorUserId,
            ),
          };
        },
      );

      void queryClient.invalidateQueries({ queryKey: getCasesQueryKey() });
      toast.success("Invitation removed");
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
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

  const deleteCaseMutation = useMutation({
    ...deleteCasesByIdMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getCasesQueryKey() });
      toast.success("Case deleted");
      router.push("/cases");
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  const deleteDocumentMutation = useMutation({
    ...deleteDocumentsByIdMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getCasesByCaseIdDocumentsOptions({ path: { caseId } }).queryKey,
      });
      toast.success("Document deleted");
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  const handleDeleteCase = () => {
    setDeleteCaseOpen(false);
    trackCaseDelete(caseId, () =>
      deleteCaseMutation.mutateAsync({ path: { id: caseId } }),
    );
  };

  const handleDeleteDocument = () => {
    if (!documentToDelete) return;
    const id = documentToDelete;
    setDeleteDocOpen(false);
    setDocumentToDelete(null);
    trackDelete(id, () =>
      deleteDocumentMutation.mutateAsync({ path: { id } }),
    );
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
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
        message="You can only view cases you have been invited to."
        actionLabel="Go to invited cases"
        actionHref="/invitations"
      />
    );
  }

  const activePendingInvites = pendingInvites.filter(
    (pending) =>
      !caseData.invitations.some(
        (inv) => inv.tutorProfileId === pending.tutorProfileId,
      ),
  );

  const inviteInProgress = activePendingInvites.length > 0;

  const sortedInvitations = [...caseData.invitations].sort(
    (a, b) => Date.parse(b.invitedAt ?? "") - Date.parse(a.invitedAt ?? ""),
  );

  const allTutorRows = [
    ...activePendingInvites.map((inv) => ({
      kind: "pending" as const,
      row: inv,
    })),
    ...sortedInvitations.map((inv) => ({
      kind: "invitation" as const,
      row: inv,
    })),
  ];
  const tutorTotalCount = allTutorRows.length;
  const previewTutorRows = allTutorRows.slice(0, PREVIEW_LIMIT);

  const documents = documentsData?.data ?? [];
  const allDocumentRows = [
    ...pendingUploads.map((upload) => ({ kind: "pending" as const, row: upload })),
    ...documents.map((doc) => ({ kind: "document" as const, row: doc })),
  ];
  const documentCount = allDocumentRows.length;
  const showDocumentsTable = documentCount > 0;
  const previewDocumentRows = allDocumentRows.slice(0, PREVIEW_LIMIT);
  const caseIsDeleting = isDeletingCase(caseId);
  const pageBusy = caseIsDeleting;

  return (
    <div className="relative space-y-6">
      <When condition={caseIsDeleting}>
        <ActionBusyOverlay message="Deleting case..." />
      </When>
      <div
        className={`space-y-6 ${pageBusy ? "pointer-events-none select-none opacity-60" : ""}`}
      >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight">
              {caseData.title}
            </h1>
            <StatusBadge status={caseData.status} />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {caseData.subject} · {caseData.level}
          </p>
        </div>
        <When condition={canManage && !caseIsDeleting}>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href={`/cases/${caseData.id}/edit`}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </Button>
            <Button
              variant="destructive"
              disabled={caseIsDeleting}
              onClick={() => setDeleteCaseOpen(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </When>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Case Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-4 sm:grid-cols-2">
              {[
                ["Subject", caseData.subject],
                ["Level", caseData.level],
                ["Location", caseData.location],
                ["Budget", `${formatCurrency(caseData.budgetPerHour)}/hour`],
                ["Owner", caseData.ownerName],
                ["Created", formatDate(caseData.createdAt)],
                ["Updated", formatDate(caseData.updatedAt)],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
                  <dd className="mt-1 text-sm font-medium">{value}</dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>

        <When condition={canManage}>
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3 space-y-0">
              <div className="min-w-0">
                <CardTitle className="text-base">Invited Tutors</CardTitle>
                <CardDescription>
                  {caseData.invitations.length + activePendingInvites.length} tutor(s) invited
                </CardDescription>
              </div>
              <Button
                size="sm"
                className="shrink-0"
                disabled={inviteInProgress || hasPendingRevokes || caseIsDeleting}
                onClick={() => setInviteOpen(true)}
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Invite Tutor
              </Button>
            </CardHeader>
            <CardContent>
              <If condition={tutorTotalCount === 0}>
                <Then>
                  <EmptyState
                    icon={Users}
                    title="No invited tutors"
                    description="No tutors have been invited to this case yet."
                    variant="compact"
                  />
                </Then>
                <Else>
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
                              <InvitingStatusCell />
                            </div>
                          </li>
                        );
                      }

                      const inv = item.row;
                      const tutorInvitePending = pendingInvites.some(
                        (pending) => pending.tutorProfileId === inv.tutorProfileId,
                      );
                      const revoking = isRevoking(inv.tutorUserId);
                      const tutorName = inv.tutor?.displayName ?? "Unknown tutor";

                      return (
                      <li
                        key={inv.id}
                        className={`flex items-center gap-3 py-3 first:pt-0 last:pb-0 ${
                          tutorInvitePending || revoking ? "bg-muted/40 opacity-60" : ""
                        }`}
                      >
                        <UserAvatar
                          name={tutorName}
                          size="sm"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">
                            {tutorName}
                          </p>
                          {revoking ? (
                            <RemovingStatusCell />
                          ) : (
                            <p className="text-xs text-muted-foreground">
                              Invited {formatDate(inv.invitedAt)}
                            </p>
                          )}
                        </div>
                        {revoking ? null : <StatusBadge status={inv.status} />}
                        {revoking ? null : (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 shrink-0"
                              disabled={caseIsDeleting || tutorInvitePending || revoking}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {inv.tutorProfileId && (
                              <DropdownMenuItem
                                onClick={() =>
                                  router.push(`/tutors/${inv.tutorProfileId}`)
                                }
                              >
                                View Profile
                              </DropdownMenuItem>
                            )}
                            {inv.status !== "accepted" && (
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() =>
                                  trackRevoke(inv.tutorUserId, tutorName, () =>
                                    revokeMutation.mutateAsync({
                                      path: {
                                        id: caseId,
                                        tutorId: inv.tutorUserId,
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
              <Button
                variant="outline"
                size="sm"
                className="mt-4 w-full"
                asChild
              >
                <Link href={`/cases/${caseId}/tutors`}>
                  View all{tutorTotalCount > 0 ? ` (${tutorTotalCount})` : ""}
                </Link>
              </Button>
            </CardContent>
          </Card>
        </When>

        <Card className="shadow-sm lg:col-span-2">
        <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3 space-y-0">
          <div className="min-w-0">
            <CardTitle className="text-base">Documents</CardTitle>
            <CardDescription>{documentCount} file(s)</CardDescription>
          </div>
          <Button
            size="sm"
            className="shrink-0"
            disabled={caseIsDeleting}
            onClick={() => setUploadOpen(true)}
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload
          </Button>
        </CardHeader>
        <CardContent>
          <If condition={!showDocumentsTable}>
            <Then>
              <EmptyState
                icon={FileText}
                title="No documents yet"
                description="Upload supporting files for this case."
                actionLabel="Upload Document"
                onAction={() => {
                  if (!caseIsDeleting) setUploadOpen(true);
                }}
                variant="compact"
              />
            </Then>
            <Else>
              <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[140px]">File Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Uploaded By</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="w-24" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {previewDocumentRows.map((item) => {
                    if (item.kind === "pending") {
                      return (
                        <PendingCaseDocumentRow key={item.row.id} upload={item.row} />
                      );
                    }

                    const d = item.row;
                    const canDeleteDocument =
                      canManage || user?.id === d.uploadedById;
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
                        {deleting ? <DeletingStatusCell /> : formatDate(d.createdAt)}
                      </TableCell>
                      <TableCell>
                        {deleting ? null : (
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              disabled={caseIsDeleting || deleting}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            {canDeleteDocument && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive"
                                disabled={caseIsDeleting || deleting}
                                onClick={() => {
                                  if (deleting || caseIsDeleting) return;
                                  setDocumentToDelete(d.id);
                                  setDeleteDocOpen(true);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
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
          <Button
            variant="outline"
            size="sm"
            className="mt-4 w-full"
            asChild
          >
            <Link href={`/cases/${caseId}/documents`}>
              View all{documentCount > 0 ? ` (${documentCount})` : ""}
            </Link>
          </Button>
        </CardContent>
      </Card>
      </div>

      </div>

      <When condition={canManage}>
        <InviteTutorModal
          open={inviteOpen}
          onOpenChange={(open) => {
            if (open && (inviteInProgress || hasPendingRevokes || caseIsDeleting)) return;
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
      </When>
      <UploadDocumentModal
        open={uploadOpen}
        onOpenChange={(open) => {
          if (open && caseIsDeleting) return;
          setUploadOpen(open);
        }}
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
        open={deleteCaseOpen}
        onOpenChange={(open) => {
          if (open && caseIsDeleting) return;
          setDeleteCaseOpen(open);
        }}
        title="Delete case"
        description={`"${caseData.title}" and all its documents and invitations will be permanently removed.`}
        onConfirm={handleDeleteCase}
      />
      <DeleteConfirmationModal
        open={deleteDocOpen}
        onOpenChange={(open) => {
          if (open && caseIsDeleting) return;
          if (
            open &&
            documentToDelete &&
            isDeletingDocument(documentToDelete)
          ) {
            return;
          }
          setDeleteDocOpen(open);
          if (!open) setDocumentToDelete(null);
        }}
        title="Delete document"
        description="This document will be permanently removed from this case."
        onConfirm={handleDeleteDocument}
      />
    </div>
  );
}
