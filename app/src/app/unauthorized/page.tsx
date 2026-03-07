import { FallbackView } from "@/components/FallbackView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign in required – UncookedAura",
  description: "Sign in to view this page.",
};

/**
 * Fallback when a route requires authentication.
 * Same minimal, typographic treatment as 404 — reuse for consistency.
 */
export default function UnauthorizedPage() {
  return (
    <FallbackView
      variant="auth"
      description="Sign in to view this page."
      primaryLabel="Sign in"
        primaryHref="/login"
    />
  );
}
