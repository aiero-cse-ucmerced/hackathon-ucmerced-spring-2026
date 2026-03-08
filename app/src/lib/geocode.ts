/**
 * OpenStreetMap Nominatim – geocode and reverse geocode for social networking location preview.
 * Uses Worker proxy when configured (KV cache), else Next.js API route. Both avoid CORS.
 */

import { env } from "./env";

export interface GeocodeResult {
  place_id: number;
  lat: string;
  lon: string;
  display_name: string;
  type?: string;
  class?: string;
}

export interface ReverseGeocodeResult {
  place_id: number;
  lat: string;
  lon: string;
  display_name: string;
  address?: Record<string, string>;
}

function buildGeocodeUrl(mode: "search" | "reverse", params: Record<string, string>): string {
  const base = env.useWorkersApi ? env.workersApiUrl : "";
  const search = new URLSearchParams(params).toString();
  return base
    ? `${base}/api/geocode?${search}`
    : `/api/geocode?${search}`;
}

/**
 * Geocode: address/city/ZIP → lat, lon, display_name.
 */
export async function geocode(query: string): Promise<GeocodeResult[]> {
  const url = buildGeocodeUrl("search", { q: query });
  const headers: Record<string, string> = {};
  if (env.apiKey) headers["X-API-Key"] = env.apiKey;
  const res = await fetch(url, { headers });
  if (!res.ok) {
    const err = (await res.json()).catch(() => ({})) as { error?: string };
    throw new Error(err.error ?? "Geocode failed");
  }
  const data = (await res.json()) as GeocodeResult[];
  return Array.isArray(data) ? data : [];
}

/**
 * Reverse geocode: lat, lon → display name / address for preview.
 */
export async function reverseGeocode(lat: number, lon: number): Promise<ReverseGeocodeResult | null> {
  const url = buildGeocodeUrl("reverse", { lat: String(lat), lon: String(lon) });
  const headers: Record<string, string> = {};
  if (env.apiKey) headers["X-API-Key"] = env.apiKey;
  const res = await fetch(url, { headers });
  if (!res.ok) return null;
  const data = (await res.json()) as ReverseGeocodeResult;
  return data;
}
