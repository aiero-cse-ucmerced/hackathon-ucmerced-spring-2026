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
  uploadAvatar,
  storeResume,
  getStoredResume,
  WORKING_FIELD_INTERESTS,
  STRENGTH_OPTIONS,
  MAJOR_OPTIONS,
  type UserProfile,
} from "@/lib/internships-api";
import { getStoredToken } from "@/lib/auth";
import { env } from "@/lib/env";
import {
  isValidDisplayName,
  sanitizeDisplayName,
  sanitizePastExperiences,
  isValidAvatarFile,
  isValidResumeFile,
} from "@/lib/validation";

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
  const resumeInputRef = useRef<HTMLInputElement>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeError, setResumeError] = useState<string | null>(null);
  const [resumeExtracting, setResumeExtracting] = useState(false);
  const [resumeTips, setResumeTips] = useState<string[]>([]);
  const [storedResumeName, setStoredResumeName] = useState<string | null>(null);

  useEffect(() => {
    const r = getStoredResume();
    setStoredResumeName(r?.fileName ?? null);
  }, []);

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

  const toggleMajor = useCallback((value: string) => {
    setDraft((current) => {
      const exists = current.majors.includes(value);
      return {
        ...current,
        majors: exists
          ? current.majors.filter((x) => x !== value)
          : [...current.majors, value],
      };
    });
  }, []);

  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);

  async function handleAvatarChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    const check = isValidAvatarFile(file);
    if (!check.valid) {
      setAvatarError(check.message ?? "Invalid file.");
      return;
    }
    setAvatarError(null);
    const token = getStoredToken();
    if (env.useWorkersApi && token) {
      setAvatarUploading(true);
      try {
        const avatarUrl = await uploadAvatar(file, token);
        setDraft((c) => ({ ...c, avatarUrl }));
      } catch (e) {
        setAvatarError(e instanceof Error ? e.message : "Upload failed.");
      } finally {
        setAvatarUploading(false);
      }
    } else {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        setDraft((c) => ({ ...c, avatarUrl: dataUrl }));
      };
      reader.readAsDataURL(file);
    }
  }

  const [submitErrors, setSubmitErrors] = useState<{ name?: string }>({});

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitErrors({});
    const nameCheck = isValidDisplayName(draft.name ?? "");
    if (!nameCheck.valid) {
      setSubmitErrors({ name: nameCheck.message });
      return;
    }
    setSaving(true);
    setSavedMessage(null);
    try {
      const token = getStoredToken();
      const sanitizedPast = sanitizePastExperiences(draft.pastExperiences ?? []);
      await patchProfile(
        {
          name: sanitizeDisplayName(draft.name ?? ""),
          email: draft.email,
          major: draft.major,
          age: draft.age,
          avatarUrl: draft.avatarUrl ?? null,
          interests: draft.interests,
          strengths: draft.strengths,
          pastExperiences: sanitizedPast,
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
    <div style={{ viewTransitionName: "vt-content" }} className="mx-auto max-w-3xl">
      {/* Hero section – visual hierarchy per Claritee: identity first */}
      <header className="mb-10">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 md:text-3xl">
          Profile &amp; preferences
        </h1>
        <p className="mt-2 max-w-xl text-base leading-relaxed text-zinc-600">
          Update your interests, strengths, and past experiences so we can match
          you accurately with internships and jobs.
        </p>
      </header>

      <form className="space-y-10" onSubmit={handleSubmit}>
        {/* Personal info card – grouped by information architecture */}
        <Card className="overflow-hidden border-zinc-200 shadow-sm transition-shadow hover:shadow-md">
          <CardHeader className="border-b border-zinc-100 bg-zinc-50/50">
            <CardTitle className="text-base">Personal information</CardTitle>
            <CardDescription>
              Your name and photo help personalize your experience.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <Avatar size="lg" className="shrink-0 ring-2 ring-zinc-200">
                <Avatar.Image
                  src={draft.avatarUrl ?? DEFAULT_AVATAR_IMAGE}
                  alt={draft.name ?? "Profile"}
                />
                <Avatar.Fallback>
                  <Avatar.UserIcon />
                </Avatar.Fallback>
              </Avatar>
              <div className="flex flex-1 flex-col gap-2">
                {avatarError && (
                  <p className="text-sm text-red-600" role="alert">{avatarError}</p>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  disabled={avatarUploading}
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                  aria-label="Upload profile photo"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={avatarUploading}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {avatarUploading ? "Uploading…" : "Upload picture"}
                </Button>
                <p className="text-xs text-zinc-500">
                  JPG, PNG or GIF. Max 2MB.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={draft.name ?? ""}
                  onChange={(e) => {
                    setDraft((c) => ({ ...c, name: e.target.value }));
                    if (submitErrors.name) setSubmitErrors((p) => ({ ...p, name: undefined }));
                  }}
                  invalid={!!submitErrors.name}
                  aria-invalid={!!submitErrors.name}
                  required
                  className="transition-colors"
                />
                {submitErrors.name && (
                  <p className="text-sm text-red-600" role="alert">{submitErrors.name}</p>
                )}
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
            </div>
          </CardContent>
        </Card>

        {/* Academic & interests – clear sections */}
        <Card className="overflow-hidden border-zinc-200 shadow-sm transition-shadow hover:shadow-md">
          <CardHeader className="border-b border-zinc-100 bg-zinc-50/50">
            <CardTitle className="text-base">Academic &amp; interests</CardTitle>
            <CardDescription>
              We use this to match you with relevant internships and jobs.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-2">
              <Label>Major</Label>
              <p className="text-sm text-zinc-600">Select one or more majors.</p>
              <div className="flex flex-wrap gap-2 pt-1">
                {MAJOR_OPTIONS.map((label) => {
                  const active = draft.majors.includes(label);
                  return (
                    <button
                      key={label}
                      type="button"
                      onClick={() => toggleMajor(label)}
                      className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
                        active
                          ? "border-zinc-900 bg-zinc-900 text-white shadow-sm"
                          : "border-zinc-300 bg-white text-zinc-800 hover:border-zinc-400 hover:bg-zinc-50"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
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
                      className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
                        active
                          ? "border-zinc-900 bg-zinc-900 text-white shadow-sm"
                          : "border-zinc-300 bg-white text-zinc-800 hover:border-zinc-400 hover:bg-zinc-50"
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
                      className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
                        active
                          ? "border-zinc-900 bg-zinc-900 text-white shadow-sm"
                          : "border-zinc-300 bg-white text-zinc-800 hover:border-zinc-400 hover:bg-zinc-50"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resume upload – Gemini extracts past experiences for prefill */}
        <Card className="overflow-hidden border-zinc-200 shadow-sm transition-shadow hover:shadow-md">
          <CardHeader className="border-b border-zinc-100 bg-zinc-50/50">
            <CardTitle className="text-base">Resume</CardTitle>
            <CardDescription>
              Upload your resume and we&apos;ll use Gemini to extract past experiences and prefill the section below. PDF or Word, max 5MB.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <input
              ref={resumeInputRef}
              type="file"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={(e) => {
                const file = e.target.files?.[0];
                e.target.value = "";
                setResumeError(null);
                if (!file) return;
                const check = isValidResumeFile(file);
                if (!check.valid) {
                  setResumeError(check.message ?? "Invalid file.");
                  return;
                }
                setResumeFile(file);
              }}
              className="hidden"
              aria-label="Upload resume"
            />
            <div className="flex flex-wrap items-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => resumeInputRef.current?.click()}
              >
                {resumeFile ? resumeFile.name : storedResumeName ? `Replace ${storedResumeName}` : "Upload resume"}
              </Button>
              {resumeFile && (
                <Button
                  type="button"
                  size="sm"
                  disabled={resumeExtracting}
                  onClick={async () => {
                    setResumeExtracting(true);
                    setResumeError(null);
                    setResumeTips([]);
                    try {
                      const reader = new FileReader();
                      const base64 = await new Promise<string>((resolve, reject) => {
                        reader.onload = () => {
                          const dataUrl = reader.result as string;
                          const b = dataUrl.split(",")[1];
                          resolve(b ?? "");
                        };
                        reader.onerror = () => reject(reader.error);
                        reader.readAsDataURL(resumeFile);
                      });
                      const res = await fetch("/api/resume/extract", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ base64, mimeType: resumeFile.type }),
                      });
                      const data = (await res.json()) as { pastExperiences?: string[]; tips?: string[]; error?: string };
                      if (!res.ok) {
                        setResumeError(data.error ?? "Extraction failed.");
                        return;
                      }
                      await storeResume(resumeFile);
                      setStoredResumeName(resumeFile.name);
                      const extracted = data.pastExperiences ?? [];
                      if (extracted.length > 0) {
                        setDraft((c) => ({
                          ...c,
                          pastExperiences: [...new Set([...(c.pastExperiences ?? []), ...extracted])],
                        }));
                      }
                      setResumeTips(data.tips ?? []);
                    } catch (e) {
                      setResumeError(e instanceof Error ? e.message : "Extraction failed.");
                    } finally {
                      setResumeExtracting(false);
                    }
                  }}
                >
                  {resumeExtracting ? "Extracting…" : "Extract & prefill"}
                </Button>
              )}
            </div>
            {resumeError && <p className="text-sm text-red-600" role="alert">{resumeError}</p>}
            {resumeTips.length > 0 && (
              <div className="rounded-lg bg-emerald-50 px-3 py-2">
                <p className="text-xs font-medium text-emerald-800">Personalized tips:</p>
                <ul className="mt-1 list-inside list-disc text-sm text-emerald-700">
                  {resumeTips.map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Past experiences – tall page pattern: answer all questions */}
        <Card className="overflow-hidden border-zinc-200 shadow-sm transition-shadow hover:shadow-md">
          <CardHeader className="border-b border-zinc-100 bg-zinc-50/50">
            <CardTitle className="text-base">Past experiences</CardTitle>
            <CardDescription>
              One per line or comma-separated. Helps us tailor recommendations.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
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
              className="w-full resize-y rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-zinc-800 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/20"
            />
          </CardContent>
        </Card>

        {/* CTA farther down – Orbit Media: persuasion happens below the fold */}
        {savedMessage && (
          <p className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800" role="status">
            {savedMessage}
          </p>
        )}

        <div className="flex items-center justify-between border-t border-zinc-200 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={saving || loading}>
            {saving ? "Saving…" : "Save profile"}
          </Button>
        </div>
      </form>
    </div>
  );
}
