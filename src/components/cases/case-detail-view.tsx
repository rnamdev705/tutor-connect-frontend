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
import { SearchInput } from "@/components/common/search-input";
import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { UserAvatar } from "@/components/common/user-avatar";
import { InviteTutorModal } from "@/components/modals/invite-tutor-modal";
import { UploadDocumentModal } from "@/components/modals/upload-document-modal";
import { PendingCaseDocumentRow } from "@/components/documents/pending-document-rows";
import { useAuth } from "@/lib/auth-context";
import { getApiErrorMessage } from "@/lib/api-error";
import { formatCurrency, formatDate, formatFileSize } from "@/lib/format";
import { usePendingDocumentUploads } from "@/lib/hooks/use-pending-document-uploads";
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
  const [tutorSearch, setTutorSearch] = useState("");
  const { pendingUploads, trackUpload } = usePendingDocumentUploads(caseId);

  const { data: caseData, isLoading, isError } = useQuery(
    getCasesByIdOptions({ path: { id: caseId } }),
  );

  const { data: documentsData } = useQuery({
    ...getCasesByCaseIdDocumentsOptions({ path: { caseId } }),
    enabled: !!caseData,
  });

  const inviteMutation = useMutation({
    ...postCasesByIdInvitationsMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getCasesByIdQueryKey({ path: { id: caseId } }) });
      queryClient.invalidateQueries({ queryKey: getCasesQueryKey() });
      toast.success("Tutor invited successfully");
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  const revokeMutation = useMutation({
    ...deleteCasesByIdInvitationsByTutorIdMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getCasesByIdQueryKey({ path: { id: caseId } }) });
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

  const invitations = caseData.invitations.filter((inv) => {
    if (!tutorSearch) return true;
    return inv.tutor?.displayName
      ?.toLowerCase()
      .includes(tutorSearch.toLowerCase());
  });

  const documents = documentsData?.data ?? [];
  const documentCount = documents.length + pendingUploads.length;
  const showDocumentsTable = documentCount > 0;

  return (
    <div className="space-y-6">
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
        <When condition={canManage}>
          <Button variant="outline" asChild>
            <Link href={`/cases/${caseData.id}/edit`}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
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
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">Invited Tutors</CardTitle>
                <CardDescription>
                  {invitations.length} tutor(s) invited
                </CardDescription>
              </div>
              <Button size="sm" onClick={() => setInviteOpen(true)}>
                <UserPlus className="mr-2 h-4 w-4" />
                Invite Tutor
              </Button>
            </CardHeader>
            <CardContent>
              <SearchInput
                value={tutorSearch}
                onChange={setTutorSearch}
                placeholder="Search tutors..."
                className="mb-4"
              />
              <If condition={invitations.length === 0}>
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
                    {invitations.map((inv) => (
                      <li
                        key={inv.id}
                        className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                      >
                        <UserAvatar
                          name={inv.tutor?.displayName ?? "Tutor"}
                          size="sm"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">
                            {inv.tutor?.displayName ?? "Unknown tutor"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Invited {formatDate(inv.invitedAt)}
                          </p>
                        </div>
                        <StatusBadge status={inv.status} />
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
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
                                  revokeMutation.mutate({
                                    path: {
                                      id: caseId,
                                      tutorId: inv.tutorUserId,
                                    },
                                  })
                                }
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Remove
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </li>
                    ))}
                  </ul>
                </Else>
              </If>
            </CardContent>
          </Card>
        </When>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">Documents</CardTitle>
            <CardDescription>{documentCount} file(s)</CardDescription>
          </div>
          <Button size="sm" onClick={() => setUploadOpen(true)}>
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
                onAction={() => setUploadOpen(true)}
                variant="compact"
              />
            </Then>
            <Else>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>File Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Uploaded By</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="w-12" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingUploads.map((upload) => (
                    <PendingCaseDocumentRow key={upload.id} upload={upload} />
                  ))}
                  {documents.map((d) => (
                    <TableRow key={d.id}>
                      <TableCell className="font-medium">{d.originalName}</TableCell>
                      <TableCell className="text-muted-foreground text-xs">
                        {d.mimeType.split("/").pop()?.toUpperCase()}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatFileSize(d.sizeBytes)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {d.uploadedByName}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(d.createdAt)}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Download className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Else>
          </If>
        </CardContent>
      </Card>

      <When condition={canManage}>
        <InviteTutorModal
          open={inviteOpen}
          onOpenChange={setInviteOpen}
          excludeIds={caseData.invitedTutorIds}
          onInvite={(tutorProfileId) =>
            inviteMutation.mutate({
              path: { id: caseId },
              body: { tutorProfileId },
            })
          }
        />
      </When>
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
    </div>
  );
}
