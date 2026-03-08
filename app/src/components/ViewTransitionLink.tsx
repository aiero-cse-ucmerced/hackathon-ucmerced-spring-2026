"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";

export interface ViewTransitionLinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  href: string;
  children: ReactNode;
  className?: string;
  scroll?: boolean;
  prefetch?: boolean;
}

function isSameOrigin(href: string): boolean {
  if (href.startsWith("/")) return true;
  if (typeof window === "undefined") return false;
  try {
    const url = new URL(href, window.location.origin);
    return url.origin === window.location.origin;
  } catch {
    return false;
  }
}

export function ViewTransitionLink({
  href,
  children,
  className,
  ...rest
}: ViewTransitionLinkProps) {
  const router = useRouter();

  function handleClick(event: React.MouseEvent<HTMLAnchorElement>) {
    if (event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (!isSameOrigin(href)) return;

    event.preventDefault();

    const useTransition =
      typeof document !== "undefined" && "startViewTransition" in document;

    if (useTransition) {
      document.startViewTransition(() => {
        router.push(href);
        return new Promise<void>((resolve) => setTimeout(resolve, 300));
      });
    } else {
      router.push(href);
    }
  }

  return (
    <a href={href} className={className} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
}
