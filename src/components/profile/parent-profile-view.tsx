"use client";

import { If, Then, Else } from "react-if";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Briefcase, FolderOpen, Mail, Pencil, Plus, Users } from "lucide-react";
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
import {
  casesCountQueryOptions,
  casesListQueryOptions,
} from "@/lib/queries/list-queries";
import { textOverflow } from "@/lib/text-overflow";
import { cn } from "@/lib/utils";

export function ParentProfileView() {
  const { user } = useAuth();

  const { data: recentData, isLoading: recentLoading } = useQuery({
    ...casesListQueryOptions({ page: 1, limit: 5 }),
    enabled: !!user,
  });
  const { data: totalData, isLoading: totalLoading } = useQuery({
    ...casesCountQueryOptions(),
    enabled: !!user,
  });
  const { data: openData, isLoading: openLoading } = useQuery({
    ...casesCountQueryOptions("open"),
    enabled: !!user,
  });
  const { data: matchedData, isLoading: matchedLoading } = useQuery({
    ...casesCountQueryOptions("matched"),
    enabled: !!user,
  });

  if (!user) return null;

  const isLoading = recentLoading || totalLoading || openLoading || matchedLoading;
  const parentCases = recentData?.data ?? [];
  const stats = {
    total: totalData?.meta.total ?? 0,
    open: openData?.meta.total ?? 0,
    matched: matchedData?.meta.total ?? 0,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <h1 className={textOverflow.pageTitle}>Profile</h1>
          <p className={textOverflow.pageSubtitle}>
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
            <UserAvatar name={user.name} size="lg" />
            <div className="min-w-0 flex-1">
              <h2 className={cn(textOverflow.cardName, "text-lg")}>{user.name}</h2>
              <p className={cn(textOverflow.pageSubtitle, "mt-0 truncate")}>{user.email}</p>
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
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard title="Total Cases" value={stats.total} icon={Briefcase} />
            <StatCard title="Open Cases" value={stats.open} icon={FolderOpen} />
            <StatCard title="Matched Cases" value={stats.matched} icon={Users} />
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
                  <CasesTable cases={parentCases} showUpdated />
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
