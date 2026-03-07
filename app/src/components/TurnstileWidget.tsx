"use client";

import { useEffect } from "react";

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

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  if (!siteKey) {
    return null;
  }

  return (
    <div
      className="cf-turnstile"
      data-sitekey={siteKey}
      data-callback="onTurnstileSuccess"
    />
  );
}

