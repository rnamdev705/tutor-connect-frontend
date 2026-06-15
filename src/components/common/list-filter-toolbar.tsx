"use client";

import { useEffect, useState } from "react";
import { SearchInput } from "@/components/common/search-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ListFilterToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  children?: React.ReactNode;
}

export function ListFilterToolbar({
  search,
  onSearchChange,
  searchPlaceholder = "Search...",
  children,
}: ListFilterToolbarProps) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row">
      <SearchInput
        value={search}
        onChange={onSearchChange}
        placeholder={searchPlaceholder}
      />
      {children}
    </div>
  );
}

interface FilterSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder: string;
  className?: string;
  items: Array<{ value: string; label: string }>;
}

export function FilterSelect({
  value,
  onValueChange,
  placeholder,
  className = "w-full sm:w-40",
  items,
}: FilterSelectProps) {
  return (
    <Select
      value={value}
      onValueChange={(next) => {
        if (next) onValueChange(next);
      }}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {items.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

/** Debounces text input before triggering server-side search. */
export function useDebouncedValue<T>(value: T, delayMs = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delayMs);
    return () => window.clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}
