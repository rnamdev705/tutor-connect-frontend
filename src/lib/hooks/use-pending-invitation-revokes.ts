"use client";

import { useCallback, useEffect, useState } from "react";

export interface PendingInvitationRevoke {
  id: string;
  tutorUserId: string;
  tutorName: string;
}

type Listener = () => void;

const globalPendingRevokesByCase = new Map<string, PendingInvitationRevoke[]>();
const listeners = new Set<Listener>();

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

function addPendingRevoke(caseId: string, revoke: PendingInvitationRevoke) {
  globalPendingRevokesByCase.set(caseId, [
    ...(globalPendingRevokesByCase.get(caseId) ?? []),
    revoke,
  ]);
  notifyListeners();
}

function removePendingRevoke(caseId: string, id: string) {
  globalPendingRevokesByCase.set(
    caseId,
    (globalPendingRevokesByCase.get(caseId) ?? []).filter((item) => item.id !== id),
  );
  notifyListeners();
}

/** Tracks removing a tutor invitation from a case. */
export function usePendingInvitationRevokes(caseId?: string) {
  const [, rerender] = useState(0);

  useEffect(() => {
    if (!caseId) return;
    const listener = () => rerender((n) => n + 1);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, [caseId]);

  const pendingRevokes = caseId
    ? (globalPendingRevokesByCase.get(caseId) ?? [])
    : [];

  const trackRevoke = useCallback(
    (
      tutorUserId: string,
      tutorName: string,
      revoke: () => Promise<unknown>,
    ) => {
      if (!caseId) return;

      const existing = globalPendingRevokesByCase.get(caseId) ?? [];
      if (existing.some((item) => item.tutorUserId === tutorUserId)) {
        return;
      }

      const id = crypto.randomUUID();
      addPendingRevoke(caseId, { id, tutorUserId, tutorName });
      void revoke().finally(() => removePendingRevoke(caseId, id));
    },
    [caseId],
  );

  const isRevoking = useCallback(
    (tutorUserId: string) =>
      pendingRevokes.some((item) => item.tutorUserId === tutorUserId),
    [pendingRevokes],
  );

  const hasPending = pendingRevokes.length > 0;

  return { pendingRevokes, trackRevoke, isRevoking, hasPending };
}
