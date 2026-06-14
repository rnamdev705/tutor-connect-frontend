import Link from "next/link";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { UserAvatar } from "@/components/common/user-avatar";
import {
  getExperienceSummary,
  getQualificationSummary,
} from "@/lib/format";
import type { TutorProfileSummary } from "@/api/types.gen";

interface TutorCardProps {
  tutor: TutorProfileSummary;
}

export function TutorCard({ tutor }: TutorCardProps) {
  return (
    <Card className="shadow-sm transition-all hover:shadow-md hover:border-neutral-300">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <UserAvatar name={tutor.displayName} size="md" />
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold leading-tight">{tutor.displayName}</h3>
            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
              {getQualificationSummary(tutor)}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pb-3">
        <p className="text-sm text-muted-foreground">
          {getExperienceSummary(tutor)}
        </p>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <FileText className="h-3.5 w-3.5" />
          View profile for documents
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" asChild>
          <Link href={`/tutors/${tutor.id}`}>View Profile</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
