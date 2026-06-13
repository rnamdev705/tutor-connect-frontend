import Link from "next/link";
import { AlertCircle, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  title?: string;
  message?: string;
  icon?: LucideIcon;
  actionLabel?: string;
  actionHref?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  message = "We couldn't load this content. Please try again.",
  icon: Icon = AlertCircle,
  actionLabel = "Try again",
  actionHref,
  onRetry,
  className,
}: ErrorStateProps) {
  const showAction = onRetry || actionHref;

  return (
    <Card className={cn("border-destructive/20 shadow-sm", className)}>
      <CardContent className="flex flex-col items-center py-12 text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
          <Icon className="h-6 w-6 text-destructive" />
        </div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">{message}</p>
        {showAction &&
          (actionHref ? (
            <Button variant="outline" className="mt-6" asChild>
              <Link href={actionHref}>{actionLabel}</Link>
            </Button>
          ) : (
            <Button variant="outline" className="mt-6" onClick={onRetry}>
              {actionLabel}
            </Button>
          ))}
      </CardContent>
    </Card>
  );
}
