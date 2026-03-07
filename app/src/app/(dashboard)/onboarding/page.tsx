"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/components/AuthProvider";
import { useProfile } from "@/lib/use-profile";

const INTEREST_TAGS = ["web-dev", "data", "design", "finance"] as const;

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { profile, save, loading } = useProfile();

  useEffect(() => {
    if (!user) {
      router.replace("/unauthorized");
      return;
    }
    if (!loading && profile && profile.interests.length > 0) {
      router.replace("/dashboard");
    }
  }, [user, profile, loading, router]);

  if (!user) {
    return null;
  }

  function toggleInterest(tag: (typeof INTEREST_TAGS)[number]) {
    const base = profile ?? {
      name: user.name,
      major: user.major,
      interests: [] as string[],
      outcomes: "",
    };
    const exists = base.interests.includes(tag);
    const nextInterests = exists
      ? base.interests.filter((value) => value !== tag)
      : [...base.interests, tag];
    save({ ...base, interests: nextInterests });
  }

  function handleContinue() {
    const base = profile ?? {
      name: user.name,
      major: user.major,
      interests: [] as string[],
      outcomes: "",
    };
    save(base);
    router.replace("/dashboard");
  }

  const current = profile ?? {
    name: user.name,
    major: user.major,
    interests: [] as string[],
    outcomes: "",
  };

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6 py-16">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Tell us what you&apos;re into</CardTitle>
          <CardDescription>
            Pick a few interests so we can start matching you to internships
            that actually feel relevant.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {INTEREST_TAGS.map((tag) => {
                const active = current.interests.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleInterest(tag)}
                    className={`rounded-full border px-3 py-1 text-sm ${
                      active
                        ? "border-zinc-900 bg-zinc-900 text-white"
                        : "border-zinc-300 bg-white text-zinc-800 hover:border-zinc-400"
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
            <p className="text-sm text-zinc-600">
              You can change these any time in your profile. We&apos;ll use
              them as a starting point for your matches.
            </p>
            <div className="pt-2">
              <Button type="button" onClick={handleContinue}>
                Continue to dashboard
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

