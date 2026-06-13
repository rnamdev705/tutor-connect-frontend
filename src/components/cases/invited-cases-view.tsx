"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { If, Then, Else, When } from "react-if";
import { Check, Mail, MoreHorizontal } from "lucide-react";
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
import { ErrorState } from "@/components/common/error-state";
import { useCurrentTutor } from "@/lib/hooks/use-current-tutor";
import { getInvitationsForTutor } from "@/lib/data";
import {
  formatCurrency,
  formatDate,
  mockCases,
} from "@/lib/mock-data";
import type { CaseInvitation } from "@/lib/types";
import { toast } from "sonner";

export function InvitedCasesView() {
  const tutor = useCurrentTutor();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [invitationFilter, setInvitationFilter] = useState("all");
  const [invitations, setInvitations] = useState<CaseInvitation[]>(() =>
    tutor ? getInvitationsForTutor(tutor.id) : [],
  );

  const handleAccept = (invitationId: string) => {
    setInvitations((prev) =>
      prev.map((inv) =>
        inv.id === invitationId ? { ...inv, status: "accepted" as const } : inv,
      ),
    );
    toast.success("Case invitation accepted");
  };

  const rows = useMemo(() => {
    return invitations
      .map((inv) => {
        const caseData = mockCases.find((c) => c.id === inv.caseId);
        if (!caseData) return null;
        return { invitation: inv, case: caseData };
      })
      .filter((row): row is NonNullable<typeof row> => row !== null)
      .filter(({ case: c, invitation }) => {
        if (search && !c.title.toLowerCase().includes(search.toLowerCase()))
          return false;
        if (status !== "all" && c.status !== status) return false;
        if (invitationFilter !== "all" && invitation.status !== invitationFilter)
          return false;
        return true;
      });
  }, [invitations, search, status, invitationFilter]);

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

  let tableContent;
  if (rows.length === 0) {
    tableContent = (
      <EmptyState
        icon={Mail}
        title="No invited cases"
        description="No invited cases match your current filters."
        variant="compact"
      />
    );
  } else {
    tableContent = (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Case Title</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Level</TableHead>
            <TableHead>Budget</TableHead>
            <TableHead>Case Status</TableHead>
            <TableHead>Invitation</TableHead>
            <TableHead>Invitation Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map(({ case: c, invitation }) => {
            let acceptButton = null;
            if (invitation.status === "pending") {
              acceptButton = (
                <Button
                  size="sm"
                  onClick={() => handleAccept(invitation.id)}
                >
                  <Check className="mr-1.5 h-3.5 w-3.5" />
                  Accept
                </Button>
              );
            }

            return (
              <TableRow key={invitation.id}>
                <TableCell className="font-medium">{c.title}</TableCell>
                <TableCell className="text-muted-foreground">{c.subject}</TableCell>
                <TableCell className="text-muted-foreground">{c.level}</TableCell>
                <TableCell>{formatCurrency(c.budgetPerHour)}/hr</TableCell>
                <TableCell><StatusBadge status={c.status} /></TableCell>
                <TableCell>
                  <StatusBadge status={invitation.status} />
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDate(invitation.invitedAt)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    {acceptButton}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => router.push(`/cases/${c.id}`)}
                        >
                          View Case
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Invited Cases"
        description="Cases you've been invited to tutor"
        count={rows.length}
      />

      <Card className="shadow-sm">
        <CardContent className="pt-6">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search cases..."
            />
            <Select value={status} onValueChange={(v) => v && setStatus(v)}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Case status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="matched">Matched</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={invitationFilter}
              onValueChange={(v) => v && setInvitationFilter(v)}
            >
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue placeholder="Invitation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Invitations</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="declined">Declined</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <If condition={rows.length === 0}>
            <Then>
              <EmptyState
                icon={Mail}
                title="No invited cases"
                description="No invited cases match your current filters."
                variant="compact"
              />
            </Then>
            <Else>
              <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Case Title</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead>Case Status</TableHead>
                  <TableHead>Invitation</TableHead>
                  <TableHead>Invitation Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map(({ case: c, invitation }) => (
                  <TableRow key={invitation.id}>
                    <TableCell className="font-medium">{c.title}</TableCell>
                    <TableCell className="text-muted-foreground">{c.subject}</TableCell>
                    <TableCell className="text-muted-foreground">{c.level}</TableCell>
                    <TableCell>{formatCurrency(c.budgetPerHour)}/hr</TableCell>
                    <TableCell><StatusBadge status={c.status} /></TableCell>
                    <TableCell>
                      <StatusBadge status={invitation.status} />
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(invitation.invitedAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <When condition={invitation.status === "pending"}>
                          <Button
                            size="sm"
                            onClick={() => handleAccept(invitation.id)}
                          >
                            <Check className="mr-1.5 h-3.5 w-3.5" />
                            Accept
                          </Button>
                        </When>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => router.push(`/cases/${c.id}`)}
                            >
                              View Case
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </Else>
          </If>
        </CardContent>
      </Card>
    </div>
  );
}
