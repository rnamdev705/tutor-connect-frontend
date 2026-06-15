"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Briefcase, FolderOpen, Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatCard } from "@/components/common/stat-card";
import { CasesTable } from "@/components/cases/cases-table";
import { EmptyState } from "@/components/common/empty-state";
import { DashboardContentSkeleton } from "@/components/common/content-skeletons";
import { useAuth } from "@/lib/auth-context";
import {
  casesCountQueryOptions,
  casesListQueryOptions,
} from "@/lib/queries/list-queries";

export function ParentDashboard() {
  const { user } = useAuth();

  const { data: recentData, isLoading: recentLoading } = useQuery(
    casesListQueryOptions({ page: 1, limit: 5 }),
  );
  const { data: totalData, isLoading: totalLoading } = useQuery(casesCountQueryOptions());
  const { data: openData, isLoading: openLoading } = useQuery(
    casesCountQueryOptions("open"),
  );
  const { data: matchedData, isLoading: matchedLoading } = useQuery(
    casesCountQueryOptions("matched"),
  );

  if (!user) return null;

  const isLoading = recentLoading || totalLoading || openLoading || matchedLoading;
  const recentCases = recentData?.data ?? [];
  const stats = {
    total: totalData?.meta.total ?? 0,
    open: openData?.meta.total ?? 0,
    matched: matchedData?.meta.total ?? 0,
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back, {user.name.split(" ")[0]}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your tutoring cases and find the right tutors.
          </p>
        </div>
        <Button asChild>
          <Link href="/cases/new">
            <Plus className="mr-2 h-4 w-4" />
            Create New Case
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <DashboardContentSkeleton />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard title="Total Cases" value={stats.total} icon={Briefcase} />
            <StatCard title="Open Cases" value={stats.open} icon={FolderOpen} />
            <StatCard title="Matched Cases" value={stats.matched} icon={Users} />
          </div>

          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">Recent Cases</CardTitle>
                <CardDescription>Your latest tutoring cases</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/cases">
                  View all
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {recentCases.length === 0 ? (
                <EmptyState
                  icon={Briefcase}
                  title="No cases yet"
                  description="Create your first tutoring case to start finding qualified tutors."
                  actionLabel="Create Case"
                  actionHref="/cases/new"
                  variant="compact"
                />
              ) : (
                <CasesTable cases={recentCases} />
              )}
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/cases/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Case
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
