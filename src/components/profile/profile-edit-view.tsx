"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, Loader2 } from "lucide-react";
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
import { mockTutors } from "@/lib/mock-data";
import { SUBJECTS } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";

export function ProfileEditView() {
  const { user } = useAuth();
  const router = useRouter();
  const isTutor = user?.role === "tutor";
  const tutor = isTutor ? mockTutors[0] : null;

  const [form, setForm] = useState({
    displayName: tutor?.displayName ?? user?.name ?? "",
    email: user?.email ?? "",
    teachingBackground: tutor?.teachingBackground ?? "",
    yearsOfExperience: tutor?.yearsOfExperience?.toString() ?? "",
    qualifications: tutor?.qualifications.join("\n") ?? "",
    subjects: tutor?.subjectsTaught ?? [],
  });

  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");

  useEffect(() => {
    if (saveState !== "idle") return;
    const timer = setTimeout(() => {
      setSaveState("saving");
      setTimeout(() => setSaveState("saved"), 800);
      setTimeout(() => setSaveState("idle"), 2500);
    }, 2000);
    return () => clearTimeout(timer);
  }, [form, saveState]);

  const toggleSubject = (subject: string) => {
    setForm((f) => ({
      ...f,
      subjects: f.subjects.includes(subject)
        ? f.subjects.filter((s) => s !== subject)
        : [...f.subjects, subject],
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/profile">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Edit Profile</h1>
            <p className="text-sm text-muted-foreground">
              Update your account information
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {saveState === "saving" && (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          )}
          {saveState === "saved" && (
            <>
              <Check className="h-4 w-4 text-emerald-600" />
              <span className="text-emerald-600">All changes saved</span>
            </>
          )}
        </div>
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
                onChange={(e) => setForm({ ...form, email: e.target.value })}
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
                      className="cursor-pointer"
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
        <Button variant="outline" asChild>
          <Link href="/profile">Cancel</Link>
        </Button>
        <Button onClick={() => router.push("/profile")}>Save Changes</Button>
      </div>
    </div>
  );
}
