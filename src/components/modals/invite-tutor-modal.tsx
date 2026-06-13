"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/common/user-avatar";
import {
  getExperienceSummary,
  getQualificationSummary,
  mockTutors,
} from "@/lib/mock-data";
import type { TutorProfile } from "@/lib/types";

interface InviteTutorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  excludeIds?: string[];
  onInvite?: (tutor: TutorProfile) => void;
}

export function InviteTutorModal({
  open,
  onOpenChange,
  excludeIds = [],
  onInvite,
}: InviteTutorModalProps) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<TutorProfile | null>(null);

  const available = mockTutors.filter((t) => !excludeIds.includes(t.id));
  const filtered = available.filter(
    (t) =>
      t.displayName.toLowerCase().includes(search.toLowerCase()) ||
      t.subjectsTaught.some((s) =>
        s.toLowerCase().includes(search.toLowerCase()),
      ),
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Invite Tutor</DialogTitle>
          <DialogDescription>
            Search and select a tutor to invite to this case.
          </DialogDescription>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search tutors by name or subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="max-h-64 space-y-2 overflow-y-auto">
          {filtered.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No tutors found matching your search.
            </p>
          ) : (
            filtered.map((tutor) => (
              <button
                key={tutor.id}
                type="button"
                onClick={() => setSelected(tutor)}
                className={`flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors ${
                  selected?.id === tutor.id
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
              </button>
            ))
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!selected}>
            Confirm Invitation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
