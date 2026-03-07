"use client";

import { useEffect } from "react";

/** Cloudflare Turnstile test key (visible widget, always passes). Do not use in production. */
const TURNSTILE_PLACEHOLDER_SITE_KEY = "1x00000000000000000000AA";

declare global {
  interface Window {
    onTurnstileSuccess?: (token: string) => void;
  }
}

export function TurnstileWidget({
  onTokenChange,
}: {
  onTokenChange?: (token: string | null) => void;
}) {
  useEffect(() => {
    window.onTurnstileSuccess = (token: string) => {
      onTokenChange?.(token);
    };

    return () => {
      onTokenChange?.(null);
      delete window.onTurnstileSuccess;
    };
  }, [onTokenChange]);

  const envKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();
  const siteKey = envKey || TURNSTILE_PLACEHOLDER_SITE_KEY;

  return (
    <div
      className="cf-turnstile"
      data-sitekey={siteKey}
      data-callback="onTurnstileSuccess"
    />
  );
}

