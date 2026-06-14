"use client";

import { useCallback, useEffect, useState } from "react";

export interface PendingDocumentUpload {
  id: string;
  fileName: string;
  sizeBytes: number;
  mimeType: string;
}

type Listener = () => void;

const globalPendingByCase = new Map<string, PendingDocumentUpload[]>();
const listeners = new Set<Listener>();

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

function addPendingUpload(caseId: string, file: File): string {
  const id = crypto.randomUUID();
  const item: PendingDocumentUpload = {
    id,
    fileName: file.name,
    sizeBytes: file.size,
    mimeType: file.type,
  };
  globalPendingByCase.set(caseId, [...(globalPendingByCase.get(caseId) ?? []), item]);
  notifyListeners();
  return id;
}

function removePendingUpload(caseId: string, id: string) {
  globalPendingByCase.set(
    caseId,
    (globalPendingByCase.get(caseId) ?? []).filter((item) => item.id !== id),
  );
  notifyListeners();
}

function runTrackedUpload(
  caseId: string,
  file: File,
  upload: () => Promise<unknown>,
) {
  const id = addPendingUpload(caseId, file);
  void upload().finally(() => removePendingUpload(caseId, id));
}

/** Starts uploads for a case and tracks them globally (survives navigation to case detail). */
export function enqueueCaseDocumentUploads(
  caseId: string,
  files: File[],
  upload: (file: File) => Promise<unknown>,
) {
  for (const file of files) {
    runTrackedUpload(caseId, file, () => upload(file));
  }
}

export function usePendingDocumentUploads(caseId?: string) {
  const [localPending, setLocalPending] = useState<PendingDocumentUpload[]>([]);
  const [, rerender] = useState(0);

  useEffect(() => {
    if (!caseId) return;
    const listener = () => rerender((n) => n + 1);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, [caseId]);

  const pendingUploads = caseId
    ? (globalPendingByCase.get(caseId) ?? [])
    : localPending;

  const hasPending = pendingUploads.length > 0;

  const trackUpload = useCallback(
    (file: File, upload: () => Promise<unknown>) => {
      if (caseId) {
        runTrackedUpload(caseId, file, upload);
        return;
      }

      const id = crypto.randomUUID();
      setLocalPending((current) => [
        ...current,
        {
          id,
          fileName: file.name,
          sizeBytes: file.size,
          mimeType: file.type,
        },
      ]);

      void upload().finally(() => {
        setLocalPending((current) => current.filter((item) => item.id !== id));
      });
    },
    [caseId],
  );

  return { pendingUploads, trackUpload, hasPending };
}
