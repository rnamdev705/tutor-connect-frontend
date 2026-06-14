"use client";

import { useCallback, useState } from "react";

export function usePendingCaseDeletes() {
  const [deletingIds, setDeletingIds] = useState<string[]>([]);

  const trackDelete = useCallback(
    (caseId: string, deleteFn: () => Promise<unknown>) => {
      setDeletingIds((current) =>
        current.includes(caseId) ? current : [...current, caseId],
      );
      void deleteFn().finally(() => {
        setDeletingIds((current) => current.filter((id) => id !== caseId));
      });
    },
    [],
  );

  const isDeleting = useCallback(
    (caseId: string) => deletingIds.includes(caseId),
    [deletingIds],
  );

  return { trackDelete, isDeleting };
}
