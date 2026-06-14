"use client";

import { useCallback, useEffect, useState } from "react";

export type InvitationResponseAction = "accept" | "decline";

type Listener = () => void;

const globalPendingByInvitation = new Map<string, InvitationResponseAction>();
const listeners = new Set<Listener>();

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

/** Tracks accept/decline in flight for a tutor invitation (per invitation id). */
export function usePendingInvitationResponses() {
  const [, rerender] = useState(0);

  useEffect(() => {
    const listener = () => rerender((n) => n + 1);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const trackResponse = useCallback(
    (
      invitationId: string,
      action: InvitationResponseAction,
      respond: () => Promise<unknown>,
    ) => {
      if (globalPendingByInvitation.has(invitationId)) {
        return;
      }

      globalPendingByInvitation.set(invitationId, action);
      notifyListeners();

      void respond().finally(() => {
        globalPendingByInvitation.delete(invitationId);
        notifyListeners();
      });
    },
    [],
  );

  const isResponding = useCallback(
    (invitationId: string) => globalPendingByInvitation.has(invitationId),
    [],
  );

  const getResponseAction = useCallback(
    (invitationId: string) => globalPendingByInvitation.get(invitationId),
    [],
  );

  const hasPending = globalPendingByInvitation.size > 0;

  return { trackResponse, isResponding, getResponseAction, hasPending };
}
