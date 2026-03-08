"use client";

import { useState, useMemo } from "react";
import { ViewTransitionLink } from "@/components/ViewTransitionLink";
import { Logo } from "@/components/Logo";
import { md5 } from "@/lib/md5";
import { Avatar, DEFAULT_AVATAR_IMAGE } from "@/components/ui/avatar";
import { useAuth } from "@/components/AuthProvider";

function getGravatarUrl(email: string): string {
  const hash = md5(email.trim().toLowerCase());
  return `https://www.gravatar.com/avatar/${hash}?d=404&s=80`;
}

export function LandingHeader() {
  const [imageError, setImageError] = useState(false);
  const { user, loading } = useAuth();

  const avatarSrc = useMemo(() => {
    if (!user) return DEFAULT_AVATAR_IMAGE;
    if (imageError) return DEFAULT_AVATAR_IMAGE;
    if (user.avatarUrl) return user.avatarUrl;
    if (user.email) return getGravatarUrl(user.email);
    return DEFAULT_AVATAR_IMAGE;
  }, [user, imageError]);

  return (
    <header className="border-b border-zinc-100/80 bg-white/95 px-6 py-5 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <Logo />
        <nav className="flex items-center gap-4">
          {!loading && user && (
            <ViewTransitionLink
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
            </ViewTransitionLink>
          )}
        </nav>
      </div>
    </header>
  );
}
