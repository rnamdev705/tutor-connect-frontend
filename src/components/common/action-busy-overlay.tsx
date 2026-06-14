import { Loader2 } from "lucide-react";

interface ActionBusyOverlayProps {
  message: string;
}

/** Blocks interaction on a view while a destructive or long-running action completes. */
export function ActionBusyOverlay({ message }: ActionBusyOverlayProps) {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex items-start justify-center rounded-lg bg-background/70 pt-20">
      <div className="pointer-events-auto flex items-center gap-2 rounded-lg border bg-background px-4 py-3 text-sm shadow-sm">
        <Loader2 className="h-4 w-4 animate-spin" />
        {message}
      </div>
    </div>
  );
}
