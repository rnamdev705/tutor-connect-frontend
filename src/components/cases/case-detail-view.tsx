"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Trash2, Info } from "lucide-react";
import {
  deleteCasesByIdMutation,
  deleteDocumentsByIdMutation,
  getCasesByCaseIdDocumentsOptions,
  postCasesByCaseIdDocumentsMutation,
} from "@/api/@tanstack/react-query.gen";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/common/status-badge";
import { ErrorState } from "@/components/common/error-state";
import { CaseDetailContentSkeleton } from "@/components/common/content-skeletons";
import { ActionBusyOverlay } from "@/components/common/action-busy-overlay";
import { InviteTutorModal } from "@/components/modals/invite-tutor-modal";
import { UploadDocumentModal } from "@/components/modals/upload-document-modal";
import { DeleteConfirmationModal } from "@/components/modals/delete-confirmation-modal";
import { CaseDetailInvitedTutorsCard } from "@/components/cases/case-detail-invited-tutors-card";
import { CaseDetailDocumentsCard } from "@/components/cases/case-detail-documents-card";
import { useAuth } from "@/lib/auth-context";
import { getApiErrorMessage } from "@/lib/api-error";
import { evictDocumentBlobCache } from "@/lib/document-file";
import { formatCurrency, formatDate } from "@/lib/format";
import { caseDetailQueryOptions } from "@/lib/queries/list-queries";
import { invalidateCaseData } from "@/lib/queries/invalidate";
import { canDeleteCase, canInviteTutorsToCase, isCaseEditLocked, matchedCaseHint } from "@/lib/case-invites";
import { useCaseInvitationMutations } from "@/lib/hooks/use-case-invitation-mutations";
import { usePendingDocumentUploads } from "@/lib/hooks/use-pending-document-uploads";
import { usePendingDocumentDeletes } from "@/lib/hooks/use-pending-document-deletes";
import { usePendingCaseDeletes } from "@/lib/hooks/use-pending-case-deletes";
import { usePendingTutorInvites } from "@/lib/hooks/use-pending-invites";
import { usePendingInvitationRevokes } from "@/lib/hooks/use-pending-invitation-revokes";
import { ConfirmActionModal } from "@/components/modals/confirm-action-modal";
import { InvitationStatusCell } from "@/components/cases/invitation-status-cell";
import { TutorInvitationResponseActions } from "@/components/cases/tutor-invitation-response-actions";
import { useTutorInvitationResponse } from "@/lib/hooks/use-tutor-invitation-response";
import { toast } from "sonner";

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
  const [declineInviteOpen, setDeclineInviteOpen] = useState(false);
  const [acceptInviteOpen, setAcceptInviteOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);

  const { accept, decline, isResponding, getResponseAction } = useTutorInvitationResponse();

  const { pendingUploads, trackUpload } = usePendingDocumentUploads(caseId);
  const { trackDelete, isDeleting: isDeletingDocument } = usePendingDocumentDeletes();
  const { trackDelete: trackCaseDelete, isDeleting: isDeletingCase } = usePendingCaseDeletes();
  const { pendingInvites, trackInvite } = usePendingTutorInvites(caseId);
  const { trackRevoke, isRevoking, hasPending: hasPendingRevokes } =
    usePendingInvitationRevokes(caseId);
  const { inviteMutation, revokeMutation } = useCaseInvitationMutations(caseId);

  const { data: caseData, isLoading, isError } = useQuery(caseDetailQueryOptions(caseId));

  const { data: documentsData, isLoading: documentsLoading } = useQuery({
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

  const deleteCaseMutation = useMutation({
    ...deleteCasesByIdMutation(),
    onSuccess: () => {
      void invalidateCaseData(queryClient, caseId);
      toast.success("Case deleted");
      router.push("/cases");
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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Case Details</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            View case information and documents
          </p>
        </div>
        <CaseDetailContentSkeleton />
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
        message="You can only view cases you have been invited to."
        actionLabel="Go to invited cases"
        actionHref="/invitations"
      />
    );
  }

  const activePendingInvites = pendingInvites.filter(
    (pending) =>
      !caseData.invitations.some((inv) => inv.tutorProfileId === pending.tutorProfileId),
  );
  const inviteInProgress = activePendingInvites.length > 0;
  const caseIsDeleting = isDeletingCase(caseId);
  const canInvite = canInviteTutorsToCase(caseData.status);
  const canDelete = canDeleteCase(caseData.status);
  const myInvitation =
    user?.role === "tutor"
      ? caseData.invitations.find((inv) => inv.tutorUserId === user.id)
      : undefined;
  const respondingToMine = myInvitation ? isResponding(myInvitation.id) : false;
  const myResponseAction = myInvitation ? getResponseAction(myInvitation.id) : undefined;

  return (
    <div className="relative space-y-6">
      {caseIsDeleting && <ActionBusyOverlay message="Deleting case..." />}
      <div
        className={`space-y-6 ${caseIsDeleting ? "pointer-events-none select-none opacity-60" : ""}`}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold tracking-tight">{caseData.title}</h1>
              <StatusBadge status={caseData.status} />
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {caseData.subject} · {caseData.level}
            </p>
          </div>
          {canManage && !caseIsDeleting && (
            <div className="flex gap-2">
              {!isCaseEditLocked(caseData.status) && (
                <Button variant="outline" asChild>
                  <Link href={`/cases/${caseData.id}/edit`}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </Button>
              )}
              {canDelete && (
                <Button
                  variant="destructive"
                  disabled={caseIsDeleting}
                  onClick={() => setDeleteCaseOpen(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              )}
            </div>
          )}
        </div>

        {canManage && caseData.status === "matched" && (
          <div className="flex items-start gap-2.5 rounded-lg border border-emerald-200 bg-emerald-50/60 px-4 py-3 text-sm text-emerald-950">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
            <p>{matchedCaseHint()}</p>
          </div>
        )}

        {myInvitation && (
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Your invitation</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <InvitationStatusCell
                invitationStatus={myInvitation.status}
                caseStatus={caseData.status}
                statusMessage={myInvitation.statusMessage}
                accepting={respondingToMine && myResponseAction === "accept"}
                declining={respondingToMine && myResponseAction === "decline"}
              />
              <TutorInvitationResponseActions
                invitationId={myInvitation.id}
                invitationStatus={myInvitation.status}
                caseStatus={caseData.status}
                isResponding={isResponding}
                getResponseAction={getResponseAction}
                onAcceptRequest={() => setAcceptInviteOpen(true)}
                onDeclineRequest={() => setDeclineInviteOpen(true)}
                size="default"
              />
            </CardContent>
          </Card>
        )}

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

          {canManage && (
            <CaseDetailInvitedTutorsCard
              caseId={caseId}
              caseData={caseData}
              activePendingInvites={activePendingInvites}
              inviteInProgress={inviteInProgress}
              hasPendingRevokes={hasPendingRevokes}
              caseIsDeleting={caseIsDeleting}
              isRevoking={isRevoking}
              onInviteOpen={() => setInviteOpen(true)}
              onRemoveInvitation={(tutorUserId, tutorName) =>
                trackRevoke(tutorUserId, tutorName, () =>
                  revokeMutation.mutateAsync({
                    path: { id: caseId, tutorId: tutorUserId },
                  }),
                )
              }
            />
          )}

          <CaseDetailDocumentsCard
            caseId={caseId}
            documents={documentsData?.data ?? []}
            pendingUploads={pendingUploads}
            documentsLoading={documentsLoading}
            caseIsDeleting={caseIsDeleting}
            canManage={canManage}
            isDeletingDocument={isDeletingDocument}
            onUploadOpen={() => setUploadOpen(true)}
            onDeleteDocument={(id) => {
              setDocumentToDelete(id);
              setDeleteDocOpen(true);
            }}
          />
        </div>
      </div>

      {canManage && canInvite && (
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
      )}

      <UploadDocumentModal
        open={uploadOpen}
        onOpenChange={(open) => {
          if (open && caseIsDeleting) return;
          setUploadOpen(open);
        }}
        onUpload={(file) =>
          trackUpload(file, () =>
            uploadMutation.mutateAsync({ path: { caseId }, body: { file } }),
          )
        }
      />

      <ConfirmActionModal
        open={acceptInviteOpen}
        onOpenChange={setAcceptInviteOpen}
        title="Accept invitation"
        description={`Accept the invitation to tutor "${caseData.title}"? You will be matched with this case and other pending tutors will no longer be able to accept.`}
        confirmLabel="Accept invitation"
        onConfirm={() => {
          if (!myInvitation) return;
          accept(myInvitation.id);
          setAcceptInviteOpen(false);
        }}
      />

      <ConfirmActionModal
        open={declineInviteOpen}
        onOpenChange={setDeclineInviteOpen}
        title="Decline invitation"
        description={`Decline the invitation to tutor "${caseData.title}"? The parent can invite you again later if the case is still open.`}
        confirmLabel="Decline invitation"
        onConfirm={() => {
          if (!myInvitation) return;
          decline(myInvitation.id);
        }}
      />

      <DeleteConfirmationModal
        open={deleteCaseOpen}
        onOpenChange={(open) => {
          if (open && caseIsDeleting) return;
          setDeleteCaseOpen(open);
        }}
        title="Delete case"
        description={`"${caseData.title}" and all its documents and invitations will be permanently removed.`}
        onConfirm={() => {
          setDeleteCaseOpen(false);
          trackCaseDelete(caseId, () =>
            deleteCaseMutation.mutateAsync({ path: { id: caseId } }),
          );
        }}
      />

      <DeleteConfirmationModal
        open={deleteDocOpen}
        onOpenChange={(open) => {
          if (open && caseIsDeleting) return;
          if (open && documentToDelete && isDeletingDocument(documentToDelete)) return;
          setDeleteDocOpen(open);
          if (!open) setDocumentToDelete(null);
        }}
        title="Delete document"
        description="This document will be permanently removed from this case."
        onConfirm={() => {
          if (!documentToDelete) return;
          const id = documentToDelete;
          setDeleteDocOpen(false);
          setDocumentToDelete(null);
          trackDelete(id, () => deleteDocumentMutation.mutateAsync({ path: { id } }));
        }}
      />
    </div>
  );
}
