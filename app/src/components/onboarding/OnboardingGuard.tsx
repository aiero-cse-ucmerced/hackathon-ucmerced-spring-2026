"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isOnboardingComplete } from "@/lib/internships-api";

/**
 * Redirects to home if the user has already completed onboarding.
 * First-time users: wire "Get Started" and post–sign-up to /onboarding; in dashboard layout
 * redirect to /onboarding when !isOnboardingComplete() so new users complete profile first.
 */
export function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    if (isOnboardingComplete()) {
      router.replace("/");
    }
  }, [router]);

  return <>{children}</>;
}
