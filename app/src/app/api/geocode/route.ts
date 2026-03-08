/**
 * Nominatim geocode proxy. Avoids CORS when frontend calls from browser.
 * Use ?q=... for forward geocode, ?lat=&lng= for reverse geocode.
 */

import { NextResponse } from "next/server";

const NOMINATIM_BASE = "https://nominatim.openstreetmap.org";
const USER_AGENT = "UncookedAura/1.0 (https://github.com/uncookedaura; contact@example.com)";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lon") ?? searchParams.get("lng");

  if (q) {
    const url = `${NOMINATIM_BASE}/search?format=json&q=${encodeURIComponent(q)}&limit=5`;
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": USER_AGENT },
      });
      if (!res.ok) {
        return NextResponse.json(
          { error: "Geocode failed" },
          { status: res.status }
        );
      }
      const data = await res.json();
      return NextResponse.json(data);
    } catch (e) {
      console.warn("[UncookedAura] Geocode proxy error:", e);
      return NextResponse.json(
        { error: "Geocode failed" },
        { status: 502 }
      );
    }
  }

  if (lat != null && lng != null) {
    const url = `${NOMINATIM_BASE}/reverse?format=json&lat=${lat}&lon=${lng}`;
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": USER_AGENT },
      });
      if (!res.ok) {
        return NextResponse.json(
          { error: "Reverse geocode failed" },
          { status: res.status }
        );
      }
      const data = await res.json();
      return NextResponse.json(data);
    } catch (e) {
      console.warn("[UncookedAura] Reverse geocode proxy error:", e);
      return NextResponse.json(
        { error: "Reverse geocode failed" },
        { status: 502 }
      );
    }
  }

  return NextResponse.json(
    { error: "Missing q or lat/lng" },
    { status: 400 }
  );
}
