"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Briefcase,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  LayoutDashboard,
  Mail,
  User,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { APP_NAME } from "@/lib/constants";
import { useAuth } from "@/lib/auth-context";
import { useCurrentTutor } from "@/lib/hooks/use-current-tutor";
import { isTutorProfileComplete } from "@/lib/tutor-profile-completion";
import { Button } from "@/components/ui/button";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const parentNav: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "My Cases", href: "/cases", icon: Briefcase },
  { label: "Tutor Directory", href: "/tutors", icon: Users },
  { label: "Profile", href: "/profile", icon: User },
];

const tutorNav: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Invited Cases", href: "/invitations", icon: Mail },
  { label: "My Profile", href: "/profile", icon: User },
];

const tutorSetupNav: NavItem[] = [
  { label: "Complete Profile", href: "/profile/edit", icon: User },
];

interface AppSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function AppSidebar({ collapsed, onToggle }: AppSidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const { tutor, isLoading: tutorLoading } = useCurrentTutor();

  const tutorNeedsSetup =
    user?.role === "tutor" &&
    !tutorLoading &&
    !isTutorProfileComplete(tutor, user);

  const navItems = tutorNeedsSetup
    ? tutorSetupNav
    : user?.role === "tutor"
      ? tutorNav
      : parentNav;

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-30 flex flex-col border-r bg-sidebar transition-all duration-300",
        collapsed ? "w-[68px]" : "w-60",
      )}
    >
      <div className="flex h-16 items-center border-b px-4">
        <Link href="/dashboard" className="flex items-center gap-2.5 overflow-hidden">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <GraduationCap className="h-4 w-4" />
          </div>
          {!collapsed && (
            <span className="truncate text-sm font-semibold tracking-tight">
              {APP_NAME}
            </span>
          )}
        </Link>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          const Icon = item.icon;

          const link = (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground",
                collapsed && "justify-center px-2",
              )}
            >
              <Icon className="h-[18px] w-[18px] shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );

          return link;
        })}
      </nav>

      <div className="border-t p-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className={cn("w-full text-muted-foreground", collapsed && "px-2")}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4" />
              <span className="ml-2">Collapse</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  );
}
