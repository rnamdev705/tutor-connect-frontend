import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses = {
  sm: { avatar: "h-8 w-8", fallback: "text-xs font-medium" },
  md: { avatar: "h-10 w-10", fallback: "text-sm font-medium" },
  lg: { avatar: "h-12 w-12", fallback: "text-base font-semibold" },
  xl: { avatar: "h-20 w-20", fallback: "text-3xl font-semibold tracking-tight" },
};

export function UserAvatar({ name, size = "md", className }: UserAvatarProps) {
  const sizes = sizeClasses[size];

  return (
    <Avatar className={cn(sizes.avatar, className)}>
      <AvatarFallback
        className={cn(
          "bg-neutral-100 text-neutral-700",
          sizes.fallback,
        )}
      >
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>
  );
}
