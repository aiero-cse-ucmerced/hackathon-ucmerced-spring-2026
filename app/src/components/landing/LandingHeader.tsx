"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { md5 } from "@/lib/md5";
import { Avatar, DEFAULT_AVATAR_IMAGE } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";

function getGravatarUrl(email: string): string {
  const hash = md5(email.trim().toLowerCase());
  return `https://www.gravatar.com/avatar/${hash}?d=404&s=80`;
}

export function LandingHeader() {
  const [imageError, setImageError] = useState(false);
  const { user, isLoggedIn, isLoading } = useAuth();

  const avatarSrc = useMemo(() => {
    if (!user) return DEFAULT_AVATAR_IMAGE;
    if (imageError) return DEFAULT_AVATAR_IMAGE;
    if (user.avatarUrl) return user.avatarUrl;
    if (user.email) return getGravatarUrl(user.email);
    return DEFAULT_AVATAR_IMAGE;
  }, [user, imageError]);

  return (
    <header className="bg-white px-6 pt-8">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <Logo />
        <nav className="flex items-center gap-4">
          {!isLoading && isLoggedIn && (
            <Link
              href="/settings"
              className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2"
              aria-label="Account settings"
            >
              <Avatar size="default" className="ring-1 ring-zinc-200">
                <Avatar.Image
                  src={avatarSrc}
                  alt={user?.name ?? "User"}
                  onError={() => setImageError(true)}
                />
                <Avatar.Fallback>
                  <Avatar.UserIcon />
                </Avatar.Fallback>
              </Avatar>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
