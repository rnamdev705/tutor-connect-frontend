"use client";

import { useState } from "react";
import { Download, FileText, Mail } from "lucide-react";
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
import { InviteTutorModal } from "@/components/modals/invite-tutor-modal";
import { useAuth } from "@/lib/auth-context";
import {
  formatDate,
  formatFileSize,
} from "@/lib/mock-data";
import type { TutorProfile } from "@/lib/types";
import { toast } from "sonner";

interface TutorProfileDetailViewProps {
  tutor: TutorProfile;
}

export function TutorProfileDetailView({ tutor }: TutorProfileDetailViewProps) {
  const { user } = useAuth();
  const showInvite = user?.role === "parent";
  const [inviteOpen, setInviteOpen] = useState(false);

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
              {tutor.documents.length === 0 ? (
                <EmptyState
                  icon={FileText}
                  title="No documents"
                  description="This tutor hasn't uploaded any supporting documents yet."
                  variant="compact"
                />
              ) : (
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
                    {tutor.documents.map((d) => (
                      <TableRow key={d.id}>
                        <TableCell className="font-medium">{d.fileName}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatFileSize(d.size)}
                        </TableCell>
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
        </div>

        {showInvite && (
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
                Invite this tutor to one of your open cases.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {showInvite && (
        <InviteTutorModal
          open={inviteOpen}
          onOpenChange={setInviteOpen}
          onInvite={() => toast.success("Invitation sent")}
        />
      )}
    </div>
  );
}
