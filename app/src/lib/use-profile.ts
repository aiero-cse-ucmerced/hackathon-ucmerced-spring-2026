"use client";

import { useEffect, useState } from "react";

export type Profile = {
  name: string;
  major?: string;
  interests: string[];
  outcomes?: string;
  completedIds?: string[];
  savedIds?: string[];
  minScore?: number;
};

const STORAGE_KEY = "uncookedaura:profile";

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setProfile(JSON.parse(stored));
      }
    } catch {
      // Ignore storage errors.
    } finally {
      setLoading(false);
    }
  }, []);

  function save(next: Profile) {
    setProfile(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Ignore storage errors.
    }
  }

  return { profile, save, loading };
}

