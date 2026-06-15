"use client";

import { useMemo, useState } from "react";
import { Loader2, Users } from "lucide-react";
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
import { UserAvatar } from "@/components/common/user-avatar";
import { StatusBadge } from "@/components/common/status-badge";
import { LoadingStatusCell } from "@/components/common/loading-status-cell";
import { useDebouncedValue } from "@/components/common/list-filter-toolbar";
import {
  getExperienceSummary,
  getQualificationSummary,
} from "@/lib/format";
import { tutorsSearchQueryOptions } from "@/lib/queries/list-queries";
import { blocksNewInviteForInvitationStatus } from "@/lib/case-invites";
import { textOverflow } from "@/lib/text-overflow";
import { cn } from "@/lib/utils";
import type { TutorProfileSummary } from "@/api/types.gen";
import type { AppStatus } from "@/components/common/status-badge";

export interface InvitedTutorInfo {
  tutorProfileId: string;
  status: AppStatus;
}

interface InviteTutorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invitedTutors?: InvitedTutorInfo[];
  invitingTutorIds?: string[];
  onInvite?: (tutor: TutorProfileSummary) => void;
}

export function InviteTutorModal({
  open,
  onOpenChange,
  invitedTutors = [],
  invitingTutorIds = [],
  onInvite,
}: InviteTutorModalProps) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<TutorProfileSummary | null>(null);
  const debouncedSearch = useDebouncedValue(search);

  const queryOptions = useMemo(
    () => ({
      ...tutorsSearchQueryOptions(debouncedSearch, open),
    }),
    [debouncedSearch, open],
  );

  const { data, isLoading } = useQuery(queryOptions);
  const tutors = data?.data ?? [];

  const invitedByTutorId = new Map(
    invitedTutors.map((entry) => [entry.tutorProfileId, entry.status]),
  );

  const handleConfirm = () => {
    if (!selected) return;

    const invitationStatus = invitedByTutorId.get(selected.id);
    if (
      blocksNewInviteForInvitationStatus(invitationStatus) ||
      invitingTutorIds.includes(selected.id)
    ) {
      return;
    }

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
          <DialogTitle>Invite Tutor</DialogTitle>
          <DialogDescription>
            Search and select a tutor to invite to this case.
          </DialogDescription>
        </DialogHeader>

        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search tutors by name or subject..."
        />

        <div className="max-h-64 space-y-2 overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : tutors.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No tutors found"
              description="No tutors match your search. Try a different name or subject."
              variant="compact"
            />
          ) : (
            tutors.map((tutor) => {
              const invitationStatus = invitedByTutorId.get(tutor.id);
              const isInviting = invitingTutorIds.includes(tutor.id);
              const isDisabled =
                blocksNewInviteForInvitationStatus(invitationStatus) || isInviting;
              const isSelected = selected?.id === tutor.id && !isDisabled;

              return (
                <button
                  key={tutor.id}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => {
                    if (!isDisabled) setSelected(tutor);
                  }}
                  className={`flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors ${
                    isDisabled
                      ? "cursor-not-allowed border-muted bg-muted/30 opacity-70"
                      : isSelected
                        ? "border-primary bg-primary/5"
                        : "hover:bg-muted/50"
                  }`}
                >
                  <UserAvatar name={tutor.displayName} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className={cn(textOverflow.cardName, "text-sm")}>{tutor.displayName}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {getQualificationSummary(tutor)}
                    </p>
                    <p className="line-clamp-1 break-words text-xs text-muted-foreground">
                      {getExperienceSummary(tutor)}
                    </p>
                  </div>
                  {isInviting ? (
                    <LoadingStatusCell label="Inviting..." />
                  ) : invitationStatus ? (
                    <StatusBadge status={invitationStatus} />
                  ) : null}
                </button>
              );
            })
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
              blocksNewInviteForInvitationStatus(invitedByTutorId.get(selected.id)) ||
              invitingTutorIds.includes(selected.id)
            }
          >
            Confirm Invitation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
