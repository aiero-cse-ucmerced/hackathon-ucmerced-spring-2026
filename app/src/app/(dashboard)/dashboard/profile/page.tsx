"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/components/AuthProvider";
import { useProfile, type Profile } from "@/lib/use-profile";

const INTEREST_TAGS = ["web-dev", "data", "design", "finance"] as const;

export default function ProfilePage() {
  const router = useRouter();
  const { user } = useAuth();
  const { profile, save, loading } = useProfile();

  const [draft, setDraft] = useState<Profile>({
    name: user?.name ?? "",
    major: user?.major,
    interests: [],
    outcomes: "",
  });
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setDraft(profile);
      return;
    }
    if (user) {
      setDraft((current) => ({
        ...current,
        name: user.name,
        major: user.major,
      }));
    }
  }, [profile, user]);

  useEffect(() => {
    if (!user) {
      router.replace("/unauthorized");
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  function toggleInterest(tag: (typeof INTEREST_TAGS)[number]) {
    setDraft((current) => {
      const exists = current.interests.includes(tag);
      return {
        ...current,
        interests: exists
          ? current.interests.filter((value) => value !== tag)
          : [...current.interests, tag],
      };
    });
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    save(draft);
    setSavedMessage("Profile updated. Your matches will use these interests.");
  }

  return (
    <Card className="mx-auto mt-10 w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Profile &amp; interests</CardTitle>
        <CardDescription>
          Tell UncookedAura what you&apos;re studying and what you want from
          internships so we can match you more accurately.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={draft.name}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="major">Major</Label>
              <Input
                id="major"
                value={draft.major ?? ""}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    major: event.target.value,
                  }))
                }
                placeholder="e.g. CSE, CS, Applied Math"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Interests</Label>
            <p className="text-sm text-zinc-600">
              Choose a few themes so we can generate better queries and scores
              for you.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {INTEREST_TAGS.map((tag) => {
                const active = draft.interests.includes(tag);
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
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="outcomes">Outcomes (optional)</Label>
            <Input
              id="outcomes"
              value={draft.outcomes ?? ""}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  outcomes: event.target.value,
                }))
              }
              placeholder="e.g. Entry-level at big tech, internship in finance"
            />
          </div>

          {savedMessage && !loading && (
            <p className="text-sm text-emerald-700" role="status">
              {savedMessage}
            </p>
          )}

          <div className="flex items-center justify-between pt-2">
            <Button type="submit">Save profile</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

