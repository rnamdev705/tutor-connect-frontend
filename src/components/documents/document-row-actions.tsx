"use client";

import { useState } from "react";
import { Download, Eye, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DocumentPreviewModal } from "@/components/modals/document-preview-modal";
import { getApiErrorMessage } from "@/lib/api-error";
import { downloadDocument } from "@/lib/document-file";
import { toast } from "sonner";

interface DocumentListItem {
  id: string;
  originalName: string;
  mimeType: string;
}

interface DocumentRowActionsProps {
  document: DocumentListItem;
  disabled?: boolean;
  canDelete?: boolean;
  onDelete?: () => void;
}

export function DocumentRowActions({
  document,
  disabled = false,
  canDelete = false,
  onDelete,
}: DocumentRowActionsProps) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (disabled || isDownloading) return;

    try {
      setIsDownloading(true);
      await downloadDocument(document.id, document.originalName);
      toast.success("Download started");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      <div className="flex gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          disabled={disabled}
          title="Preview document"
          onClick={() => setPreviewOpen(true)}
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          disabled={disabled || isDownloading}
          title="Download document"
          onClick={handleDownload}
        >
          {isDownloading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
        </Button>
        {canDelete && onDelete && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive"
            disabled={disabled}
            title="Delete document"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      <DocumentPreviewModal
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        document={document}
      />
    </>
  );
}
