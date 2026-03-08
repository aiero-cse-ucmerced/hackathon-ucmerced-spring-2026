"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { Avatar, DEFAULT_AVATAR_IMAGE } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { md5 } from "@/lib/md5";
import { cn } from "@/lib/utils";

function getGravatarUrl(email: string): string {
  const hash = md5(email.trim().toLowerCase());
  return `https://www.gravatar.com/avatar/${hash}?d=404&s=80`;
}

export function UserMenu({
  showName = true,
  className,
}: {
  showName?: boolean;
  className?: string;
}) {
  const [imageError, setImageError] = useState(false);
  const { user, signOut } = useAuth();

  const avatarSrc = useMemo(() => {
    if (!user) return DEFAULT_AVATAR_IMAGE;
    if (imageError) return DEFAULT_AVATAR_IMAGE;
    if (user.avatarUrl) return user.avatarUrl;
    if (user.email) return getGravatarUrl(user.email);
    return DEFAULT_AVATAR_IMAGE;
  }, [user, imageError]);

  if (!user) return null;

  const displayName = user.name || user.email || "User";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex items-center gap-2 rounded-full transition-colors hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2",
            className,
          )}
          aria-label="Open account menu"
        >
          <Avatar size="default" className="ring-1 ring-zinc-200 shrink-0">
            <Avatar.Image
              src={avatarSrc}
              alt={displayName}
              onError={() => setImageError(true)}
            />
            <Avatar.Fallback>
              <Avatar.UserIcon />
            </Avatar.Fallback>
          </Avatar>
          {showName && (
            <span className="max-w-[8rem] truncate text-sm font-medium text-zinc-900">
              {displayName}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem asChild>
          <Link href="/dashboard/profile">My Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings">Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          destructive
          onSelect={() => {
            signOut();
            window.location.href = "/login";
          }}
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
