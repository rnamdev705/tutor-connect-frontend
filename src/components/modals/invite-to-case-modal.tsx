"use client";

import { useState } from "react";
import { If, Then, Else } from "react-if";
import { Briefcase, Loader2 } from "lucide-react";
import { getCasesOptions } from "@/api/@tanstack/react-query.gen";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/common/search-input";
import { EmptyState } from "@/components/common/empty-state";
import { StatusBadge } from "@/components/common/status-badge";
import { formatCurrency } from "@/lib/format";
import type { Case } from "@/api/types.gen";

interface InviteToCaseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tutorProfileId: string;
  tutorName: string;
  excludeCaseIds?: string[];
  onInvite?: (caseItem: Case) => void;
}

export function InviteToCaseModal({
  open,
  onOpenChange,
  tutorProfileId,
  tutorName,
  excludeCaseIds = [],
  onInvite,
}: InviteToCaseModalProps) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Case | null>(null);

  const { data, isLoading } = useQuery({
    ...getCasesOptions({
      query: {
        status: "open",
        search: search || undefined,
        limit: 100,
      },
    }),
    enabled: open,
  });

  const available = (data?.data ?? []).filter(
    (c) =>
      !c.invitedTutorIds.includes(tutorProfileId) &&
      !excludeCaseIds.includes(c.id),
  );

  const handleConfirm = () => {
    if (selected) {
      onInvite?.(selected);
      setSelected(null);
      setSearch("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) {
          setSelected(null);
          setSearch("");
        }
        onOpenChange(value);
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Invite to Case</DialogTitle>
          <DialogDescription>
            Select an open case to invite {tutorName} to.
          </DialogDescription>
        </DialogHeader>

        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search cases by title, subject, or location..."
        />

        <div className="max-h-64 space-y-2 overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <If condition={available.length === 0}>
              <Then>
                <EmptyState
                  icon={Briefcase}
                  title="No cases available"
                  description={
                    (data?.data ?? []).length === 0
                      ? "Create an open case first, then invite this tutor."
                      : "This tutor is already invited to all of your open cases."
                  }
                  variant="compact"
                />
              </Then>
              <Else>
                {available.map((caseItem) => (
                  <button
                    key={caseItem.id}
                    type="button"
                    onClick={() => setSelected(caseItem)}
                    className={`flex w-full items-start gap-3 rounded-lg border p-3 text-left transition-colors ${
                      selected?.id === caseItem.id
                        ? "border-primary bg-primary/5"
                        : "hover:bg-muted/50"
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{caseItem.title}</p>
                        <StatusBadge status={caseItem.status} />
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {caseItem.subject} · {caseItem.level} · {caseItem.location}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {formatCurrency(caseItem.budgetPerHour)}/hour
                      </p>
                    </div>
                  </button>
                ))}
              </Else>
            </If>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!selected}>
            Send Invitation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
