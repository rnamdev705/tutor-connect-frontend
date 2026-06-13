import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/common/status-badge";
import { formatDate } from "@/lib/mock-data";
import type { Case } from "@/lib/types";

interface CasesTableProps {
  cases: Case[];
  showUpdated?: boolean;
}

export function CasesTable({ cases, showUpdated = false }: CasesTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Subject</TableHead>
          <TableHead>Status</TableHead>
          {showUpdated && <TableHead>Updated</TableHead>}
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {cases.map((c) => (
          <TableRow key={c.id}>
            <TableCell className="font-medium">{c.title}</TableCell>
            <TableCell className="text-muted-foreground">{c.subject}</TableCell>
            <TableCell>
              <StatusBadge status={c.status} />
            </TableCell>
            {showUpdated && (
              <TableCell className="text-muted-foreground">
                {formatDate(c.updatedAt)}
              </TableCell>
            )}
            <TableCell className="text-right">
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/cases/${c.id}`}>View</Link>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
