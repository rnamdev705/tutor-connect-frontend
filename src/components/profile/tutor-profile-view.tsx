"use client";

import { useState } from "react";
import Link from "next/link";
import { Download, FileText, Pencil, Trash2, Upload } from "lucide-react";
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
import { ErrorState } from "@/components/common/error-state";
import { UploadDocumentModal } from "@/components/modals/upload-document-modal";
import { DeleteConfirmationModal } from "@/components/modals/delete-confirmation-modal";
import { useCurrentTutor } from "@/lib/hooks/use-current-tutor";
import { formatDate } from "@/lib/mock-data";
import { toast } from "sonner";

export function TutorProfileView() {
  const tutor = useCurrentTutor();
  const [uploadOpen, setUploadOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  if (!tutor) {
    return (
      <ErrorState
        title="Profile not found"
        message="We couldn't find a tutor profile linked to your account."
        actionLabel="Go to dashboard"
        actionHref="/dashboard"
      />
    );
  }

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
          <div>
            <h2 className="text-lg font-semibold">{tutor.displayName}</h2>
            <p className="text-sm text-muted-foreground">
              {tutor.yearsOfExperience} years experience · Tutor
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Qualifications</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {tutor.qualifications.map((q) => (
                <li key={q} className="text-sm">{q}</li>
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
              <p className="text-sm">{tutor.subjectsTaught.join(", ")}</p>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {tutor.teachingBackground}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Documents</CardTitle>
          <Button size="sm" onClick={() => setUploadOpen(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Upload Document
          </Button>
        </CardHeader>
        <CardContent>
          {tutor.documents.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No documents yet"
              description="Upload qualifications or supporting files to your profile."
              actionLabel="Upload Document"
              onAction={() => setUploadOpen(true)}
              variant="compact"
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>File Name</TableHead>
                  <TableHead>Upload Date</TableHead>
                  <TableHead className="w-24" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {tutor.documents.map((d) => (
                  <TableRow key={d.id}>
                    <TableCell className="font-medium">{d.fileName}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(d.uploadedAt)}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => setDeleteOpen(true)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <UploadDocumentModal
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        onUpload={() => toast.success("Document uploaded")}
      />
      <DeleteConfirmationModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete document"
        description="This document will be permanently removed from your profile."
        onConfirm={() => toast.success("Document deleted")}
      />
    </div>
  );
}
