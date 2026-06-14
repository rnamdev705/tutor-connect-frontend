import { Loader2 } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { formatFileSize } from "@/lib/format";
import type { PendingDocumentUpload } from "@/lib/hooks/use-pending-document-uploads";

export function PendingCaseDocumentRow({ upload }: { upload: PendingDocumentUpload }) {
  return (
    <TableRow className="bg-muted/40">
      <TableCell className="font-medium">{upload.fileName}</TableCell>
      <TableCell className="text-muted-foreground text-xs">
        {upload.mimeType.split("/").pop()?.toUpperCase() ?? "—"}
      </TableCell>
      <TableCell className="text-muted-foreground">
        {formatFileSize(upload.sizeBytes)}
      </TableCell>
      <TableCell className="text-muted-foreground">—</TableCell>
      <TableCell>
        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Uploading...
        </span>
      </TableCell>
      <TableCell />
    </TableRow>
  );
}

export function PendingTutorDocumentRow({ upload }: { upload: PendingDocumentUpload }) {
  return (
    <TableRow className="bg-muted/40">
      <TableCell className="font-medium">{upload.fileName}</TableCell>
      <TableCell className="text-muted-foreground">
        {formatFileSize(upload.sizeBytes)}
      </TableCell>
      <TableCell>
        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Uploading...
        </span>
      </TableCell>
      <TableCell />
    </TableRow>
  );
}

export function DeletingStatusCell() {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
      <Loader2 className="h-3.5 w-3.5 animate-spin" />
      Deleting...
    </span>
  );
}

export function InvitingStatusCell() {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
      <Loader2 className="h-3.5 w-3.5 animate-spin" />
      Inviting...
    </span>
  );
}
