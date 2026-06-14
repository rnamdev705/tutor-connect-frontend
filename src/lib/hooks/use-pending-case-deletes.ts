"use client";

import { useCallback, useState } from "react";

export function usePendingCaseDeletes() {
  const [deletingIds, setDeletingIds] = useState<string[]>([]);

  const trackDelete = useCallback(
    (caseId: string, deleteFn: () => Promise<unknown>) => {
      setDeletingIds((current) => {
        if (current.includes(caseId)) return current;
        void deleteFn().finally(() => {
          setDeletingIds((ids) => ids.filter((id) => id !== caseId));
        });
        return [...current, caseId];
      });
    },
    [],
  );

  const isDeleting = useCallback(
    (caseId: string) => deletingIds.includes(caseId),
    [deletingIds],
  );

  const hasPending = deletingIds.length > 0;

  return { trackDelete, isDeleting, hasPending };
}
