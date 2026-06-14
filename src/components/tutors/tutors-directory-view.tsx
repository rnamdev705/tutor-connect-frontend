"use client";

import { useMemo, useState } from "react";
import { If, Then, Else } from "react-if";
import { Users } from "lucide-react";
import { getTutorsOptions } from "@/api/@tanstack/react-query.gen";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/common/page-header";
import { SearchInput } from "@/components/common/search-input";
import { EmptyState } from "@/components/common/empty-state";
import { TutorCard } from "@/components/tutors/tutor-card";
import { PaginationControls } from "@/components/common/pagination-controls";
import { TutorGridSkeleton } from "@/components/common/content-skeletons";
import {
  DEFAULT_PAGE_SIZE,
  MAX_FETCH_LIMIT,
  matchesText,
  matchesTextInList,
  paginateItems,
} from "@/lib/pagination";

export function TutorsDirectoryView() {
  const [nameSearch, setNameSearch] = useState("");
  const [qualSearch, setQualSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery(
    getTutorsOptions({
      query: {
        page: 1,
        limit: MAX_FETCH_LIMIT,
      },
    }),
  );

  const tutors = data?.data ?? [];

  const filtered = useMemo(
    () =>
      tutors.filter(
        (tutor) =>
          matchesText(tutor.displayName, nameSearch) &&
          matchesTextInList(tutor.qualifications, qualSearch),
      ),
    [tutors, nameSearch, qualSearch],
  );

  const pagination = useMemo(
    () => paginateItems(filtered, page, DEFAULT_PAGE_SIZE),
    [filtered, page],
  );

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
              onChange={(value) => {
                setNameSearch(value);
                setPage(1);
              }}
              placeholder="Search by name..."
            />
            <SearchInput
              value={qualSearch}
              onChange={(value) => {
                setQualSearch(value);
                setPage(1);
              }}
              placeholder="Search by qualification..."
            />
          </div>

          {isLoading ? (
            <TutorGridSkeleton />
          ) : (
            <>
              <If condition={pagination.items.length === 0}>
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
                    {pagination.items.map((tutor) => (
                      <TutorCard key={tutor.id} tutor={tutor} />
                    ))}
                  </div>
                </Else>
              </If>
              <PaginationControls
                page={pagination.page}
                totalPages={pagination.totalPages}
                total={pagination.total}
                pageSize={DEFAULT_PAGE_SIZE}
                onPageChange={setPage}
              />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
