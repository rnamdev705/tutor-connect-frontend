"use client";

import { useRouter } from "next/navigation";
import { LogOut, User } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useCurrentTutor } from "@/lib/hooks/use-current-tutor";
import { isTutorProfileComplete } from "@/lib/tutor-profile-completion";
import { Badge } from "@/components/ui/badge";
import { UserAvatar } from "@/components/common/user-avatar";
import { textOverflow } from "@/lib/text-overflow";
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
  const { tutor, isLoading: tutorLoading } = useCurrentTutor();

  if (!user) return null;

  const roleLabel = user.role === "parent" ? "Parent" : "Tutor";
  const tutorNeedsSetup =
    user.role === "tutor" &&
    !tutorLoading &&
    !isTutorProfileComplete(tutor, user);

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {tutorNeedsSetup && (
        <p className="text-sm text-muted-foreground">
          Complete your profile to unlock the tutor portal.
        </p>
      )}

      <div className="ml-auto flex shrink-0 items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger
            type="button"
            className="flex items-center gap-3 rounded-lg px-2 py-1.5 outline-none transition-colors hover:bg-muted"
          >
            <UserAvatar name={user.name} size="md" />
            <div className="hidden min-w-0 max-w-[12rem] text-left md:block">
              <p className={textOverflow.navName}>{user.name}</p>
              <Badge variant="secondary" className="mt-1 text-[10px] font-normal">
                {roleLabel}
              </Badge>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel className="min-w-0">
              <div className="flex min-w-0 flex-col gap-1">
                <span className="truncate">{user.name}</span>
                <span className={textOverflow.navEmail}>{user.email}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() =>
                router.push(tutorNeedsSetup ? "/profile/edit" : "/profile")
              }
            >
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
