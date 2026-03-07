"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { OnboardingGuard } from "@/components/onboarding/OnboardingGuard";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";
import { getStoredToken } from "@/lib/auth";

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const token = typeof window !== "undefined" ? getStoredToken() : null;

  useEffect(() => {
    if (!user) {
      router.replace("/unauthorized");
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  return (
    <OnboardingGuard>
      <OnboardingFlow
        user={{ name: user.name, email: user.email, major: user.major }}
        token={token}
      />
    </OnboardingGuard>
  );
}
