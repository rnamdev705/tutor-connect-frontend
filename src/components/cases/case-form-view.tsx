"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, File, Info, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UploadDocumentModal } from "@/components/modals/upload-document-modal";
import { useAuth } from "@/lib/auth-context";
import { LEVELS, SUBJECTS, MAX_FILE_SIZE_MB } from "@/lib/constants";
import type { Case, CaseStatus } from "@/lib/types";
import { toast } from "sonner";

interface CaseFormViewProps {
  caseData?: Case;
  mode: "create" | "edit";
}

export function CaseFormView({ caseData, mode }: CaseFormViewProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [uploadOpen, setUploadOpen] = useState(false);
  const [documents, setDocuments] = useState<File[]>([]);
  const [form, setForm] = useState({
    title: caseData?.title ?? "",
    subject: caseData?.subject ?? "",
    level: caseData?.level ?? "",
    location: caseData?.location ?? "",
    budgetPerHour: caseData?.budgetPerHour?.toString() ?? "",
    status: (caseData?.status ?? "open") as CaseStatus,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user?.role === "tutor") {
      router.replace("/unauthorized");
    }
  }, [user, router]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.subject) e.subject = "Subject is required";
    if (!form.level) e.level = "Level is required";
    if (!form.location.trim()) e.location = "Location is required";
    if (!form.budgetPerHour || Number(form.budgetPerHour) <= 0)
      e.budgetPerHour = "Valid budget is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    if (mode === "create") {
      router.push("/cases");
    } else {
      router.push(`/cases/${caseData?.id}`);
    }
  };

  const validationItems = [
    { label: "Title", valid: !!form.title.trim() },
    { label: "Subject", valid: !!form.subject },
    { label: "Level", valid: !!form.level },
    { label: "Location", valid: !!form.location.trim() },
    { label: "Budget", valid: !!form.budgetPerHour && Number(form.budgetPerHour) > 0 },
  ];

  if (user?.role === "tutor") {
    return null;
  }

  const handleDocumentUpload = (file: File) => {
    setDocuments((prev) => [...prev, file]);
    toast.success(`${file.name} added`);
  };

  const removeDocument = (index: number) => {
    setDocuments((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={mode === "edit" ? `/cases/${caseData?.id}` : "/cases"}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {mode === "create" ? "Create Case" : "Edit Case"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {mode === "create"
              ? "Fill in the details to create a new tutoring case."
              : "Update your case information."}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Case Information</CardTitle>
              <CardDescription>
                Provide details about the tutoring requirement.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. GCSE Maths Exam Preparation"
                />
                {errors.title && (
                  <p className="text-xs text-destructive">{errors.title}</p>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Subject</Label>
                  <Select
                    value={form.subject}
                    onValueChange={(v) => v && setForm({ ...form, subject: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {SUBJECTS.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.subject && (
                    <p className="text-xs text-destructive">{errors.subject}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Level</Label>
                  <Select
                    value={form.level}
                    onValueChange={(v) => v && setForm({ ...form, level: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      {LEVELS.map((l) => (
                        <SelectItem key={l} value={l}>{l}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.level && (
                    <p className="text-xs text-destructive">{errors.level}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="e.g. London, SW1 or Online"
                />
                {errors.location && (
                  <p className="text-xs text-destructive">{errors.location}</p>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="budget">Budget Per Hour (£)</Label>
                  <Input
                    id="budget"
                    type="number"
                    min="1"
                    value={form.budgetPerHour}
                    onChange={(e) =>
                      setForm({ ...form, budgetPerHour: e.target.value })
                    }
                    placeholder="45"
                  />
                  {errors.budgetPerHour && (
                    <p className="text-xs text-destructive">{errors.budgetPerHour}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={form.status}
                    onValueChange={(v) =>
                      v && setForm({ ...form, status: v as CaseStatus })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="matched">Matched</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm mt-6">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">Documents</CardTitle>
                <CardDescription>
                  Upload supporting files for this case (optional)
                </CardDescription>
              </div>
              <Button type="button" size="sm" variant="outline" onClick={() => setUploadOpen(true)}>
                <Upload className="mr-2 h-4 w-4" />
                Upload
              </Button>
            </CardHeader>
            <CardContent>
              {documents.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-muted/30 px-6 py-10 text-center">
                  <Upload className="mb-3 h-8 w-8 text-muted-foreground" />
                  <p className="text-sm font-medium">No documents added yet</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    PDF, DOC, DOCX, PNG, JPEG · Max {MAX_FILE_SIZE_MB}MB
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => setUploadOpen(true)}
                  >
                    Upload document
                  </Button>
                </div>
              ) : (
                <ul className="space-y-2">
                  {documents.map((file, index) => (
                    <li
                      key={`${file.name}-${index}`}
                      className="flex items-center justify-between rounded-lg border px-3 py-2"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <File className="h-4 w-4 shrink-0 text-muted-foreground" />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{file.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {(file.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0 text-destructive"
                        onClick={() => removeDocument(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Info className="h-4 w-4" />
                Form Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>Be specific in your title to attract the right tutors.</p>
              <p>Set a competitive budget based on subject and level.</p>
              <p>Include location details for in-person tutoring.</p>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Validation Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {validationItems.map((item) => (
                <div key={item.label} className="flex items-center gap-2 text-sm">
                  <CheckCircle2
                    className={`h-4 w-4 ${
                      item.valid ? "text-emerald-600" : "text-muted-foreground/40"
                    }`}
                  />
                  <span className={item.valid ? "text-foreground" : "text-muted-foreground"}>
                    {item.label}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="sticky bottom-0 -mx-6 flex items-center justify-end gap-3 border-t bg-background/95 px-6 py-4 backdrop-blur">
        <Button variant="outline" asChild>
          <Link href={mode === "edit" ? `/cases/${caseData?.id}` : "/cases"}>
            Cancel
          </Link>
        </Button>
        <Button onClick={handleSave}>Save</Button>
      </div>

      <UploadDocumentModal
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        onUpload={handleDocumentUpload}
      />
    </div>
  );
}
