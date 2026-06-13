"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { UserAvatar } from "@/components/common/user-avatar";
import { InviteTutorModal } from "@/components/modals/invite-tutor-modal";
import { UploadDocumentModal } from "@/components/modals/upload-document-modal";
import { useAuth } from "@/lib/auth-context";
import {
  formatCurrency,
  formatDate,
  formatFileSize,
  getExperienceSummary,
  getQualificationSummary,
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
  const router = useRouter();
  const isParent = user?.role === "parent";
  const isOwner = user?.id === caseData.ownerId;
  const canManage = isParent && isOwner;

  const [inviteOpen, setInviteOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);

  const invitedTutors = mockTutors.filter((t) =>
    caseData.invitedTutorIds.includes(t.id),
  );
  const documents = mockCaseDocuments.filter((d) => d.caseId === caseData.id);
  const [tutorSearch, setTutorSearch] = useState("");

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
        {canManage && (
          <Button variant="outline" asChild>
            <Link href={`/cases/${caseData.id}/edit`}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
        )}
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

        {canManage && (
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
              {filteredTutors.length === 0 ? (
                <EmptyState
                  icon={Users}
                  title="No invited tutors"
                  description="No tutors have been invited to this case yet."
                  variant="compact"
                />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tutor</TableHead>
                      <TableHead>Qualification</TableHead>
                      <TableHead>Experience</TableHead>
                      <TableHead>Invited</TableHead>
                      <TableHead className="w-12" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTutors.map((t) => {
                      const inv = mockInvitations.find(
                        (i) => i.caseId === caseData.id && i.tutorId === t.id,
                      );
                      return (
                        <TableRow key={t.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <UserAvatar name={t.displayName} size="sm" />
                              <span className="font-medium">{t.displayName}</span>
                            </div>
                          </TableCell>
                          <TableCell className="max-w-[160px] truncate text-muted-foreground text-xs">
                            {getQualificationSummary(t)}
                          </TableCell>
                          <TableCell className="text-muted-foreground text-xs">
                            {getExperienceSummary(t)}
                          </TableCell>
                          <TableCell className="text-muted-foreground text-xs">
                            {inv ? formatDate(inv.invitedAt) : "—"}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
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
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        )}
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
          {documents.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No documents yet"
              description="Upload supporting files for this case."
              actionLabel="Upload Document"
              onAction={() => setUploadOpen(true)}
              variant="compact"
            />
          ) : (
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
          )}
        </CardContent>
      </Card>

      {canManage && (
        <InviteTutorModal
          open={inviteOpen}
          onOpenChange={setInviteOpen}
          excludeIds={caseData.invitedTutorIds}
          onInvite={() => toast.success("Tutor invited successfully")}
        />
      )}
      <UploadDocumentModal
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        onUpload={() => toast.success("Document uploaded successfully")}
      />
    </div>
  );
}
