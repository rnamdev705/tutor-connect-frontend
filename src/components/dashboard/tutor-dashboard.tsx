"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { FileText, Mail, Pencil } from "lucide-react";
import { getInvitationsOptions } from "@/api/@tanstack/react-query.gen";
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

export function TutorDashboard() {
  const tutor = useCurrentTutor();

  const { data, isLoading } = useQuery({
    ...getInvitationsOptions(),
    enabled: !!tutor,
  });

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

  const invitations = data?.data ?? [];
  const stats = {
    invited: invitations.length,
    pending: invitations.filter((i) => i.status === "pending").length,
    accepted: invitations.filter((i) => i.status === "accepted").length,
    documents: 0,
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Welcome back, {tutor.displayName.split(" ")[0]}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Review your invitations and manage your tutor profile.
        </p>
      </div>

      {isLoading ? (
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
