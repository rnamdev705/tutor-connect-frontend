"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Mail, MoreHorizontal, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { StatusBadge } from "@/components/common/status-badge";
import { invitationStatusStyles } from "@/components/cases/cases-list-view";
import {
  formatCurrency,
  formatDate,
  mockCases,
  mockInvitations,
  mockTutors,
} from "@/lib/mock-data";
import type { CaseInvitation } from "@/lib/types";
import { toast } from "sonner";

export function InvitedCasesView() {
  const tutor = mockTutors[0];
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [invitationFilter, setInvitationFilter] = useState("all");
  const [invitations, setInvitations] = useState<CaseInvitation[]>(
    mockInvitations.filter((i) => i.tutorId === tutor.id),
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
      .map((inv) => ({
        invitation: inv,
        case: mockCases.find((c) => c.id === inv.caseId)!,
      }))
      .filter(({ case: c, invitation }) => {
        if (!c) return false;
        if (search && !c.title.toLowerCase().includes(search.toLowerCase()))
          return false;
        if (status !== "all" && c.status !== status) return false;
        if (invitationFilter !== "all" && invitation.status !== invitationFilter)
          return false;
        return true;
      });
  }, [invitations, search, status, invitationFilter]);

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
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search cases..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
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

          {rows.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-center">
              <Mail className="mb-4 h-12 w-12 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">
                No invited cases match your filters.
              </p>
            </div>
          ) : (
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
                      <Badge
                        variant="outline"
                        className={invitationStatusStyles[invitation.status]}
                      >
                        {invitation.status.charAt(0).toUpperCase() +
                          invitation.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(invitation.invitedAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {invitation.status === "pending" && (
                          <Button
                            size="sm"
                            onClick={() => handleAccept(invitation.id)}
                          >
                            <Check className="mr-1.5 h-3.5 w-3.5" />
                            Accept
                          </Button>
                        )}
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}
