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
import { useDebouncedValue } from "@/components/common/list-filter-toolbar";
import { formatCurrency } from "@/lib/format";
import { openCasesForInviteQueryOptions } from "@/lib/queries/list-queries";
import { blocksNewInviteForInvitationStatus, canReinviteTutor } from "@/lib/case-invites";
import { InvitePickerStatus } from "@/components/cases/invite-picker-status";
import { cn } from "@/lib/utils";
import type { Case } from "@/api/types.gen";

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
  const debouncedSearch = useDebouncedValue(search);

  const queryOptions = useMemo(
    () => ({
      ...openCasesForInviteQueryOptions(tutorProfileId, debouncedSearch),
      enabled: open,
    }),
    [tutorProfileId, debouncedSearch, open],
  );

  const { data, isLoading } = useQuery(queryOptions);
  const cases = data?.data ?? [];

  const handleConfirm = () => {
    if (!selected) return;

    const invitationStatus = selected.tutorInvitation?.status;
    const isInviting = invitingCaseIds.includes(selected.id);
    if (blocksNewInviteForInvitationStatus(invitationStatus) || isInviting) return;

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
          <DialogDescription className="break-words">
            Select an open case to invite{" "}
            <span className="font-medium text-foreground">{tutorName}</span> to.
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
                  const invitationStatus = caseItem.tutorInvitation?.status;
                  const isInviting = invitingCaseIds.includes(caseItem.id);
                  const isDisabled =
                    blocksNewInviteForInvitationStatus(invitationStatus) || isInviting;
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
                        <div className="flex min-w-0 items-center gap-2">
                          <p className={cn("min-w-0 flex-1 truncate text-sm font-medium")}>
                            {caseItem.title}
                          </p>
                          <StatusBadge status={caseItem.status} className="shrink-0" />
                        </div>
                        <p className="mt-1 line-clamp-2 break-words text-xs text-muted-foreground">
                          {caseItem.subject} · {caseItem.level} · {caseItem.location}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {formatCurrency(caseItem.budgetPerHour)}/hour
                        </p>
                      </div>
                      {isInviting ? (
                        <InvitePickerStatus isInviting />
                      ) : invitationStatus ? (
                        <InvitePickerStatus status={invitationStatus} />
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
              blocksNewInviteForInvitationStatus(selected.tutorInvitation?.status) ||
              invitingCaseIds.includes(selected.id)
            }
          >
            {selected &&
            canReinviteTutor(selected.tutorInvitation?.status ?? "")
              ? "Re-send Invitation"
              : "Send Invitation"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
