"use client";

import { useCallback, useEffect, useRef } from "react";
import Script from "next/script";

/** Cloudflare Turnstile test key (visible widget, always passes on localhost). Do not use in production. */
const TURNSTILE_TEST_SITE_KEY = "1x00000000000000000000AA";

const TURNSTILE_SCRIPT =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: string | HTMLElement,
        options: {
          sitekey: string;
          callback?: (token: string) => void;
          "error-callback"?: (errorCode?: string) => void;
          theme?: "light" | "dark" | "auto";
          size?: "normal" | "compact" | "flexible";
        }
      ) => string;
      remove: (widgetId: string) => void;
    };
  }
}

export function TurnstileWidget({
  onTokenChange,
}: {
  onTokenChange?: (token: string | null) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  const siteKey =
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() || TURNSTILE_TEST_SITE_KEY;

  const renderWidget = useCallback(() => {
    const container = containerRef.current;
    if (!window.turnstile || !container) return;

    if (widgetIdRef.current) {
      try {
        window.turnstile.remove(widgetIdRef.current);
      } catch {
        // ignore
      }
      widgetIdRef.current = null;
    }

    widgetIdRef.current = window.turnstile.render(container, {
      sitekey: siteKey,
      theme: "light",
      size: "normal",
      callback: (token) => {
        onTokenChange?.(token);
      },
      "error-callback": () => {
        onTokenChange?.(null);
      },
    });
  }, [siteKey, onTokenChange]);

  const handleScriptLoad = useCallback(() => {
    renderWidget();
  }, [renderWidget]);

  // If script already loaded (e.g. navigated back to signup), render immediately
  useEffect(() => {
    if (window.turnstile && containerRef.current) {
      renderWidget();
    }
  }, [renderWidget]);

  useEffect(() => {
    return () => {
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          // ignore
        }
        widgetIdRef.current = null;
      }
      onTokenChange?.(null);
    };
  }, [onTokenChange]);

  return (
    <>
      <Script
        src={TURNSTILE_SCRIPT}
        strategy="afterInteractive"
        onLoad={handleScriptLoad}
      />
      <div ref={containerRef} />
    </>
  );
}
