"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Loader2 } from "lucide-react";
import {
  getAuthMeQueryKey,
  getTutorsMeProfileOptions,
  getTutorsMeProfileQueryKey,
  patchAuthMeMutation,
  putTutorsMeProfileMutation,
} from "@/api/@tanstack/react-query.gen";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/lib/auth-context";
import { getApiErrorMessage } from "@/lib/api-error";
import { SUBJECTS } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { FormContentSkeleton } from "@/components/common/content-skeletons";
import {
  getTutorProfileMissingFields,
  isTutorProfileComplete,
} from "@/lib/tutor-profile-completion";
import { toast } from "sonner";
import { textOverflow } from "@/lib/text-overflow";

export function ProfileEditView() {
  const { user } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const isTutor = user?.role === "tutor";

  const { data: tutorProfile, isLoading } = useQuery({
    ...getTutorsMeProfileOptions(),
    enabled: isTutor,
  });

  const [form, setForm] = useState({
    displayName: user?.name ?? "",
    email: user?.email ?? "",
    teachingBackground: "",
    yearsOfExperience: "",
    qualifications: "",
    subjects: [] as string[],
  });

  useEffect(() => {
    setForm((current) => ({
      ...current,
      displayName: tutorProfile?.displayName ?? user?.name ?? "",
      email: user?.email ?? "",
      teachingBackground: tutorProfile?.teachingBackground ?? "",
      yearsOfExperience: tutorProfile?.yearsOfExperience?.toString() ?? "",
      qualifications: tutorProfile?.qualifications.join("\n") ?? "",
      subjects: tutorProfile?.subjectsTaught ?? [],
    }));
  }, [tutorProfile, user?.email, user?.name]);

  const updateMeMutation = useMutation(patchAuthMeMutation());
  const upsertProfileMutation = useMutation(putTutorsMeProfileMutation());

  const isSaving =
    updateMeMutation.isPending || upsertProfileMutation.isPending;
  const formDisabled = isSaving;
  const profileComplete = isTutorProfileComplete(tutorProfile, user);
  const mustCompleteProfile = isTutor && !profileComplete;
  const missingFields = isTutor
    ? getTutorProfileMissingFields(tutorProfile, user)
    : [];

  const handleSave = async () => {
    if (formDisabled) return;

    const displayName = form.displayName.trim();
    const email = form.email.trim().toLowerCase();
    const qualifications = form.qualifications
      .split("\n")
      .map((q) => q.trim())
      .filter(Boolean);
    const teachingBackground = form.teachingBackground.trim();
    const yearsValue = form.yearsOfExperience.trim();

    if (!displayName) {
      toast.error("Display name is required");
      return;
    }

    if (!email) {
      toast.error("Email is required");
      return;
    }

    if (isTutor) {
      if (qualifications.length === 0) {
        toast.error("Add at least one qualification");
        return;
      }

      if (!yearsValue) {
        toast.error("Years of experience is required");
        return;
      }

      const yearsOfExperience = Number(yearsValue);
      if (Number.isNaN(yearsOfExperience) || yearsOfExperience < 0) {
        toast.error("Enter a valid number of years");
        return;
      }

      if (form.subjects.length === 0) {
        toast.error("Select at least one subject");
        return;
      }

      if (!teachingBackground) {
        toast.error("Teaching background is required");
        return;
      }
    }

    try {
      const meBody: {
        displayName: string;
        email?: string;
      } = { displayName };

      if (email !== user?.email?.toLowerCase()) {
        meBody.email = email;
      }

      await updateMeMutation.mutateAsync({ body: meBody });

      if (isTutor) {
        await upsertProfileMutation.mutateAsync({
          body: {
            displayName,
            qualifications,
            teachingBackground,
            yearsOfExperience: Number(yearsValue),
            subjectsTaught: form.subjects,
          },
        });
      }

      await queryClient.invalidateQueries({ queryKey: getAuthMeQueryKey() });
      await queryClient.invalidateQueries({ queryKey: getTutorsMeProfileQueryKey() });
      toast.success(mustCompleteProfile ? "Profile completed" : "Profile updated");
      router.push(mustCompleteProfile ? "/dashboard" : "/profile");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const toggleSubject = (subject: string) => {
    if (formDisabled) return;
    setForm((f) => ({
      ...f,
      subjects: f.subjects.includes(subject)
        ? f.subjects.filter((s) => s !== subject)
        : [...f.subjects, subject],
    }));
  };

  if (isTutor && isLoading) {
    return (
      <div className="space-y-6">
        <div className="min-w-0">
          <h1 className={textOverflow.pageTitle}>
            {mustCompleteProfile ? "Complete Your Profile" : "Edit Profile"}
          </h1>
          <p className={textOverflow.pageSubtitle}>
            Update your account information
          </p>
        </div>
        <FormContentSkeleton sections={3} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex min-w-0 items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4">
          {!mustCompleteProfile && (
            formDisabled ? (
              <Button variant="ghost" size="icon" disabled>
                <ArrowLeft className="h-4 w-4" />
              </Button>
            ) : (
              <Button variant="ghost" size="icon" asChild>
                <Link href="/profile">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
            )
          )}
          <div className="min-w-0">
            <h1 className={textOverflow.pageTitle}>
              {mustCompleteProfile ? "Complete Your Profile" : "Edit Profile"}
            </h1>
            <p className={textOverflow.pageSubtitle}>
              {mustCompleteProfile
                ? "Fill in every field below to access the tutor portal."
                : "Update your account information"}
            </p>
          </div>
        </div>
        {isSaving && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Saving...
          </div>
        )}
      </div>

      {mustCompleteProfile && missingFields.length > 0 && (
        <Card className="border-amber-200 bg-amber-50 shadow-sm dark:border-amber-900 dark:bg-amber-950/30">
          <CardContent className="pt-6">
            <p className="text-sm font-medium">Required before you can continue</p>
            <p className="mt-1 break-words text-sm text-muted-foreground">
              Complete: {missingFields.join(", ")}
            </p>
          </CardContent>
        </Card>
      )}

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Basic Information</CardTitle>
          <CardDescription>Your public profile details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Display Name *</Label>
              <Input
                id="name"
                value={form.displayName}
                disabled={formDisabled}
                onChange={(e) =>
                  setForm({ ...form, displayName: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                disabled={formDisabled}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {isTutor && (
        <>
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Qualifications *</CardTitle>
              <CardDescription>One qualification per line</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                rows={4}
                value={form.qualifications}
                disabled={formDisabled}
                onChange={(e) =>
                  setForm({ ...form, qualifications: e.target.value })
                }
                placeholder="MSc Mathematics, Imperial College&#10;PGCE Secondary Education"
              />
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Experience</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="years">Years of Experience *</Label>
                <Input
                  id="years"
                  type="number"
                  min="0"
                  value={form.yearsOfExperience}
                  disabled={formDisabled}
                  onChange={(e) =>
                    setForm({ ...form, yearsOfExperience: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Subjects Taught *</Label>
                <div className="flex flex-wrap gap-2">
                  {SUBJECTS.map((s) => (
                    <Badge
                      key={s}
                      variant={form.subjects.includes(s) ? "default" : "outline"}
                      className={formDisabled ? "pointer-events-none opacity-60" : "cursor-pointer"}
                      onClick={() => toggleSubject(s)}
                    >
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="background">Teaching Background *</Label>
                <Textarea
                  id="background"
                  rows={4}
                  value={form.teachingBackground}
                  disabled={formDisabled}
                  onChange={(e) =>
                    setForm({ ...form, teachingBackground: e.target.value })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </>
      )}

      <div className="flex justify-end gap-3">
        {!mustCompleteProfile && (
          formDisabled ? (
            <Button variant="outline" disabled>
              Cancel
            </Button>
          ) : (
            <Button variant="outline" asChild>
              <Link href="/profile">Cancel</Link>
            </Button>
          )
        )}
        <Button onClick={handleSave} disabled={formDisabled}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : mustCompleteProfile ? (
            "Save & Continue"
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </div>
  );
}
