"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/common/page-header";
import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { TutorCard } from "@/components/tutors/tutor-card";
import { PaginationControls } from "@/components/common/pagination-controls";
import { TutorGridSkeleton } from "@/components/common/content-skeletons";
import { SearchInput } from "@/components/common/search-input";
import {
  useDebouncedValue,
  useUrlSyncedSearch,
} from "@/components/common/list-filter-toolbar";
import { DEFAULT_PAGE_SIZE, resolvePaginationMeta } from "@/lib/pagination";
import { tutorsListQueryOptions } from "@/lib/queries/list-queries";
import { isApiForbiddenError } from "@/lib/api-error";

export function TutorsDirectoryView() {
  const searchParams = useSearchParams();
  const urlSearch = searchParams.get("search") ?? "";
  const [qualSearch, setQualSearch] = useState("");
  const { search: nameSearch, setSearch: setNameSearch, debouncedSearch: debouncedName, page, setPage } =
    useUrlSyncedSearch(urlSearch);
  const debouncedQual = useDebouncedValue(qualSearch);

  const queryOptions = useMemo(
    () =>
      tutorsListQueryOptions({
        page,
        limit: DEFAULT_PAGE_SIZE,
        ...(debouncedName.trim() ? { name: debouncedName.trim() } : {}),
        ...(debouncedQual.trim() ? { qualification: debouncedQual.trim() } : {}),
      }),
    [page, debouncedName, debouncedQual],
  );

  const { data, isLoading, isError, error } = useQuery(queryOptions);
  const tutors = data?.data ?? [];
  const pagination = resolvePaginationMeta(data?.meta, page, DEFAULT_PAGE_SIZE);

  if (isError && isApiForbiddenError(error)) {
    return (
      <ErrorState
        title="Access denied"
        message="Only parents can browse the tutor directory."
        actionLabel="Go to dashboard"
        actionHref="/dashboard"
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tutor Directory"
        description="Browse qualified tutors for your cases"
        count={pagination.total}
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
              onChange={(value) => {
                setQualSearch(value);
                setPage(1);
              }}
              placeholder="Search by qualification..."
            />
          </div>

          {isLoading ? (
            <TutorGridSkeleton />
          ) : tutors.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No tutors found"
              description="No tutors match your search criteria. Try a different name or qualification."
              variant="compact"
            />
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {tutors.map((tutor) => (
                  <TutorCard key={tutor.id} tutor={tutor} />
                ))}
              </div>
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
