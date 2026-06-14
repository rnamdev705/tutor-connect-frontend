"use client";

import { useEffect, useRef, useState } from "react";
import { Download, Eye, FileText, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getApiErrorMessage } from "@/lib/api-error";
import {
  canPreviewDocument,
  downloadDocument,
  fetchDocumentBlob,
  saveDocumentBlob,
} from "@/lib/document-file";
import { toast } from "sonner";

interface DocumentPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: {
    id: string;
    originalName: string;
    mimeType: string;
  } | null;
}

export function DocumentPreviewModal({
  open,
  onOpenChange,
  document,
}: DocumentPreviewModalProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const previewUrlRef = useRef<string | null>(null);

  useEffect(() => {
    if (!open || !document) {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
        previewUrlRef.current = null;
      }
      setPreviewUrl(null);
      setError(null);
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    const loadPreview = async () => {
      setIsLoading(true);
      setError(null);
      setPreviewUrl(null);

      try {
        const blob = await fetchDocumentBlob(document.id);
        if (cancelled) return;

        const typedBlob = new Blob([blob], { type: document.mimeType });
        const objectUrl = URL.createObjectURL(typedBlob);
        previewUrlRef.current = objectUrl;
        setPreviewUrl(objectUrl);
      } catch (loadError) {
        if (!cancelled) {
          setError(getApiErrorMessage(loadError));
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadPreview();

    return () => {
      cancelled = true;
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
        previewUrlRef.current = null;
      }
    };
  }, [open, document?.id, document?.mimeType]);

  const handleDownload = async () => {
    if (!document) return;

    try {
      setIsDownloading(true);
      if (previewUrl) {
        const response = await fetch(previewUrl);
        const blob = await response.blob();
        saveDocumentBlob(blob, document.originalName);
      } else {
        await downloadDocument(document.id, document.originalName);
      }
      toast.success("Download started");
    } catch (downloadError) {
      toast.error(getApiErrorMessage(downloadError));
    } finally {
      setIsDownloading(false);
    }
  };

  const previewSupported = document ? canPreviewDocument(document.mimeType) : false;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] flex-col gap-4 overflow-hidden sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="truncate pr-8">
            {document?.originalName ?? "Document preview"}
          </DialogTitle>
          <DialogDescription>
            File content loads only when you open the preview.
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-[320px] flex-1 overflow-hidden rounded-lg border bg-muted/20">
          {isLoading ? (
            <div className="flex h-full min-h-[320px] items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="flex h-full min-h-[320px] flex-col items-center justify-center gap-3 p-6 text-center">
              <FileText className="h-10 w-10 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
          ) : previewUrl && document && previewSupported ? (
            document.mimeType === "application/pdf" ? (
              <iframe
                title={document.originalName}
                src={previewUrl}
                className="h-[70vh] w-full"
              />
            ) : (
              <div className="flex h-full min-h-[320px] items-center justify-center p-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt={document.originalName}
                  className="max-h-[70vh] max-w-full object-contain"
                />
              </div>
            )
          ) : (
            <div className="flex h-full min-h-[320px] flex-col items-center justify-center gap-3 p-6 text-center">
              <FileText className="h-10 w-10 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Preview is not available for this file type. Download the file to view it.
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <Button onClick={handleDownload} disabled={isDownloading || isLoading}>
            {isDownloading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Downloading...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Download
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
