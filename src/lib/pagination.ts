export const PREVIEW_LIMIT = 3;
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_FETCH_LIMIT = 100;

export function matchesText(value: string | null | undefined, query: string) {
  if (!query.trim()) return true;
  return (value ?? "").toLowerCase().includes(query.trim().toLowerCase());
}

export function matchesTextInList(items: string[], query: string) {
  if (!query.trim()) return true;
  const normalized = query.trim().toLowerCase();
  return items.some((item) => item.toLowerCase().includes(normalized));
}

export function paginateItems<T>(items: T[], page: number, pageSize: number) {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;

  return {
    items: items.slice(start, start + pageSize),
    page: safePage,
    total,
    totalPages,
  };
}

export function paginationRange(page: number, totalPages: number) {
  const safeTotalPages = Math.max(1, totalPages);
  const pages: number[] = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(safeTotalPages, page + 2);

  for (let i = start; i <= end; i += 1) {
    pages.push(i);
  }

  return pages;
}

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export function resolvePaginationMeta(
  meta: PaginationMeta | undefined,
  page: number,
  pageSize = DEFAULT_PAGE_SIZE,
): PaginationMeta {
  return {
    page: meta?.page ?? page,
    limit: meta?.limit ?? pageSize,
    total: meta?.total ?? 0,
    totalPages: Math.max(1, meta?.totalPages ?? 1),
  };
}
