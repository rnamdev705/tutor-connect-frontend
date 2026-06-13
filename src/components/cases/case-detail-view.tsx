"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { If, Then, Else, When } from "react-if";
import {
  Download,
  FileText,
  MoreHorizontal,
  Pencil,
  Trash2,
  Upload,
  UserPlus,
  Users,
} from "lucide-react";
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
import { useAuth } from "@/lib/auth-context";
import { useCurrentTutor } from "@/lib/hooks/use-current-tutor";
import { isTutorInvitedToCase } from "@/lib/data";
import {
  formatCurrency,
  formatDate,
  formatFileSize,
  mockCaseDocuments,
  mockInvitations,
  mockTutors,
} from "@/lib/mock-data";
import type { Case } from "@/lib/types";
import { toast } from "sonner";

interface CaseDetailViewProps {
  caseData: Case;
}

export function CaseDetailView({ caseData }: CaseDetailViewProps) {
  const { user } = useAuth();
  const tutor = useCurrentTutor();
  const router = useRouter();
  const isParent = user?.role === "parent";
  const isOwner = user?.id === caseData.ownerId;
  const canManage = isParent && isOwner;
  const isInvitedTutor =
    user?.role === "tutor" &&
    tutor != null &&
    isTutorInvitedToCase(tutor.id, caseData.id);

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

  const [inviteOpen, setInviteOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [tutorSearch, setTutorSearch] = useState("");

  const invitedTutors = mockTutors.filter((t) =>
    caseData.invitedTutorIds.includes(t.id),
  );
  const documents = mockCaseDocuments.filter((d) => d.caseId === caseData.id);
  const filteredTutors = invitedTutors.filter((t) =>
    t.displayName.toLowerCase().includes(tutorSearch.toLowerCase()),
  );

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
                  {invitedTutors.length} tutor(s) invited
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
              <If condition={filteredTutors.length === 0}>
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
                    {filteredTutors.map((t) => {
                      const inv = mockInvitations.find(
                        (i) => i.caseId === caseData.id && i.tutorId === t.id,
                      );
                      const invitedDate = inv ? formatDate(inv.invitedAt) : "—";

                      return (
                        <li
                          key={t.id}
                          className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                        >
                          <UserAvatar name={t.displayName} size="sm" />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium">{t.displayName}</p>
                            <p className="text-xs text-muted-foreground">
                              Invited {invitedDate}
                            </p>
                          </div>
                          <StatusBadge status={inv?.status ?? "pending"} />
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => router.push(`/tutors/${t.id}`)}>
                                View Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Remove
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </li>
                      );
                    })}
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
            <CardDescription>{documents.length} file(s)</CardDescription>
          </div>
          <Button size="sm" onClick={() => setUploadOpen(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Upload
          </Button>
        </CardHeader>
        <CardContent>
          <If condition={documents.length === 0}>
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
                  {documents.map((d) => (
                    <TableRow key={d.id}>
                      <TableCell className="font-medium">{d.fileName}</TableCell>
                      <TableCell className="text-muted-foreground text-xs">
                        {d.fileType.split("/").pop()?.toUpperCase()}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatFileSize(d.size)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{d.uploadedBy}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(d.uploadedAt)}
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
          onInvite={() => toast.success("Tutor invited successfully")}
        />
      </When>
      <UploadDocumentModal
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        onUpload={() => toast.success("Document uploaded successfully")}
      />
    </div>
  );
}
