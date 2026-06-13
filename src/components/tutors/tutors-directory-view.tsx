"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { FileText, Search, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/common/page-header";
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
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name..."
                value={nameSearch}
                onChange={(e) => setNameSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by qualification..."
                value={qualSearch}
                onChange={(e) => setQualSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-center">
              <Users className="mb-4 h-12 w-12 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">
                No tutors match your search criteria.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((tutor) => (
                <TutorCard key={tutor.id} tutor={tutor} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
