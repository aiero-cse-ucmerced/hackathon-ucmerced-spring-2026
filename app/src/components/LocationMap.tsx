"use client";

import { useEffect, useState } from "react";
import { geocode } from "@/lib/geocode";

interface LocationMapProps {
  location: string;
  className?: string;
}

export function LocationMap({ location, className = "" }: LocationMapProps) {
  const [result, setResult] = useState<{ lat: number; lon: number; displayName: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!location?.trim()) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    geocode(location.trim())
      .then((data) => {
        if (cancelled || !data[0]) return;
        const first = data[0];
        setResult({
          lat: parseFloat(first.lat),
          lon: parseFloat(first.lon),
          displayName: first.display_name ?? location,
        });
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Could not find location");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [location]);

  if (!location?.trim()) return null;
  if (loading) {
    return (
      <div className={`rounded-xl border border-zinc-200 bg-zinc-50 p-8 text-center text-sm text-zinc-500 ${className}`}>
        Loading map…
      </div>
    );
  }
  if (error || !result) {
    return (
      <div className={`rounded-xl border border-zinc-200 bg-zinc-50 p-4 ${className}`}>
        <p className="text-sm font-medium text-zinc-700">Location</p>
        <p className="mt-1 text-sm text-zinc-600">{location}</p>
        <p className="mt-2 text-xs text-zinc-500">Approximate location (map unavailable)</p>
      </div>
    );
  }

  const bboxPadding = 0.02;
  const bbox = `${result.lon - bboxPadding},${result.lat - bboxPadding},${result.lon + bboxPadding},${result.lat + bboxPadding}`;
  const embedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${result.lat},${result.lon}`;

  return (
    <div className={`space-y-2 ${className}`}>
      <p className="text-sm font-medium text-zinc-700">Location</p>
      <p className="text-sm text-zinc-600">{result.displayName}</p>
      <div className="overflow-hidden rounded-xl border border-zinc-200">
        <iframe
          title={`Map of ${location}`}
          src={embedUrl}
          className="h-64 w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      <a
        href={`https://www.openstreetmap.org/?mlat=${result.lat}&mlon=${result.lon}#map=15/${result.lat}/${result.lon}`}
        target="_blank"
        rel="noreferrer"
        className="text-xs text-zinc-500 underline hover:text-zinc-700"
      >
        View larger map
      </a>
    </div>
  );
}
