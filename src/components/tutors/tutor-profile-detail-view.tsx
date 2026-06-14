"use client";

import { useState } from "react";
import { If, Then, Else, When } from "react-if";
import { useQuery } from "@tanstack/react-query";
import { Download, FileText, Loader2, Mail } from "lucide-react";
import {
  getTutorsByIdDocumentsOptions,
  getTutorsByIdOptions,
} from "@/api/@tanstack/react-query.gen";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { ErrorState } from "@/components/common/error-state";
import { InviteTutorModal } from "@/components/modals/invite-tutor-modal";
import { useAuth } from "@/lib/auth-context";
import { formatDate, formatFileSize } from "@/lib/format";
import { toast } from "sonner";

interface TutorProfileDetailViewProps {
  tutorId: string;
}

export function TutorProfileDetailView({ tutorId }: TutorProfileDetailViewProps) {
  const { user } = useAuth();
  const showInvite = user?.role === "parent";
  const [inviteOpen, setInviteOpen] = useState(false);

  const { data: tutor, isLoading, isError } = useQuery(
    getTutorsByIdOptions({ path: { id: tutorId } }),
  );

  const { data: documentsData } = useQuery({
    ...getTutorsByIdDocumentsOptions({ path: { id: tutorId } }),
    enabled: !!tutor,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !tutor) {
    return (
      <ErrorState
        title="Tutor not found"
        message="This tutor profile does not exist."
        actionLabel="Back to directory"
        actionHref="/tutors"
      />
    );
  }

  const documents = documentsData?.data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-5">
        <UserAvatar name={tutor.displayName} size="xl" />
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {tutor.displayName}
          </h1>
          <Badge variant="secondary" className="mt-2">
            {tutor.yearsOfExperience} years experience
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">About</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Qualifications
                </h4>
                <ul className="mt-2 space-y-1">
                  {tutor.qualifications.map((q) => (
                    <li key={q} className="text-sm">{q}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Teaching Background
                </h4>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {tutor.teachingBackground}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Experience</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-xs font-medium text-muted-foreground">
                    Years of Experience
                  </dt>
                  <dd className="mt-1 text-sm font-medium">
                    {tutor.yearsOfExperience} years
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-muted-foreground">
                    Subjects Taught
                  </dt>
                  <dd className="mt-2 flex flex-wrap gap-1.5">
                    {tutor.subjectsTaught.map((s) => (
                      <Badge key={s} variant="outline" className="text-xs">
                        {s}
                      </Badge>
                    ))}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Supporting Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <If condition={documents.length === 0}>
                <Then>
                  <EmptyState
                    icon={FileText}
                    title="No documents"
                    description="This tutor hasn't uploaded any supporting documents yet."
                    variant="compact"
                  />
                </Then>
                <Else>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>File Name</TableHead>
                        <TableHead>Size</TableHead>
                        <TableHead>Uploaded</TableHead>
                        <TableHead className="w-12" />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {documents.map((d) => (
                        <TableRow key={d.id}>
                          <TableCell className="font-medium">{d.originalName}</TableCell>
                          <TableCell className="text-muted-foreground">
                            {formatFileSize(d.sizeBytes)}
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
        </div>

        <When condition={showInvite}>
          <Card className="shadow-sm h-fit">
            <CardHeader>
              <CardTitle className="text-base">Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <Button className="w-full" onClick={() => setInviteOpen(true)}>
                <Mail className="mr-2 h-4 w-4" />
                Invite To Case
              </Button>
              <p className="mt-3 text-xs text-muted-foreground">
                Invite this tutor from an open case detail page.
              </p>
            </CardContent>
          </Card>
        </When>
      </div>

      <When condition={showInvite}>
        <InviteTutorModal
          open={inviteOpen}
          onOpenChange={setInviteOpen}
          onInvite={() => toast.info("Open a case and use Invite Tutor there.")}
        />
      </When>
    </div>
  );
}
