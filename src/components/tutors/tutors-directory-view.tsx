"use client";

import { useMemo, useState } from "react";
import { If, Then, Else } from "react-if";
import { Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/common/page-header";
import { SearchInput } from "@/components/common/search-input";
import { EmptyState } from "@/components/common/empty-state";
import { TutorCard } from "@/components/tutors/tutor-card";
import {
  getQualificationSummary,
  mockTutors,
} from "@/lib/mock-data";

export function TutorsDirectoryView() {
  const [nameSearch, setNameSearch] = useState("");
  const [qualSearch, setQualSearch] = useState("");

  const filtered = useMemo(() => {
    return mockTutors.filter((t) => {
      if (
        nameSearch &&
        !t.displayName.toLowerCase().includes(nameSearch.toLowerCase())
      )
        return false;
      if (
        qualSearch &&
        !getQualificationSummary(t)
          .toLowerCase()
          .includes(qualSearch.toLowerCase()) &&
        !t.qualifications.some((q) =>
          q.toLowerCase().includes(qualSearch.toLowerCase()),
        )
      )
        return false;
      return true;
    });
  }, [nameSearch, qualSearch]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tutor Directory"
        description="Browse qualified tutors for your cases"
        count={filtered.length}
      />

      <Card className="shadow-sm">
        <CardContent className="pt-6">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row">
            <SearchInput
              value={nameSearch}
              onChange={setNameSearch}
              placeholder="Search by name..."
            />
            <SearchInput
              value={qualSearch}
              onChange={setQualSearch}
              placeholder="Search by qualification..."
            />
          </div>

          <If condition={filtered.length === 0}>
            <Then>
              <EmptyState
                icon={Users}
                title="No tutors found"
                description="No tutors match your search criteria. Try a different name or qualification."
                variant="compact"
              />
            </Then>
            <Else>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((tutor) => (
                  <TutorCard key={tutor.id} tutor={tutor} />
                ))}
              </div>
            </Else>
          </If>
        </CardContent>
      </Card>
    </div>
  );
}
