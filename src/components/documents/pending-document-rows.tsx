import { TableCell, TableRow } from "@/components/ui/table";
import { LoadingStatusCell } from "@/components/common/loading-status-cell";
import { formatFileSize } from "@/lib/format";
import type { PendingDocumentUpload } from "@/lib/hooks/use-pending-document-uploads";
import { textOverflow } from "@/lib/text-overflow";

export function PendingCaseDocumentRow({ upload }: { upload: PendingDocumentUpload }) {
  return (
    <TableRow className="bg-muted/40">
      <TableCell className={textOverflow.fileName}>{upload.fileName}</TableCell>
      <TableCell className="text-muted-foreground text-xs">
        {upload.mimeType.split("/").pop()?.toUpperCase() ?? "—"}
      </TableCell>
      <TableCell className="text-muted-foreground">
        {formatFileSize(upload.sizeBytes)}
      </TableCell>
      <TableCell className="text-muted-foreground">—</TableCell>
      <TableCell>
        <LoadingStatusCell label="Uploading..." />
      </TableCell>
      <TableCell />
    </TableRow>
  );
}

export function PendingTutorDocumentRow({ upload }: { upload: PendingDocumentUpload }) {
  return (
    <TableRow className="bg-muted/40">
      <TableCell className={textOverflow.fileName}>{upload.fileName}</TableCell>
      <TableCell className="text-muted-foreground">
        {formatFileSize(upload.sizeBytes)}
      </TableCell>
      <TableCell>
        <LoadingStatusCell label="Uploading..." />
      </TableCell>
      <TableCell />
    </TableRow>
  );
}
