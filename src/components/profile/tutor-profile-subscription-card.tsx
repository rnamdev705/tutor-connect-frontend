"use client";

import { useState } from "react";
import Link from "next/link";
import { Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SubscribeModal } from "@/components/modals/subscribe-modal";
import {
  isResponseLimitReached,
  tutorResponseLimitMessage,
  type TutorSubscriptionState,
} from "@/lib/tutor-subscription";

interface TutorProfileSubscriptionCardProps {
  subscription: TutorSubscriptionState;
}

export function TutorProfileSubscriptionCard({
  subscription,
}: TutorProfileSubscriptionCardProps) {
  const [subscribeOpen, setSubscribeOpen] = useState(false);
  const { responsesUsed, responseLimit, subscribed } = subscription;
  const atLimit = isResponseLimitReached(subscription);

  return (
    <>
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3 space-y-0">
          <div>
            <CardTitle className="text-base">Subscription</CardTitle>
            <CardDescription>
              Manage your plan and case response allowance.
            </CardDescription>
          </div>
          {subscribed ? (
            <Badge className="shrink-0 bg-amber-100 text-amber-900 hover:bg-amber-100">
              <Crown className="mr-1 h-3 w-3" />
              TutorConnect Pro
            </Badge>
          ) : (
            <Badge variant="secondary" className="shrink-0">
              Free plan
            </Badge>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {subscribed ? (
            <p className="text-sm text-muted-foreground">
              You have unlimited accept and decline actions on case invitations.
            </p>
          ) : (
            <>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                  {responsesUsed} / {responseLimit} used
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {tutorResponseLimitMessage(subscription)}
              </p>
              <div className="h-1.5 max-w-md overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full rounded-full transition-all ${
                    atLimit ? "bg-amber-500" : "bg-primary"
                  }`}
                  style={{
                    width: `${Math.min(100, (responsesUsed / responseLimit) * 100)}%`,
                  }}
                />
              </div>
              <Button onClick={() => setSubscribeOpen(true)}>
                <Crown className="mr-2 h-4 w-4" />
                Subscribe to Pro
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      <SubscribeModal
        open={subscribeOpen}
        onOpenChange={setSubscribeOpen}
        responseLimit={responseLimit}
      />
    </>
  );
}

interface TutorSubscribeProfileLinkProps {
  className?: string;
}

/** Shown when tutors hit the free response limit outside the profile page. */
export function TutorSubscribeProfileLink({ className }: TutorSubscribeProfileLinkProps) {
  return (
    <Button size="sm" variant="outline" className={className} asChild>
      <Link href="/profile">Subscribe in profile</Link>
    </Button>
  );
}
