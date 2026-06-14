"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { LogOut, Search, User } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { UserAvatar } from "@/components/common/user-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AppTopNav() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [search, setSearch] = useState("");

  if (!user) return null;

  const roleLabel = user.role === "parent" ? "Parent" : "Tutor";

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = search.trim();
    if (!query) return;

    const params = new URLSearchParams({ search: query });
    if (user.role === "parent") {
      router.push(`/cases?${params.toString()}`);
      return;
    }

    router.push(`/invitations?${params.toString()}`);
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <form className="relative w-full max-w-md" onSubmit={handleSearchSubmit}>
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={user.role === "parent" ? "Search cases..." : "Search invitations..."}
          className="h-9 bg-muted/50 pl-9"
        />
      </form>

      <div className="ml-auto flex shrink-0 items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger
            type="button"
            className="flex items-center gap-3 rounded-lg px-2 py-1.5 outline-none transition-colors hover:bg-muted"
          >
            <UserAvatar name={user.name} size="md" />
            <div className="hidden text-left md:block">
              <p className="text-sm font-medium leading-none">{user.name}</p>
              <Badge variant="secondary" className="mt-1 text-[10px] font-normal">
                {roleLabel}
              </Badge>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel>
              <div className="flex flex-col gap-1">
                <span>{user.name}</span>
                <span className="text-xs font-normal text-muted-foreground">
                  {user.email}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/profile")}>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={async () => {
                await logout();
                router.push("/login");
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
