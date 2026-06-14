"use client";

import { useMemo, useState } from "react";
import { If, Then, Else } from "react-if";
import { Loader2, Users } from "lucide-react";
import { getTutorsOptions } from "@/api/@tanstack/react-query.gen";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/common/page-header";
import { SearchInput } from "@/components/common/search-input";
import { EmptyState } from "@/components/common/empty-state";
import { TutorCard } from "@/components/tutors/tutor-card";

export function TutorsDirectoryView() {
  const [nameSearch, setNameSearch] = useState("");
  const [qualSearch, setQualSearch] = useState("");

  const { data, isLoading } = useQuery(
    getTutorsOptions({
      query: {
        name: nameSearch || undefined,
        qualification: qualSearch || undefined,
      },
    }),
  );

  const tutors = data?.data ?? [];

  const filtered = useMemo(() => tutors, [tutors]);

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

          {isLoading ? (
            <div className="flex min-h-[200px] items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}
