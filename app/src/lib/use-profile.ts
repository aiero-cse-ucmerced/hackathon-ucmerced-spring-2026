"use client";

import { useCallback, useEffect, useState } from "react";
import { getProfile, patchProfile, type UserProfile } from "@/lib/internships-api";
import { getStoredToken } from "@/lib/auth";

/**
 * Profile hook backed by internships-api (same store as onboarding and profile page).
 * Returns profile from getProfile() and save() that calls patchProfile().
 */
export type Profile = UserProfile;

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const token = getStoredToken();
    const p = await getProfile(token ?? undefined);
    setProfile(p);
    return p;
  }, []);

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, [load]);

  function save(next: Partial<UserProfile>) {
    const token = getStoredToken();
    patchProfile(next, token ?? undefined).then((updated) => {
      setProfile(updated);
    });
  }

  return { profile, save, loading };
}
