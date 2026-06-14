"use client";

import { useState } from "react";
import { If, Then, Else } from "react-if";
import { Loader2, Users } from "lucide-react";
import { getTutorsOptions } from "@/api/@tanstack/react-query.gen";
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
import { InvitingStatusCell } from "@/components/documents/pending-document-rows";
import {
  getExperienceSummary,
  getQualificationSummary,
} from "@/lib/format";
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

  const { data, isLoading } = useQuery({
    ...getTutorsOptions({ query: { search: search || undefined } }),
    enabled: open,
  });

  const tutors = data?.data ?? [];

  const invitedByTutorId = new Map(
    invitedTutors.map((entry) => [entry.tutorProfileId, entry.status]),
  );

  const handleConfirm = () => {
    if (!selected) return;
    if (invitedByTutorId.has(selected.id) || invitingTutorIds.includes(selected.id)) {
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
          ) : (
            <If condition={tutors.length === 0}>
              <Then>
                <EmptyState
                  icon={Users}
                  title="No tutors found"
                  description="No tutors match your search. Try a different name or subject."
                  variant="compact"
                />
              </Then>
              <Else>
                {tutors.map((tutor) => {
                  const invitationStatus = invitedByTutorId.get(tutor.id);
                  const isInviting = invitingTutorIds.includes(tutor.id);
                  const isDisabled = !!invitationStatus || isInviting;
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
                        <p className="text-sm font-medium">{tutor.displayName}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {getQualificationSummary(tutor)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {getExperienceSummary(tutor)}
                        </p>
                      </div>
                      {isInviting ? (
                        <InvitingStatusCell />
                      ) : invitationStatus ? (
                        <StatusBadge status={invitationStatus} />
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
              invitedByTutorId.has(selected.id) ||
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
