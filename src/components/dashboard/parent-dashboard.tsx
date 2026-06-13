"use client";

import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  FileText,
  FolderOpen,
  Plus,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import { StatCard } from "@/components/common/stat-card";
import { StatusBadge } from "@/components/common/status-badge";
import { useAuth } from "@/lib/auth-context";
import {
  mockCaseDocuments,
  mockCases,
} from "@/lib/mock-data";

export function ParentDashboard() {
  const { user } = useAuth();
  const cases = mockCases.filter((c) => c.ownerId === user?.id);
  const recentCases = cases.slice(0, 5);

  const stats = {
    total: cases.length,
    open: cases.filter((c) => c.status === "open").length,
    matched: cases.filter((c) => c.status === "matched").length,
    documents: mockCaseDocuments.filter((d) =>
      cases.some((c) => c.id === d.caseId),
    ).length,
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back, {user?.name.split(" ")[0]}
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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Cases" value={stats.total} icon={Briefcase} />
        <StatCard title="Open Cases" value={stats.open} icon={FolderOpen} />
        <StatCard title="Matched Cases" value={stats.matched} icon={Users} />
        <StatCard title="Documents Uploaded" value={stats.documents} icon={FileText} />
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
              <p className="py-8 text-center text-sm text-muted-foreground">
                No cases yet. Create your first case to get started.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentCases.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium">{c.title}</TableCell>
                      <TableCell className="text-muted-foreground">{c.subject}</TableCell>
                      <TableCell>
                        <StatusBadge status={c.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/cases/${c.id}`}>View</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
    </div>
  );
}
