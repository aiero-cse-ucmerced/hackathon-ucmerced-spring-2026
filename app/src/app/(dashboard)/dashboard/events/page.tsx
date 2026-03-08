"use client";

import { useCallback, useEffect, useState } from "react";
import { useProfile } from "@/lib/use-profile";
import { geocode, reverseGeocode } from "@/lib/geocode";
import { env } from "@/lib/env";

type SocialEvent = {
  id?: string;
  name?: { text?: string };
  description?: { text?: string };
  start?: { local?: string };
  end?: { local?: string };
  venue?: { address?: { localized_address_display?: string }; name?: string };
  url?: string;
};

export default function EventsPage() {
  const { profile } = useProfile();
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [addressPreview, setAddressPreview] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [events, setEvents] = useState<SocialEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const age = profile?.age ?? undefined;
  const radius = 25;

  const loadEvents = useCallback(async () => {
    const latitude = lat ?? 37.7749;
    const longitude = lng ?? -122.4194;
    if (!env.workersApiUrl) {
      setEvents([]);
      setError(
        "Events API not configured. Set NEXT_PUBLIC_CF_WORKERS_API_URL in your .env (or Pages/Workers env) to your Worker base URL, e.g. https://your-worker.workers.dev"
      );
      return;
    }
    setLoadingEvents(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        lat: String(latitude),
        lng: String(longitude),
        radius: String(radius),
      });
      if (age != null) params.set("age", String(age));
      const res = await fetch(`${env.workersApiUrl}/api/social-events?${params.toString()}`, {
        headers: env.apiKey ? { "X-API-Key": env.apiKey } : {},
      });
      if (!res.ok) {
        const errText = await res.text();
        setError(`Events API error (${res.status}): ${errText || res.statusText}`);
        setEvents([]);
        return;
      }
      const data = (await res.json()) as { events?: SocialEvent[] };
      setEvents(data.events ?? []);
    } catch (e) {
      setError("Failed to load events.");
      setEvents([]);
    } finally {
      setLoadingEvents(false);
    }
  }, [lat, lng, age]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const handleUseMyLocation = useCallback(() => {
    setLoading(true);
    setError(null);
    if (!navigator.geolocation) {
      setError("Geolocation not supported.");
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const latitude = pos.coords.latitude;
        const longitude = pos.coords.longitude;
        setLat(latitude);
        setLng(longitude);
        try {
          const result = await reverseGeocode(latitude, longitude);
          setAddressPreview(result?.display_name ?? `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        } catch {
          setAddressPreview(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        }
        setLoading(false);
      },
      () => {
        setError("Could not get location.");
        setLoading(false);
      }
    );
  }, []);

  const handleSearch = useCallback(async () => {
    const q = searchQuery.trim();
    if (!q) return;
    setLoading(true);
    setError(null);
    try {
      const results = await geocode(q);
      if (results.length === 0) {
        setError("No results for this search.");
        setLoading(false);
        return;
      }
      const first = results[0];
      const latitude = parseFloat(first.lat);
      const longitude = parseFloat(first.lon);
      setLat(latitude);
      setLng(longitude);
      setAddressPreview(first.display_name);
    } catch {
      setError("Search failed.");
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 md:text-3xl">
          Social networking events
        </h1>
        <p className="mt-2 text-sm text-zinc-600">
          Find events near you. Set your location with the map or search, then we&apos;ll show personalized events.
        </p>
      </div>

      <section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-zinc-900">Location</h2>
        <p className="mt-1 text-sm text-zinc-600">
          Use your browser location or search for a city/address. Your age from profile is used to filter events when set.
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="City or address"
            className="flex-1 rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
          />
          <button
            type="button"
            onClick={handleSearch}
            disabled={loading}
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50"
          >
            Search
          </button>
          <button
            type="button"
            onClick={handleUseMyLocation}
            disabled={loading}
            className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50"
          >
            Use my location
          </button>
        </div>
        {addressPreview && (
          <p className="mt-3 text-sm text-zinc-600" aria-live="polite">
            <strong>Preview:</strong> {addressPreview}
          </p>
        )}
        {error && (
          <p className="mt-2 text-sm text-amber-700" role="alert">
            {error}
          </p>
        )}
      </section>

      <section>
        <h2 className="text-lg font-semibold text-zinc-900">Events near you</h2>
        {loadingEvents ? (
          <p className="mt-2 text-sm text-zinc-600">Loading events…</p>
        ) : events.length === 0 ? (
          <p className="mt-2 text-sm text-zinc-600">
            {lat != null && lng != null
              ? "No events found for this location. Try a different area or radius."
              : "Using default location (San Francisco). Set your location above for personalized results."}
          </p>
        ) : (
          <ul className="mt-4 space-y-4">
            {events.map((event, i) => (
              <li
                key={event.id ?? i}
                className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm"
              >
                <h3 className="font-medium text-zinc-900">
                  {event.name?.text ?? "Untitled event"}
                </h3>
                {event.venue?.name && (
                  <p className="mt-1 text-sm text-zinc-600">{event.venue.name}</p>
                )}
                {event.venue?.address?.localized_address_display && (
                  <p className="text-sm text-zinc-500">
                    {event.venue.address.localized_address_display}
                  </p>
                )}
                {event.start?.local && (
                  <p className="mt-1 text-sm text-zinc-500">
                    {new Date(event.start.local).toLocaleString()}
                  </p>
                )}
                {event.description?.text && (
                  <p className="mt-2 line-clamp-2 text-sm text-zinc-600">
                    {event.description.text}
                  </p>
                )}
                {event.url && (
                  <a
                    href={event.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-sm font-medium text-zinc-900 underline hover:no-underline"
                  >
                    View on Eventbrite
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
