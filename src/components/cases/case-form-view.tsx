"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { If, Then, Else } from "react-if";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, CheckCircle2, File, Info, Loader2, Trash2, Upload } from "lucide-react";
import {
  getCasesByCaseIdDocumentsOptions,
  getCasesByIdQueryKey,
  patchCasesByIdMutation,
  postCasesByCaseIdDocumentsMutation,
  postCasesMutation,
} from "@/api/@tanstack/react-query.gen";
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
import { EmptyState } from "@/components/common/empty-state";
import { FormContentSkeleton } from "@/components/common/content-skeletons";
import { useAuth } from "@/lib/auth-context";
import { getApiErrorMessage } from "@/lib/api-error";
import { enqueueCaseDocumentUploads } from "@/lib/hooks/use-pending-document-uploads";
import { caseDetailQueryOptions } from "@/lib/queries/list-queries";
import { invalidateAllCasesList } from "@/lib/queries/invalidate";
import { LEVELS, SUBJECTS, MAX_FILE_SIZE_MB } from "@/lib/constants";
import type { Case } from "@/api/types.gen";

type CaseStatus = Case["status"];
import type { CaseDetail } from "@/api/types.gen";
import { toast } from "sonner";

interface CaseFormViewProps {
  caseId?: string;
  mode: "create" | "edit";
}

export function CaseFormView({ caseId, mode }: CaseFormViewProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [uploadOpen, setUploadOpen] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [form, setForm] = useState({
    title: "",
    subject: "",
    level: "",
    location: "",
    budgetPerHour: "",
    status: "open" as CaseStatus,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: existingCase, isLoading } = useQuery({
    ...caseDetailQueryOptions(caseId!),
    enabled: mode === "edit" && !!caseId,
  });

  useEffect(() => {
    if (existingCase) {
      setForm({
        title: existingCase.title,
        subject: existingCase.subject,
        level: existingCase.level,
        location: existingCase.location,
        budgetPerHour: String(existingCase.budgetPerHour),
        status: existingCase.status,
      });
    }
  }, [existingCase]);

  useEffect(() => {
    if (user?.role === "tutor") {
      router.replace("/unauthorized");
    }
  }, [user, router]);

  const createMutation = useMutation({
    ...postCasesMutation(),
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  const updateMutation = useMutation({
    ...patchCasesByIdMutation(),
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  const uploadMutation = useMutation({
    ...postCasesByCaseIdDocumentsMutation(),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: getCasesByCaseIdDocumentsOptions({
          path: { caseId: variables.path.caseId },
        }).queryKey,
      });
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

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

  const handleSave = async () => {
    if (!validate() || isSaving) return;

    const body = {
      title: form.title.trim(),
      subject: form.subject,
      level: form.level,
      location: form.location.trim(),
      budgetPerHour: Number(form.budgetPerHour),
    };

    try {
      if (mode === "create") {
        const created = await createMutation.mutateAsync({ body });
        void invalidateAllCasesList(queryClient);
        toast.success("Case created");

        if (pendingFiles.length > 0) {
          enqueueCaseDocumentUploads(created.id, pendingFiles, (file) =>
            uploadMutation.mutateAsync({
              path: { caseId: created.id },
              body: { file },
            }),
          );
        }

        router.push(`/cases/${created.id}`);
      } else if (caseId) {
        const updated = await updateMutation.mutateAsync({
          path: { id: caseId },
          body: {
            ...body,
            status: form.status,
          },
        });

        queryClient.setQueryData(
          getCasesByIdQueryKey({ path: { id: caseId } }),
          (old: CaseDetail | undefined) =>
            old ? { ...old, ...updated, invitations: old.invitations } : old,
        );
        void invalidateAllCasesList(queryClient);
        toast.success("Case updated");
        router.push(`/cases/${caseId}`);
      }
    } catch {
      // Errors surfaced via mutation onError
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

  if (mode === "edit" && isLoading) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={caseId ? `/cases/${caseId}` : "/cases"}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Edit Case</h1>
            <p className="text-sm text-muted-foreground">Update your case details.</p>
          </div>
        </div>
        <FormContentSkeleton sections={3} />
      </div>
    );
  }

  const handleDocumentUpload = (file: File) => {
    if (mode === "create") {
      setPendingFiles((prev) => [...prev, file]);
      toast.success(`${file.name} added`);
      return;
    }
    if (caseId) {
      uploadMutation.mutate(
        { path: { caseId }, body: { file } },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: getCasesByCaseIdDocumentsOptions({ path: { caseId } }).queryKey,
            });
            toast.success(`${file.name} uploaded`);
          },
          onError: (error) => toast.error(getApiErrorMessage(error)),
        },
      );
    }
  };

  const removeDocument = (index: number) => {
    setPendingFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const isSaving =
    mode === "create" ? createMutation.isPending : updateMutation.isPending;

  const formDisabled = isSaving;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-4">
        {formDisabled ? (
          <Button variant="ghost" size="icon" disabled>
            <ArrowLeft className="h-4 w-4" />
          </Button>
        ) : (
          <Button variant="ghost" size="icon" asChild>
            <Link href={mode === "edit" && caseId ? `/cases/${caseId}` : "/cases"}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
        )}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {mode === "create" ? "Create Case" : "Edit Case"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {mode === "create"
              ? "Post a new tutoring case for tutors to respond to."
              : "Update your case details."}
          </p>
        </div>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Case Details</CardTitle>
          <CardDescription>
            Provide information about the tutoring requirement.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={form.title}
              disabled={formDisabled}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Weekly P5 Math tuition"
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
                disabled={formDisabled}
                onValueChange={(v) => v && setForm({ ...form, subject: v })}
              >
                <SelectTrigger disabled={formDisabled}>
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
                disabled={formDisabled}
                onValueChange={(v) => v && setForm({ ...form, level: v })}
              >
                <SelectTrigger disabled={formDisabled}>
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
              disabled={formDisabled}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="e.g. Bishan"
            />
            {errors.location && (
              <p className="text-xs text-destructive">{errors.location}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="budget">Budget per hour (£)</Label>
            <Input
              id="budget"
              type="number"
              min={1}
              value={form.budgetPerHour}
              disabled={formDisabled}
              onChange={(e) =>
                setForm({ ...form, budgetPerHour: e.target.value })
              }
            />
            {errors.budgetPerHour && (
              <p className="text-xs text-destructive">{errors.budgetPerHour}</p>
            )}
          </div>

          {mode === "edit" && (
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={form.status}
                disabled={formDisabled}
                onValueChange={(v) =>
                  v && setForm({ ...form, status: v as CaseStatus })
                }
              >
                <SelectTrigger disabled={formDisabled}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
              <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                Matched status is set automatically when a tutor accepts an invitation.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3 space-y-0">
          <div className="min-w-0">
            <CardTitle className="text-base">Documents</CardTitle>
            <CardDescription>
              Optional supporting files (max {MAX_FILE_SIZE_MB}MB each)
            </CardDescription>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="shrink-0"
            disabled={formDisabled}
            onClick={() => setUploadOpen(true)}
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload
          </Button>
        </CardHeader>
        <CardContent>
          <If condition={pendingFiles.length === 0}>
            <Then>
              <EmptyState
                icon={File}
                title="No documents added"
                description="Upload worksheets, syllabi, or other supporting materials."
                actionLabel="Upload Document"
                onAction={() => {
                  if (!formDisabled) setUploadOpen(true);
                }}
                variant="compact"
              />
            </Then>
            <Else>
              <ul className="space-y-2">
                {pendingFiles.map((file, index) => (
                  <li
                    key={`${file.name}-${index}`}
                    className="flex items-center justify-between rounded-lg border px-3 py-2"
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      <File className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <span className="truncate text-sm">{file.name}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      disabled={formDisabled}
                      onClick={() => removeDocument(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            </Else>
          </If>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Validation</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {validationItems.map((item) => (
              <li key={item.label} className="flex items-center gap-2 text-sm">
                <CheckCircle2
                  className={`h-4 w-4 ${item.valid ? "text-emerald-600" : "text-muted-foreground"}`}
                />
                {item.label}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        {formDisabled ? (
          <Button variant="outline" disabled>
            Cancel
          </Button>
        ) : (
          <Button variant="outline" asChild>
            <Link href={mode === "edit" && caseId ? `/cases/${caseId}` : "/cases"}>
              Cancel
            </Link>
          </Button>
        )}
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : mode === "create" ? (
            "Create Case"
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>

      <UploadDocumentModal
        open={uploadOpen}
        onOpenChange={(open) => {
          if (open && formDisabled) return;
          setUploadOpen(open);
        }}
        onUpload={handleDocumentUpload}
      />
    </div>
  );
}
