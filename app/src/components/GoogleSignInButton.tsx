"use client";

import { useRef, useEffect } from "react";

const GSI_SCRIPT = "https://accounts.google.com/gsi/client";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
            auto_select?: boolean;
          }) => void;
          renderButton: (
            element: HTMLElement,
            options: { theme?: "outline" | "filled_blue" | "filled_black"; size?: "large" | "medium" | "small"; type?: "standard" | "icon"; width?: number }
          ) => void;
          prompt: (momentListener?: (notification: { isDisplayed: boolean; isNotDisplayed: boolean }) => void) => void;
        };
      };
    };
  }
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(script);
  });
}

/** Decode JWT payload (no verification; backend already verified). Used for display name/email only. */
function decodeIdTokenPayload(credential: string): { email?: string; name?: string } {
  try {
    const parts = credential.split(".");
    if (parts.length < 2) return {};
    const payload = JSON.parse(atob(parts[1])) as { email?: string; name?: string };
    return { email: payload.email, name: payload.name };
  } catch {
    return {};
  }
}

export interface GoogleSignInButtonProps {
  clientId: string;
  onSuccess: (params: { idToken: string; email?: string; name?: string }) => Promise<void>;
  onError?: (message: string) => void;
  disabled?: boolean;
  theme?: "outline" | "filled_blue" | "filled_black";
  size?: "large" | "medium" | "small";
  className?: string;
  /** Show the One Tap floating prompt (right side). Same callback as the button. */
  useOneTap?: boolean;
}

export function GoogleSignInButton({
  clientId,
  onSuccess,
  onError,
  disabled,
  theme = "outline",
  size = "large",
  className,
  useOneTap = true,
}: GoogleSignInButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const renderedRef = useRef(false);
  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);
  onSuccessRef.current = onSuccess;
  onErrorRef.current = onError;

  useEffect(() => {
    if (!clientId || !containerRef.current) return;

    let cancelled = false;

    loadScript(GSI_SCRIPT)
      .then(() => {
        if (cancelled || !window.google?.accounts?.id || !containerRef.current) return;
        if (renderedRef.current) return;
        renderedRef.current = true;

        const callback = (response: { credential: string }) => {
          const payload = decodeIdTokenPayload(response.credential);
          onSuccessRef.current({
            idToken: response.credential,
            email: payload.email,
            name: payload.name,
          }).catch((err) => {
            onErrorRef.current?.(err instanceof Error ? err.message : "Google sign-in failed");
          });
        };

        window.google.accounts.id.initialize({
          client_id: clientId,
          callback,
        });

        if (!disabled) {
          const el = containerRef.current;
          el.innerHTML = "";
          window.google.accounts.id.renderButton(el, { theme, size });
          if (useOneTap) {
            window.google.accounts.id.prompt();
          }
        }
      })
      .catch((err) => {
        onErrorRef.current?.(err instanceof Error ? err.message : "Failed to load Google Sign-In");
      });

    return () => {
      cancelled = true;
    };
  }, [clientId, disabled, theme, size, useOneTap]);

  if (disabled) {
    return (
      <div className={className} aria-hidden>
        <div ref={containerRef} className="min-h-[48px] opacity-50 pointer-events-none" />
      </div>
    );
  }

  return (
    <div className={className} style={{ minHeight: 48 }}>
      <div ref={containerRef} className="min-h-[48px] flex items-center justify-center [&>div]:flex [&>div]:justify-center" />
    </div>
  );
}
