"use client";

import { useCallback, useEffect, useState } from "react";

export interface PendingCaseInvite {
  id: string;
  caseId: string;
  caseTitle: string;
}

export interface PendingTutorInvite {
  id: string;
  tutorProfileId: string;
  tutorName: string;
}

type Listener = () => void;

const globalPendingTutorsByCase = new Map<string, PendingTutorInvite[]>();
const listeners = new Set<Listener>();

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

function addPendingTutorInvite(caseId: string, invite: PendingTutorInvite) {
  globalPendingTutorsByCase.set(caseId, [
    ...(globalPendingTutorsByCase.get(caseId) ?? []),
    invite,
  ]);
  notifyListeners();
}

function removePendingTutorInvite(caseId: string, id: string) {
  globalPendingTutorsByCase.set(
    caseId,
    (globalPendingTutorsByCase.get(caseId) ?? []).filter((item) => item.id !== id),
  );
  notifyListeners();
}

/** Tracks inviting a tutor to a case (case detail → tutor picker). */
export function usePendingTutorInvites(caseId?: string) {
  const [, rerender] = useState(0);

  useEffect(() => {
    if (!caseId) return;
    const listener = () => rerender((n) => n + 1);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, [caseId]);

  const pendingInvites = caseId
    ? (globalPendingTutorsByCase.get(caseId) ?? [])
    : [];

  const trackInvite = useCallback(
    (
      tutorProfileId: string,
      tutorName: string,
      invite: () => Promise<unknown>,
    ) => {
      if (!caseId) return;

      const id = crypto.randomUUID();
      addPendingTutorInvite(caseId, { id, tutorProfileId, tutorName });
      void invite().finally(() => removePendingTutorInvite(caseId, id));
    },
    [caseId],
  );

  return { pendingInvites, trackInvite };
}

/** Tracks inviting a tutor to a case from the tutor profile page. */
export function usePendingCaseInvites() {
  const [pendingInvites, setPendingInvites] = useState<PendingCaseInvite[]>([]);

  const trackInvite = useCallback(
    (caseId: string, caseTitle: string, invite: () => Promise<unknown>) => {
      const id = crypto.randomUUID();
      setPendingInvites((current) => [...current, { id, caseId, caseTitle }]);
      void invite().finally(() => {
        setPendingInvites((current) => current.filter((item) => item.id !== id));
      });
    },
    [],
  );

  const isInvitingToCase = useCallback(
    (caseId: string) => pendingInvites.some((item) => item.caseId === caseId),
    [pendingInvites],
  );

  return { pendingInvites, trackInvite, isInvitingToCase };
}
