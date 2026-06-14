"use client";

import { useCallback, useState } from "react";

export function usePendingDocumentDeletes() {
  const [deletingIds, setDeletingIds] = useState<string[]>([]);

  const trackDelete = useCallback(
    (documentId: string, deleteFn: () => Promise<unknown>) => {
      setDeletingIds((current) => {
        if (current.includes(documentId)) return current;
        void deleteFn().finally(() => {
          setDeletingIds((ids) => ids.filter((id) => id !== documentId));
        });
        return [...current, documentId];
      });
    },
    [],
  );

  const isDeleting = useCallback(
    (documentId: string) => deletingIds.includes(documentId),
    [deletingIds],
  );

  const hasPending = deletingIds.length > 0;

  return { trackDelete, isDeleting, hasPending };
}
