"use client";

import { useCallback, useState } from "react";
import { Upload, File, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE_MB } from "@/lib/constants";

interface UploadDocumentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Called with the validated file after the simulated upload completes. */
  onUpload?: (file: File) => void;
}

/**
 * Modal for uploading case or profile documents.
 * Validates file type and size against {@link ALLOWED_FILE_TYPES} and {@link MAX_FILE_SIZE_MB}.
 */
export function UploadDocumentModal({
  open,
  onOpenChange,
  onUpload,
}: UploadDocumentModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setFile(null);
    setUploading(false);
    setProgress(0);
    setError(null);
  }, []);

  const validateFile = (f: File): string | null => {
    if (!ALLOWED_FILE_TYPES.includes(f.type) && f.type !== "application/zip") {
      return "File type not supported. Please upload PDF, DOC, DOCX, PNG, or JPEG.";
    }
    if (f.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      return `File exceeds maximum size of ${MAX_FILE_SIZE_MB}MB.`;
    }
    return null;
  };

  const handleFile = (f: File) => {
    const err = validateFile(f);
    if (err) {
      setError(err);
      setFile(null);
      return;
    }
    setError(null);
    setFile(f);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFile(dropped);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        return p + 10;
      });
    }, 100);

    await new Promise((r) => setTimeout(r, 1100));
    onUpload?.(file);
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) reset();
        onOpenChange(v);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
          <DialogDescription>
            Drag and drop a file or click to browse. Max size {MAX_FILE_SIZE_MB}MB.
          </DialogDescription>
        </DialogHeader>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-colors ${
            dragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25"
          }`}
        >
          {file ? (
            <div className="flex items-center gap-3">
              <File className="h-8 w-8 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setFile(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <>
              <Upload className="mb-3 h-10 w-10 text-muted-foreground" />
              <p className="text-sm font-medium">Drop your file here</p>
              <p className="mt-1 text-xs text-muted-foreground">
                PDF, DOC, DOCX, PNG, JPEG
              </p>
              <label className="mt-4">
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFile(f);
                  }}
                />
                <Button variant="outline" size="sm" asChild>
                  <span>Browse files</span>
                </Button>
              </label>
            </>
          )}
        </div>

        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}

        {uploading && (
          <div className="space-y-2">
            <Progress value={progress} />
            <p className="text-xs text-muted-foreground text-center">
              Uploading... {progress}%
            </p>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={!file || uploading}>
            Upload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
