import { FallbackView } from "@/components/FallbackView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page not found – UncookedAura",
  description: "This page doesn’t exist or has been moved.",
};

/**
 * Static 404 page — minimal, typographic (Studio Dado–inspired).
 * Used for missing routes; same FallbackView supports auth-required flows.
 */
export default function NotFound() {
  return <FallbackView variant="404" />;
}
