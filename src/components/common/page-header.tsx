import { cn } from "@/lib/utils";
import { textOverflow } from "@/lib/text-overflow";

interface PageHeaderProps {
  title: string;
  description?: string;
  count?: number;
  children?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  count,
  children,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between",
        className,
      )}
    >
      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 items-center gap-3">
          <h1 className={cn(textOverflow.pageTitle, "text-foreground")}>{title}</h1>
          {count !== undefined && (
            <span className="shrink-0 rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
              {count}
            </span>
          )}
        </div>
        {description && (
          <p className={textOverflow.pageSubtitle}>{description}</p>
        )}
      </div>
      {children && <div className="flex shrink-0 items-center gap-2">{children}</div>}
    </div>
  );
}
