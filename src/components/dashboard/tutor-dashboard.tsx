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
import {
  mockCases,
  mockInvitations,
  mockTutors,
} from "@/lib/mock-data";

export function TutorDashboard() {
  const tutor = mockTutors[0];
  const invitations = mockInvitations.filter((i) => i.tutorId === tutor.id);

  const stats = {
    invited: invitations.length,
    open: invitations.filter((i) => i.status === "pending").length,
    documents: tutor.documents.length,
    availableCases: mockCases.filter((c) => c.status === "open").length,
  };

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
