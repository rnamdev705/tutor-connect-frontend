"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { FileText, Mail, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatCard } from "@/components/common/stat-card";
import { ErrorState } from "@/components/common/error-state";
import { DashboardContentSkeleton } from "@/components/common/content-skeletons";
import { useCurrentTutor } from "@/lib/hooks/use-current-tutor";
import { getTutorsByIdDocumentsOptions } from "@/api/@tanstack/react-query.gen";
import { invitationsCountQueryOptions } from "@/lib/queries/list-queries";
import { textOverflow } from "@/lib/text-overflow";

export function TutorDashboard() {
  const { tutor, isLoading: tutorLoading, isError: tutorError } = useCurrentTutor();

  const { data: totalInvites, isLoading: totalLoading } = useQuery({
    ...invitationsCountQueryOptions(),
    enabled: !!tutor,
  });
  const { data: pendingInvites, isLoading: pendingLoading } = useQuery({
    ...invitationsCountQueryOptions("pending"),
    enabled: !!tutor,
  });
  const { data: acceptedInvites, isLoading: acceptedLoading } = useQuery({
    ...invitationsCountQueryOptions("accepted"),
    enabled: !!tutor,
  });
  const { data: documentsData, isLoading: documentsLoading } = useQuery({
    ...getTutorsByIdDocumentsOptions({ path: { id: tutor?.id ?? "" } }),
    enabled: !!tutor?.id,
  });

  if (tutorLoading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Review your invitations and manage your tutor profile.
          </p>
        </div>
        <DashboardContentSkeleton />
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

  const statsLoading = totalLoading || pendingLoading || acceptedLoading || documentsLoading;
  const stats = {
    invited: totalInvites?.meta.total ?? 0,
    pending: pendingInvites?.meta.total ?? 0,
    accepted: acceptedInvites?.meta.total ?? 0,
    documents: documentsData?.data.length ?? 0,
  };

  return (
    <div className="space-y-8">
      <div className="min-w-0">
        <h1 className={textOverflow.pageTitle}>
          Welcome back, {tutor.displayName.split(" ")[0]}
        </h1>
        <p className={textOverflow.pageSubtitle}>
          Review your invitations and manage your tutor profile.
        </p>
      </div>

      {statsLoading ? (
        <DashboardContentSkeleton />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard title="Invited Cases" value={stats.invited} icon={Mail} />
            <StatCard title="Pending Invitations" value={stats.pending} icon={Mail} />
            <StatCard title="Accepted Invitations" value={stats.accepted} icon={Mail} />
            <StatCard title="Uploaded Documents" value={stats.documents} icon={FileText} />
          </div>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Button variant="outline" asChild>
                <Link href="/invitations">
                  <Mail className="mr-2 h-4 w-4" />
                  View Invited Cases
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/profile/edit">
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit Profile
                </Link>
              </Button>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
