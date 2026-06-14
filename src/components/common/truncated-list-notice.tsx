import { MAX_FETCH_LIMIT } from "@/lib/pagination";

interface TruncatedListNoticeProps {
  count: number;
}

export function TruncatedListNotice({ count }: TruncatedListNoticeProps) {
  if (count < MAX_FETCH_LIMIT) {
    return null;
  }

  return (
    <p className="text-sm text-muted-foreground">
      Showing the first {MAX_FETCH_LIMIT} items. Refine your filters to narrow results.
    </p>
  );
}
