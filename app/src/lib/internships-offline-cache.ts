/**
 * Offline cache for matched internships (dashboard view).
 * Caches full listing data including descriptions so users can browse when offline.
 * Only "matched" queries (no keywords/location search) are cached.
 * Searching for other internships requires internet.
 */

import type { MatchedListing } from "./internships-api";

const DB_NAME = "uncookedaura-offline";
const STORE_NAME = "internships";
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("IndexedDB not available"));
      return;
    }
    const req = indexedDB.open(DB_NAME, 1);
    req.onerror = () => reject(req.error);
    req.onsuccess = () => resolve(req.result);
    req.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "key" });
      }
    };
  });
}

export function buildMatchedCacheKey(params: {
  kind: string;
  interests: string[];
  strengths: string[];
  major?: string;
  minScore: number;
  page?: number;
}): string {
  const parts = [
    params.kind,
    params.interests.slice().sort().join(","),
    (params.strengths ?? []).slice().sort().join(","),
    params.major ?? "",
    String(params.minScore),
    String(params.page ?? 0),
  ];
  return parts.join("|");
}

export function isMatchedQuery(params: {
  keywords?: string;
  location?: string;
}): boolean {
  return !params.keywords?.trim() && !params.location?.trim();
}

export async function setMatchedInternshipsCache(
  cacheKey: string,
  items: MatchedListing[],
  kind: string
): Promise<void> {
  if (typeof indexedDB === "undefined") return;
  try {
    const db = await openDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      store.put({
        key: cacheKey,
        items,
        kind,
        fetchedAt: Date.now(),
      });
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    db.close();
  } catch (e) {
    console.warn("[UncookedAura] internships cache write failed:", e);
  }
}

export async function getMatchedInternshipsCache(
  cacheKey: string
): Promise<{ items: MatchedListing[]; kind: string } | null> {
  if (typeof indexedDB === "undefined") return null;
  try {
    const db = await openDb();
    const result = await new Promise<{ items: MatchedListing[]; kind: string; fetchedAt: number } | null>(
      (resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readonly");
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(cacheKey);
        tx.oncomplete = () => resolve(req.result ?? null);
        tx.onerror = () => reject(tx.error);
      }
    );
    db.close();
    if (!result) return null;
    const age = Date.now() - result.fetchedAt;
    if (age > CACHE_TTL_MS) return null; // stale
    return { items: result.items ?? [], kind: result.kind ?? "internship" };
  } catch (e) {
    console.warn("[UncookedAura] internships cache read failed:", e);
    return null;
  }
}
