/** Shared Tailwind classes for overflow-safe UI text. */
export const textOverflow = {
  pageTitle: "min-w-0 truncate text-2xl font-semibold tracking-tight",
  pageSubtitle: "mt-1 break-words text-sm text-muted-foreground",
  tableTitle:
    "max-w-[11rem] truncate font-medium sm:max-w-[14rem] lg:max-w-[18rem]",
  tableMuted:
    "max-w-[5.5rem] truncate text-muted-foreground sm:max-w-[7rem] lg:max-w-[9rem]",
  tableMeta: "max-w-[8rem] truncate text-muted-foreground",
  detailLabel: "text-xs font-medium text-muted-foreground",
  detailValue: "mt-1 break-words text-sm font-medium",
  prose: "break-words text-sm leading-relaxed text-muted-foreground",
  listItem: "break-words text-sm",
  navName: "max-w-[10rem] truncate text-sm font-medium leading-none",
  navEmail: "truncate text-xs font-normal text-muted-foreground",
  cardName: "truncate font-semibold leading-tight",
  statusMessage: "max-w-[220px] line-clamp-2 break-words text-xs text-muted-foreground",
  fileName: "max-w-[12rem] truncate font-medium sm:max-w-[16rem] lg:max-w-[20rem]",
} as const;
