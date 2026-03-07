"use client";

import { useEffect, useState } from "react";
import { getProfile } from "@/lib/internships-api";
import {
  getStoredUser,
  getStoredToken,
  type AuthUser,
} from "@/lib/auth";

const PROFILE_KEY = "uncookedaura_profile";

export interface UseAuthResult {
  user: AuthUser | null;
  isLoggedIn: boolean;
  isLoading: boolean;
}

function getStoredProfile(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as { email?: string; name?: string; avatarUrl?: string };
    if (!data?.email) return null;
    return {
      email: data.email,
      name: data.name,
      avatarUrl: data.avatarUrl ?? null,
    };
  } catch {
    return null;
  }
}

export function useAuth(): UseAuthResult {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = getStoredUser();
    if (stored) {
      setUser(stored);
      setIsLoading(false);
      return;
    }

    const token = getStoredToken();
    if (token) {
      getProfile(token)
        .then((profile) => {
          if (profile?.email) {
            setUser({
              email: profile.email,
              name: profile.name,
              avatarUrl: profile.avatarUrl ?? null,
            });
          } else {
            setUser(getStoredProfile());
          }
          setIsLoading(false);
        })
        .catch(() => {
          setUser(getStoredProfile());
          setIsLoading(false);
        });
      return;
    }

    setUser(getStoredProfile());
    setIsLoading(false);
  }, []);

  return {
    user,
    isLoggedIn: !!user || !!getStoredToken(),
    isLoading,
  };
}
