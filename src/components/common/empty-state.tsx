"use client";

import Link from "next/link";
import { If, Then, Else } from "react-if";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  actionHref?: string;
  variant?: "default" | "compact";
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  actionHref,
  variant = "default",
  className,
}: EmptyStateProps) {
  const isCompact = variant === "compact";
  const showAction = Boolean(actionLabel && (onAction || actionHref));

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        isCompact
          ? "px-4 py-8"
          : "rounded-xl border border-dashed bg-muted/30 px-6 py-16",
        className,
      )}
    >
      <div
        className={cn(
          "mb-4 flex items-center justify-center rounded-full bg-muted",
          isCompact ? "h-10 w-10" : "h-14 w-14",
        )}
      >
        <Icon
          className={cn(
            "text-muted-foreground",
            isCompact ? "h-5 w-5" : "h-7 w-7",
          )}
        />
      </div>
      <h3
        className={cn(
          "font-semibold text-foreground",
          isCompact ? "text-sm" : "text-lg",
        )}
      >
        {title}
      </h3>
      <p
        className={cn(
          "mt-2 max-w-sm text-muted-foreground",
          isCompact ? "text-xs" : "text-sm",
        )}
      >
        {description}
      </p>
      <If condition={showAction}>
        <Then>
          <If condition={Boolean(actionHref)}>
            <Then>
              <Button className="mt-6" size={isCompact ? "sm" : "default"} asChild>
                <Link href={actionHref!}>{actionLabel}</Link>
              </Button>
            </Then>
            <Else>
              <Button
                className="mt-6"
                size={isCompact ? "sm" : "default"}
                onClick={onAction}
              >
                {actionLabel}
              </Button>
            </Else>
          </If>
        </Then>
      </If>
    </div>
  );
}
