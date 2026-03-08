"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  getProfile,
  patchProfile,
  syncProfileWhenOnline,
  type UserProfile,
} from "@/lib/internships-api";
import { getStoredToken } from "@/lib/auth";
import { useOnlineStatus } from "@/lib/use-online-status";

/**
 * Profile hook backed by internships-api. Offline-first: saves to localStorage immediately,
 * syncs to API when online. Refreshes from API when coming back online.
 */
export type Profile = UserProfile;

export function useProfile() {
  const { online } = useOnlineStatus();
  const wasOffline = useRef(false);
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

  useEffect(() => {
    if (!online) {
      wasOffline.current = true;
      return;
    }
    if (!wasOffline.current) return;
    wasOffline.current = false;
    const token = getStoredToken();
    syncProfileWhenOnline(token ?? undefined, (p) => {
      setProfile(p);
    });
  }, [online]);

  function save(next: Partial<UserProfile>) {
    const token = getStoredToken();
    patchProfile(next, token ?? undefined).then((updated) => {
      setProfile(updated);
    });
  }

  return { profile, save, loading };
}
