"use client";

import { useEffect, useState } from "react";
import type { InternshipKind, MatchedListing } from "@/app/api/internships/route";
import { fetchInternships } from "./internships-api";
import { useOnlineStatus } from "./use-online-status";

export function useInternships(options: {
  kind: InternshipKind;
  interests: string[];
  major?: string;
  minScore: number;
}) {
  const { online } = useOnlineStatus();
  const [items, setItems] = useState<MatchedListing[]>([]);
  const [loading, setLoading] = useState(true);

  const interestsKey = options.interests.slice().sort().join(",");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!online) {
        setLoading(false);
        return;
      }

      setLoading(true);
      const { items: next } = await fetchInternships({
        type: options.kind,
        interests: options.interests,
        major: options.major,
        minScore: options.minScore,
      });
      if (!cancelled) {
        setItems(next);
        setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [online, options.kind, interestsKey, options.major, options.minScore]);

  return { items, loading, online };
}

