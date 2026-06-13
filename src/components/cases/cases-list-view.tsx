"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Briefcase, MoreHorizontal, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/common/page-header";
import { SearchInput } from "@/components/common/search-input";
import { StatusBadge } from "@/components/common/status-badge";
import { EmptyState } from "@/components/common/empty-state";
import { useAuth } from "@/lib/auth-context";
import { getCasesByOwnerId } from "@/lib/data";
import {
  formatCurrency,
  formatDate,
  mockCases,
} from "@/lib/mock-data";
import { LEVELS, SUBJECTS } from "@/lib/constants";

export function CasesListView() {
  const { user } = useAuth();
  const router = useRouter();
  const isTutor = user?.role === "tutor";
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("all");
  const [level, setLevel] = useState("all");
  const [status, setStatus] = useState("all");

  const cases = isTutor
    ? mockCases
    : getCasesByOwnerId(user?.id ?? "");

  const filtered = useMemo(() => {
    return cases.filter((c) => {
      if (search && !c.title.toLowerCase().includes(search.toLowerCase()))
        return false;
      if (subject !== "all" && c.subject !== subject) return false;
      if (level !== "all" && c.level !== level) return false;
      if (status !== "all" && c.status !== status) return false;
      return true;
    });
  }, [cases, search, subject, level, status]);

  if (!isTutor && cases.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader title="My Cases" description="Manage your tutoring cases" />
        <EmptyState
          icon={Briefcase}
          title="No cases yet"
          description="Create your first tutoring case to start finding qualified tutors for your child."
          actionLabel="Create first case"
          onAction={() => router.push("/cases/new")}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={isTutor ? "Browse Cases" : "My Cases"}
        description={
          isTutor
            ? "Explore all available tutoring cases on the platform"
            : undefined
        }
        count={filtered.length}
      >
        {!isTutor && (
          <Button asChild>
            <Link href="/cases/new">
              <Plus className="mr-2 h-4 w-4" />
              Create Case
            </Link>
          </Button>
        )}
      </PageHeader>

      <Card className="shadow-sm">
        <CardContent className="pt-6">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search cases..."
            />
            <Select value={subject} onValueChange={(v) => v && setSubject(v)}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {SUBJECTS.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={level} onValueChange={(v) => v && setLevel(v)}>
              <SelectTrigger className="w-full sm:w-36">
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                {LEVELS.map((l) => (
                  <SelectItem key={l} value={l}>{l}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={(v) => v && setStatus(v)}>
              <SelectTrigger className="w-full sm:w-36">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="matched">Matched</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filtered.length === 0 ? (
            <EmptyState
              icon={Briefcase}
              title="No matching cases"
              description="Try adjusting your search or filters to find cases."
              variant="compact"
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead>Status</TableHead>
                  {isTutor ? (
                    <TableHead>Owner</TableHead>
                  ) : (
                    <>
                      <TableHead>Invited</TableHead>
                      <TableHead>Last Updated</TableHead>
                    </>
                  )}
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.title}</TableCell>
                    <TableCell className="text-muted-foreground">{c.subject}</TableCell>
                    <TableCell className="text-muted-foreground">{c.level}</TableCell>
                    <TableCell>{formatCurrency(c.budgetPerHour)}/hr</TableCell>
                    <TableCell><StatusBadge status={c.status} /></TableCell>
                    {isTutor ? (
                      <TableCell className="text-muted-foreground">{c.ownerName}</TableCell>
                    ) : (
                      <>
                        <TableCell>{c.invitedTutorIds.length}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatDate(c.updatedAt)}
                        </TableCell>
                      </>
                    )}
                    <TableCell>
                      {isTutor ? (
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/cases/${c.id}`}>View</Link>
                        </Button>
                      ) : (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => router.push(`/cases/${c.id}`)}>
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/cases/${c.id}/edit`)}>
                              Edit
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
