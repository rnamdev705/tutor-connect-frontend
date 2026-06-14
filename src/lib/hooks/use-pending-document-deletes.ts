"use client";

import { useCallback, useState } from "react";

export function usePendingDocumentDeletes() {
  const [deletingIds, setDeletingIds] = useState<string[]>([]);

  const trackDelete = useCallback(
    (documentId: string, deleteFn: () => Promise<unknown>) => {
      setDeletingIds((current) =>
        current.includes(documentId) ? current : [...current, documentId],
      );
      void deleteFn().finally(() => {
        setDeletingIds((current) => current.filter((id) => id !== documentId));
      });
    },
    [],
  );

  const isDeleting = useCallback(
    (documentId: string) => deletingIds.includes(documentId),
    [deletingIds],
  );

  return { trackDelete, isDeleting };
}
