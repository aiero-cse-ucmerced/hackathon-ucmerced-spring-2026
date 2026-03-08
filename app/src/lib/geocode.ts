/**
 * OpenStreetMap Nominatim – geocode and reverse geocode for social networking location preview.
 * Respect Nominatim usage policy: one request per second, identifiable User-Agent.
 */

const NOMINATIM_BASE = "https://nominatim.openstreetmap.org";
const USER_AGENT = "UncookedAura/1.0 (https://github.com/uncookedaura; contact@example.com)";

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

/**
 * Geocode: address/city/ZIP → lat, lon, display_name.
 */
export async function geocode(query: string): Promise<GeocodeResult[]> {
  const url = `${NOMINATIM_BASE}/search?format=json&q=${encodeURIComponent(query)}&limit=5`;
  const res = await fetch(url, {
    headers: { "User-Agent": USER_AGENT },
  });
  if (!res.ok) throw new Error("Geocode failed");
  const data = (await res.json()) as GeocodeResult[];
  return data;
}

/**
 * Reverse geocode: lat, lon → display name / address for preview.
 */
export async function reverseGeocode(lat: number, lon: number): Promise<ReverseGeocodeResult | null> {
  const url = `${NOMINATIM_BASE}/reverse?format=json&lat=${lat}&lon=${lon}`;
  const res = await fetch(url, {
    headers: { "User-Agent": USER_AGENT },
  });
  if (!res.ok) return null;
  const data = (await res.json()) as ReverseGeocodeResult;
  return data;
}
