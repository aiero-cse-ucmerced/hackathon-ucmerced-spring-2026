"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { md5 } from "js-md5";
import { Logo } from "@/components/Logo";
import { Avatar } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";

function getGravatarUrl(email: string): string {
  const hash = md5(email.trim().toLowerCase());
  return `https://www.gravatar.com/avatar/${hash}?d=404&s=80`;
}

export function LandingHeader() {
  const [imageError, setImageError] = useState(false);
  const { user, isLoggedIn, isLoading } = useAuth();

  const avatarSrc = useMemo(() => {
    if (!user || imageError) return undefined;
    if (user.avatarUrl) return user.avatarUrl;
    if (user.email) return getGravatarUrl(user.email);
    return undefined;
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
                {avatarSrc && (
                  <Avatar.Image
                    src={avatarSrc}
                    alt={user?.name ?? "User"}
                    onError={() => setImageError(true)}
                    className={imageError ? "hidden" : ""}
                  />
                )}
                <Avatar.Fallback
                  className={avatarSrc && !imageError ? "hidden" : ""}
                >
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
