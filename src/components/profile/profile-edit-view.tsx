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
import { toast } from "sonner";

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

  const handleSave = async () => {
    if (formDisabled) return;

    const displayName = form.displayName.trim();
    const email = form.email.trim().toLowerCase();

    if (!displayName) {
      toast.error("Display name is required");
      return;
    }

    if (!email) {
      toast.error("Email is required");
      return;
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
            qualifications: form.qualifications
              .split("\n")
              .map((q) => q.trim())
              .filter(Boolean),
            teachingBackground: form.teachingBackground.trim(),
            yearsOfExperience: form.yearsOfExperience
              ? Number(form.yearsOfExperience)
              : 0,
            subjectsTaught: form.subjects,
          },
        });
      }

      await queryClient.invalidateQueries({ queryKey: getAuthMeQueryKey() });
      await queryClient.invalidateQueries({ queryKey: getTutorsMeProfileQueryKey() });
      toast.success("Profile updated");
      router.push("/profile");
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
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {formDisabled ? (
            <Button variant="ghost" size="icon" disabled>
              <ArrowLeft className="h-4 w-4" />
            </Button>
          ) : (
            <Button variant="ghost" size="icon" asChild>
              <Link href="/profile">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
          )}
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Edit Profile</h1>
            <p className="text-sm text-muted-foreground">
              Update your account information
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

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Basic Information</CardTitle>
          <CardDescription>Your public profile details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Display Name</Label>
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
              <Label htmlFor="email">Email</Label>
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
              <CardTitle className="text-base">Qualifications</CardTitle>
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
                <Label htmlFor="years">Years of Experience</Label>
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
                <Label>Subjects Taught</Label>
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
                <Label htmlFor="background">Teaching Background</Label>
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
        {formDisabled ? (
          <Button variant="outline" disabled>
            Cancel
          </Button>
        ) : (
          <Button variant="outline" asChild>
            <Link href="/profile">Cancel</Link>
          </Button>
        )}
        <Button onClick={handleSave} disabled={formDisabled}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </div>
  );
}
