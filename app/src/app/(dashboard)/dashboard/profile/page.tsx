"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar, DEFAULT_AVATAR_IMAGE } from "@/components/ui/avatar";
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
import {
  getProfile,
  patchProfile,
  WORKING_FIELD_INTERESTS,
  STRENGTH_OPTIONS,
  MAJOR_OPTIONS,
  type UserProfile,
} from "@/lib/internships-api";
import { getStoredToken } from "@/lib/auth";

const MIN_INTERESTS = 3;

export default function ProfilePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  const [draft, setDraft] = useState<UserProfile & { majors: string[] }>({
    interests: [],
    strengths: [],
    pastExperiences: [],
    majors: [],
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadProfile = useCallback(async () => {
    const token = getStoredToken();
    const p = await getProfile(token ?? undefined);
    setProfile(p);
    if (p) {
      const majors = p.major
        ? p.major.split(/,\s*/).filter(Boolean)
        : [];
      setDraft({
        name: p.name,
        email: p.email,
        major: p.major,
        avatarUrl: p.avatarUrl ?? undefined,
        interests: p.interests ?? [],
        strengths: p.strengths ?? [],
        pastExperiences: p.pastExperiences ?? [],
        majors,
      });
    } else if (user) {
      const majors = user.major
        ? user.major.split(/,\s*/).filter(Boolean)
        : [];
      setDraft({
        name: user.name,
        email: user.email,
        major: user.major,
        age: undefined,
        interests: [],
        strengths: [],
        pastExperiences: [],
        majors,
      });
    }
  }, [user]);

  useEffect(() => {
    loadProfile().finally(() => setLoading(false));
  }, [loadProfile]);

  useEffect(() => {
    if (!user) {
      router.replace("/unauthorized");
    }
  }, [user, router]);

  const toggleInterest = useCallback((value: string) => {
    setDraft((current) => {
      const exists = current.interests.includes(value);
      return {
        ...current,
        interests: exists
          ? current.interests.filter((x) => x !== value)
          : [...current.interests, value],
      };
    });
  }, []);

  const toggleStrength = useCallback((value: string) => {
    setDraft((current) => {
      const exists = current.strengths.includes(value);
      return {
        ...current,
        strengths: exists
          ? current.strengths.filter((x) => x !== value)
          : [...current.strengths, value],
      };
    });
  }, []);

  function handleAvatarChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setDraft((c) => ({ ...c, avatarUrl: dataUrl }));
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setSavedMessage(null);
    try {
      const token = getStoredToken();
      await patchProfile(
        {
          name: draft.name,
          email: draft.email,
          major: draft.major,
          avatarUrl: draft.avatarUrl ?? null,
          interests: draft.interests,
          strengths: draft.strengths,
          pastExperiences: draft.pastExperiences,
        },
        token ?? undefined
      );
      setSavedMessage("Profile updated. Your matches will use these preferences.");
      await loadProfile();
    } finally {
      setSaving(false);
    }
  }

  if (!user) {
    return null;
  }

  const pastExperiencesText =
    Array.isArray(draft.pastExperiences) && draft.pastExperiences.length > 0
      ? draft.pastExperiences.join("\n")
      : "";

  return (
    <div style={{ viewTransitionName: "vt-content" }}>
      <Card className="mx-auto mt-10 w-full max-w-2xl">
        <CardHeader>
        <CardTitle>Profile &amp; preferences</CardTitle>
        <CardDescription>
          Same options as onboarding. Update your interests, strengths, and
          past experiences so we can match you accurately.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="flex flex-col items-start gap-3">
            <Label>Profile photo</Label>
            <div className="flex items-center gap-4">
              <Avatar size="lg" className="shrink-0 ring-1 ring-zinc-200">
                <Avatar.Image
                  src={draft.avatarUrl ?? DEFAULT_AVATAR_IMAGE}
                  alt={draft.name ?? "Profile"}
                />
                <Avatar.Fallback>
                  <Avatar.UserIcon />
                </Avatar.Fallback>
              </Avatar>
              <div className="flex flex-col gap-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                  aria-label="Upload profile photo"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Upload picture
                </Button>
                <p className="text-xs text-zinc-500">
                  JPG, PNG or GIF. Your default is the silhouette until you upload.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={draft.name ?? ""}
                onChange={(e) =>
                  setDraft((c) => ({ ...c, name: e.target.value }))
                }
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="age">Age (optional)</Label>
              <Input
                id="age"
                type="number"
                min={13}
                max={120}
                value={draft.age ?? ""}
                onChange={(e) => {
                  const v = e.target.value ? parseInt(e.target.value, 10) : undefined;
                  setDraft((c) => ({ ...c, age: v }));
                }}
                placeholder="For event recommendations"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Major</Label>
              <p className="text-sm text-zinc-600">
                Select one or more majors.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {MAJOR_OPTIONS.map((label) => {
                  const active = draft.majors.includes(label);
                  return (
                    <button
                      key={label}
                      type="button"
                      onClick={() => toggleMajor(label)}
                      className={`rounded-full border px-3 py-1 text-sm ${
                        active
                          ? "border-zinc-900 bg-zinc-900 text-white"
                          : "border-zinc-300 bg-white text-zinc-800 hover:border-zinc-400"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Interests</Label>
            <p className="text-sm text-zinc-600">
              Select at least {MIN_INTERESTS} areas (same as onboarding).
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {WORKING_FIELD_INTERESTS.map((label) => {
                const active = draft.interests.includes(label);
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => toggleInterest(label)}
                    className={`rounded-full border px-3 py-1 text-sm ${
                      active
                        ? "border-zinc-900 bg-zinc-900 text-white"
                        : "border-zinc-300 bg-white text-zinc-800 hover:border-zinc-400"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
            {draft.interests.length > 0 &&
              draft.interests.length < MIN_INTERESTS && (
                <p className="text-sm text-amber-600">
                  Select at least {MIN_INTERESTS - draft.interests.length} more.
                </p>
              )}
          </div>

          <div className="space-y-2">
            <Label>Strengths</Label>
            <p className="text-sm text-zinc-600">Optional.</p>
            <div className="flex flex-wrap gap-2 pt-1">
              {STRENGTH_OPTIONS.map((label) => {
                const active = draft.strengths.includes(label);
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => toggleStrength(label)}
                    className={`rounded-full border px-3 py-1 text-sm ${
                      active
                        ? "border-zinc-900 bg-zinc-900 text-white"
                        : "border-zinc-300 bg-white text-zinc-800 hover:border-zinc-400"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="past-experiences">Past experiences</Label>
            <p className="text-sm text-zinc-600">
              One per line or comma-separated (optional).
            </p>
            <textarea
              id="past-experiences"
              value={pastExperiencesText}
              onChange={(e) =>
                setDraft((c) => ({
                  ...c,
                  pastExperiences: e.target.value
                    .split(/[\n,;]/)
                    .map((s) => s.trim())
                    .filter(Boolean),
                }))
              }
              placeholder="e.g. Campus club treasurer, summer volunteer, class project lead..."
              rows={4}
              className="w-full resize-y rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-800 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/20"
            />
          </div>

          {savedMessage && (
            <p className="text-sm text-emerald-700" role="status">
              {savedMessage}
            </p>
          )}

          <div className="flex items-center justify-between pt-2">
            <Button type="submit" disabled={saving || loading}>
              {saving ? "Saving…" : "Save profile"}
            </Button>
          </div>
        </form>
      </CardContent>
      </Card>
    </div>
  );
}
