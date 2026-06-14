"use client";

import { If, Then, Else } from "react-if";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  Briefcase,
  FileText,
  FolderOpen,
  Mail,
  Pencil,
  Plus,
  Users,
} from "lucide-react";
import { allCasesListQueryOptions } from "@/lib/queries/list-queries";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserAvatar } from "@/components/common/user-avatar";
import { StatCard } from "@/components/common/stat-card";
import { CasesTable } from "@/components/cases/cases-table";
import { EmptyState } from "@/components/common/empty-state";
import { ProfileActivitySkeleton } from "@/components/common/content-skeletons";
import { useAuth } from "@/lib/auth-context";

export function ParentProfileView() {
  const { user } = useAuth();
  const { data, isLoading } = useQuery({
    ...allCasesListQueryOptions,
    enabled: !!user,
  });

  if (!user) return null;

  const parentCases = data?.data ?? [];
  const stats = {
    total: parentCases.length,
    open: parentCases.filter((c) => c.status === "open").length,
    matched: parentCases.filter((c) => c.status === "matched").length,
    documents: 0,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your account and tutoring activity
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/profile/edit">
            <Pencil className="mr-2 h-4 w-4" />
            Edit Profile
          </Link>
        </Button>
      </div>

      <Card className="shadow-sm" size="sm">
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <UserAvatar name={user.name} size="xl" />
            <div>
              <h2 className="text-lg font-semibold leading-tight">{user.name}</h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <Badge variant="secondary" className="mt-2 capitalize">
                {user.role}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <ProfileActivitySkeleton />
      ) : (
        <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Cases" value={stats.total} icon={Briefcase} />
        <StatCard title="Open Cases" value={stats.open} icon={FolderOpen} />
        <StatCard title="Matched Cases" value={stats.matched} icon={Users} />
        <StatCard title="Documents" value={stats.documents} icon={FileText} />
      </div>

      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">Your Cases</CardTitle>
            <CardDescription>Cases you have posted</CardDescription>
          </div>
          <Button size="sm" asChild>
            <Link href="/cases/new">
              <Plus className="mr-2 h-4 w-4" />
              New Case
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <If condition={parentCases.length === 0}>
            <Then>
              <EmptyState
                icon={Briefcase}
                title="No cases yet"
                description="Create your first case to start finding tutors."
                actionLabel="Create Case"
                actionHref="/cases/new"
                variant="compact"
              />
            </Then>
            <Else>
              <CasesTable cases={parentCases.slice(0, 5)} showUpdated />
            </Else>
          </If>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Account</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button variant="outline" asChild>
            <Link href="/cases">
              <Mail className="mr-2 h-4 w-4" />
              Manage Cases
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/tutors">
              <Users className="mr-2 h-4 w-4" />
              Browse Tutors
            </Link>
          </Button>
        </CardContent>
      </Card>
        </>
      )}
    </div>
  );
}
