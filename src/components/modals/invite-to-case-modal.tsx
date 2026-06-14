"use client";

import { useMemo, useState } from "react";
import { If, Then, Else } from "react-if";
import { Briefcase, Loader2 } from "lucide-react";
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
import { InvitingStatusCell } from "@/components/documents/pending-document-rows";
import { formatCurrency } from "@/lib/format";
import { matchesCaseSearch } from "@/lib/pagination";
import { openCasesListQueryOptions } from "@/lib/queries/list-queries";
import type { Case } from "@/api/types.gen";
import type { AppStatus } from "@/components/common/status-badge";

interface InviteToCaseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tutorProfileId: string;
  tutorName: string;
  invitingCaseIds?: string[];
  onInvite?: (caseItem: Case) => void;
}

export function InviteToCaseModal({
  open,
  onOpenChange,
  tutorProfileId,
  tutorName,
  invitingCaseIds = [],
  onInvite,
}: InviteToCaseModalProps) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Case | null>(null);

  const { data, isLoading } = useQuery({
    ...openCasesListQueryOptions,
    enabled: open,
  });

  const cases = useMemo(
    () => (data?.data ?? []).filter((caseItem) => matchesCaseSearch(caseItem, search)),
    [data?.data, search],
  );

  const invitationStatusByCaseId = useMemo(() => {
    const map = new Map<string, AppStatus>();
    for (const caseItem of data?.data ?? []) {
      const summary = caseItem.invitationSummaries?.find(
        (entry) => entry.tutorProfileId === tutorProfileId,
      );
      if (summary) {
        map.set(caseItem.id, summary.status);
      }
    }
    return map;
  }, [data?.data, tutorProfileId]);

  const handleConfirm = () => {
    if (!selected) return;

    const isInvited = selected.invitedTutorIds.includes(tutorProfileId);
    const isInviting = invitingCaseIds.includes(selected.id);
    if (isInvited || isInviting) return;

    onInvite?.(selected);
    setSelected(null);
    setSearch("");
    onOpenChange(false);
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
            <If condition={cases.length === 0}>
              <Then>
                <EmptyState
                  icon={Briefcase}
                  title="No cases found"
                  description="Create an open case first, then invite this tutor."
                  variant="compact"
                />
              </Then>
              <Else>
                {cases.map((caseItem) => {
                  const invitationStatus = invitationStatusByCaseId.get(caseItem.id);
                  const isInvited =
                    caseItem.invitedTutorIds.includes(tutorProfileId) ||
                    !!invitationStatus;
                  const isInviting = invitingCaseIds.includes(caseItem.id);
                  const isDisabled = isInvited || isInviting;
                  const isSelected = selected?.id === caseItem.id && !isDisabled;

                  return (
                    <button
                      key={caseItem.id}
                      type="button"
                      disabled={isDisabled}
                      onClick={() => {
                        if (!isDisabled) setSelected(caseItem);
                      }}
                      className={`flex w-full items-start gap-3 rounded-lg border p-3 text-left transition-colors ${
                        isDisabled
                          ? "cursor-not-allowed border-muted bg-muted/30 opacity-70"
                          : isSelected
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
                      {isInviting ? (
                        <InvitingStatusCell />
                      ) : invitationStatus ? (
                        <StatusBadge status={invitationStatus} />
                      ) : isInvited ? (
                        <StatusBadge status="pending" />
                      ) : null}
                    </button>
                  );
                })}
              </Else>
            </If>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={
              !selected ||
              selected.invitedTutorIds.includes(tutorProfileId) ||
              invitingCaseIds.includes(selected.id)
            }
          >
            Send Invitation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
