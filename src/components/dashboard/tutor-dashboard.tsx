"use client";

import Link from "next/link";
import { Briefcase, FileText, Mail, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatCard } from "@/components/common/stat-card";
import { ErrorState } from "@/components/common/error-state";
import { useCurrentTutor } from "@/lib/hooks/use-current-tutor";
import { getTutorDashboardStats } from "@/lib/data";

export function TutorDashboard() {
  const tutor = useCurrentTutor();

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

  const stats = getTutorDashboardStats(tutor);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Welcome back, {tutor.displayName.split(" ")[0]}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Browse open cases and manage your invitations.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Invited Cases" value={stats.invited} icon={Mail} />
        <StatCard title="Open Invitations" value={stats.open} icon={Briefcase} />
        <StatCard title="Open Cases" value={stats.availableCases} icon={Briefcase} />
        <StatCard title="Uploaded Documents" value={stats.documents} icon={FileText} />
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button variant="outline" asChild>
            <Link href="/cases">
              <Briefcase className="mr-2 h-4 w-4" />
              Browse Cases
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/invitations">
              <Mail className="mr-2 h-4 w-4" />
              View Invitations
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
    </div>
  );
}
