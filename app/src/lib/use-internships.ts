"use client";

import { useEffect, useState } from "react";
import type { InternshipKind, MatchedListing } from "./internships-api";
import { fetchInternships } from "./internships-api";
import { useOnlineStatus } from "./use-online-status";

export function useInternships(options: {
  kind: InternshipKind;
  interests: string[];
  major?: string;
  strengths?: string[];
  minScore: number;
}) {
  const { online } = useOnlineStatus();
  const [items, setItems] = useState<MatchedListing[]>([]);
  const [loading, setLoading] = useState(true);

  const interestsKey = options.interests.slice().sort().join(",");
  const strengthsKey = (options.strengths ?? []).slice().sort().join(",");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      const [page0, page1] = await Promise.all([
        fetchInternships({
          type: options.kind,
          interests: options.interests,
          major: options.major,
          minScore: options.minScore,
          strengths: options.strengths ?? [],
          page: 0,
        }),
        fetchInternships({
          type: options.kind,
          interests: options.interests,
          major: options.major,
          minScore: options.minScore,
          strengths: options.strengths ?? [],
          page: 1,
        }),
      ]);
      if (cancelled) return;
      const seen = new Set<string>();
      const merged: MatchedListing[] = [];
      for (const item of [...page0.items, ...page1.items]) {
        if (!seen.has(item.id)) {
          seen.add(item.id);
          merged.push(item);
        }
      }
      merged.sort((a, b) => b.score - a.score);
      setItems(merged);
      setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [online, options.kind, interestsKey, strengthsKey, options.major, options.minScore]);

  return { items, loading, online };
}

