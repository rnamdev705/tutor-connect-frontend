"use client";

import { Crown } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTutorSubscribe } from "@/lib/hooks/use-tutor-subscribe";

interface SubscribeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  responseLimit?: number;
}

export function SubscribeModal({
  open,
  onOpenChange,
  responseLimit = 3,
}: SubscribeModalProps) {
  const { subscribe, isSubscribing } = useTutorSubscribe();

  const handleSubscribe = async () => {
    await subscribe();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-amber-500" />
            TutorConnect Pro
          </DialogTitle>
          <DialogDescription>
            Unlock unlimited accept and decline actions on case invitations.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border bg-muted/40 p-4">
          <p className="text-2xl font-semibold">£9.99 / month</p>
          <p className="mt-1 text-sm text-muted-foreground">Billed monthly</p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>Unlimited case responses</li>
            <li>Free plan includes {responseLimit} accept or decline actions</li>
            <li>Cancel anytime from your profile</li>
          </ul>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubscribing}>
            Not now
          </Button>
          <Button onClick={handleSubscribe} disabled={isSubscribing}>
            {isSubscribing ? "Subscribing..." : "Subscribe"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
