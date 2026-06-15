import { TableCell, TableRow } from "@/components/ui/table";
import { DeletingStatusCell } from "@/components/common/pending-status-cells";
import { formatFileSize } from "@/lib/format";
import type { PendingDocumentUpload } from "@/lib/hooks/use-pending-document-uploads";

export function PendingCaseDocumentRow({ upload }: { upload: PendingDocumentUpload }) {
  return (
    <TableRow className="bg-muted/40">
      <TableCell className="max-w-[200px] truncate font-medium">{upload.fileName}</TableCell>
      <TableCell className="text-muted-foreground text-xs">
        {upload.mimeType.split("/").pop()?.toUpperCase() ?? "—"}
      </TableCell>
      <TableCell className="text-muted-foreground">
        {formatFileSize(upload.sizeBytes)}
      </TableCell>
      <TableCell className="text-muted-foreground">—</TableCell>
      <TableCell>
        <DeletingStatusCell />
      </TableCell>
      <TableCell />
    </TableRow>
  );
}

export function PendingTutorDocumentRow({ upload }: { upload: PendingDocumentUpload }) {
  return (
    <TableRow className="bg-muted/40">
      <TableCell className="max-w-[200px] truncate font-medium">{upload.fileName}</TableCell>
      <TableCell className="text-muted-foreground">
        {formatFileSize(upload.sizeBytes)}
      </TableCell>
      <TableCell>
        <DeletingStatusCell />
      </TableCell>
      <TableCell />
    </TableRow>
  );
}
