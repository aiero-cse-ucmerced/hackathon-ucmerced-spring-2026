"use client";

import { useCallback, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import {
  MAJOR_OPTIONS,
  WORKING_FIELD_INTERESTS,
  STRENGTH_OPTIONS,
  patchProfile,
  setOnboardingComplete,
} from "@/lib/internships-api";
import type { MajorOption } from "@/lib/internships-api";

export type OnboardingFlowAuth = {
  name?: string;
  email?: string;
  major?: string;
} | null;

const MIN_INTERESTS = 3;
const TRANSITION_MS = 320;

type Step = "major" | "interests" | "strengths" | "experiences";

const STEPS: Step[] = ["major", "interests", "strengths", "experiences"];

const STEP_LABELS: Record<Step, string> = {
  major: "What's your major?",
  interests: "What are you interested in?",
  strengths: "What are your strengths?",
  experiences: "Any past experiences to share?",
};

const STEP_SUBTITLES: Record<Step, string> = {
  major: "We use this to match you with relevant internships and jobs.",
  interests: "Select at least 3 areas related to your career goals.",
  strengths: "Pick what best describes you (optional).",
  experiences: "Briefly list roles, projects, or activities (optional).",
};

function StepContentMajor({
  major,
  setMajor,
  userName,
  userEmail,
}: {
  major: MajorOption | "";
  setMajor: (v: MajorOption | "") => void;
  userName?: string;
  userEmail?: string;
}) {
  return (
    <>
      <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 md:text-3xl">
        {STEP_LABELS.major}
      </h2>
      <p className="mt-2 text-zinc-500">{STEP_SUBTITLES.major}</p>
      {(userName || userEmail) && (
        <p className="mt-3 text-sm text-zinc-600">
          {userName && <span>Hi, {userName}. </span>}
          {userEmail && <span>We'll use {userEmail} for your profile.</span>}
        </p>
      )}
      <div className="mt-8 flex flex-wrap gap-3">
        {MAJOR_OPTIONS.map((value) => {
          const selected = major === value;
          return (
            <button
              key={value}
              type="button"
              onClick={() => setMajor(value)}
              className={`rounded-full border px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                selected
                  ? "border-zinc-900 bg-zinc-900 text-white"
                  : "border-zinc-300 bg-white text-zinc-700 hover:border-zinc-400 hover:bg-zinc-50"
              }`}
            >
              {value}
            </button>
          );
        })}
      </div>
    </>
  );
}

function StepContentInterests({
  interests,
  toggleInterest,
}: {
  interests: string[];
  toggleInterest: (v: string) => void;
}) {
  return (
    <>
      <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 md:text-3xl">
        {STEP_LABELS.interests}
      </h2>
      <p className="mt-2 text-zinc-500">{STEP_SUBTITLES.interests}</p>
      <div className="mt-8 flex flex-wrap gap-3">
        {WORKING_FIELD_INTERESTS.map((label) => {
          const selected = interests.includes(label);
          return (
            <button
              key={label}
              type="button"
              onClick={() => toggleInterest(label)}
              className={`rounded-full border px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                selected
                  ? "border-zinc-900 bg-zinc-900 text-white"
                  : "border-zinc-300 bg-white text-zinc-700 hover:border-zinc-400 hover:bg-zinc-50"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>
      {interests.length > 0 && interests.length < MIN_INTERESTS && (
        <p className="mt-4 text-sm text-amber-600">
          Select at least {MIN_INTERESTS - interests.length} more.
        </p>
      )}
    </>
  );
}

function StepContentStrengths({
  strengths,
  toggleStrength,
}: {
  strengths: string[];
  toggleStrength: (v: string) => void;
}) {
  return (
    <>
      <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 md:text-3xl">
        {STEP_LABELS.strengths}
      </h2>
      <p className="mt-2 text-zinc-500">{STEP_SUBTITLES.strengths}</p>
      <div className="mt-8 flex flex-wrap gap-3">
        {STRENGTH_OPTIONS.map((label) => {
          const selected = strengths.includes(label);
          return (
            <button
              key={label}
              type="button"
              onClick={() => toggleStrength(label)}
              className={`rounded-full border px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                selected
                  ? "border-zinc-900 bg-zinc-900 text-white"
                  : "border-zinc-300 bg-white text-zinc-700 hover:border-zinc-400 hover:bg-zinc-50"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>
    </>
  );
}

function StepContentExperiences({
  pastExperiences,
  setPastExperiences,
}: {
  pastExperiences: string;
  setPastExperiences: (v: string) => void;
}) {
  return (
    <>
      <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 md:text-3xl">
        {STEP_LABELS.experiences}
      </h2>
      <p className="mt-2 text-zinc-500">{STEP_SUBTITLES.experiences}</p>
      <div className="mt-8">
        <textarea
          value={pastExperiences}
          onChange={(e) => setPastExperiences(e.target.value)}
          placeholder="e.g. Campus club treasurer, summer volunteer, class project lead..."
          rows={5}
          className="w-full resize-y rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-800 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/20"
        />
      </div>
    </>
  );
}

export function OnboardingFlow({
  user = null,
  token = null,
}: {
  user?: OnboardingFlowAuth;
  token?: string | null;
} = {}) {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [animating, setAnimating] = useState(false);
  const [exitingIndex, setExitingIndex] = useState<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [major, setMajor] = useState<MajorOption | "">(
    (user?.major as MajorOption | undefined) ?? ""
  );
  const [interests, setInterests] = useState<string[]>([]);
  const [strengths, setStrengths] = useState<string[]>([]);
  const [pastExperiences, setPastExperiences] = useState<string>("");

  const step = STEPS[stepIndex];
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === STEPS.length - 1;
  const canProceed =
    (step === "major" && major !== "") ||
    (step !== "major" && step !== "interests") ||
    (step === "interests" && interests.length >= MIN_INTERESTS);

  const toggleInterest = useCallback((value: string) => {
    setInterests((prev) =>
      prev.includes(value) ? prev.filter((x) => x !== value) : [...prev, value]
    );
  }, []);

  const toggleStrength = useCallback((value: string) => {
    setStrengths((prev) =>
      prev.includes(value) ? prev.filter((x) => x !== value) : [...prev, value]
    );
  }, []);

  const goNext = useCallback(() => {
    if (!canProceed && (step === "interests" || step === "major")) return;
    if (animating) return;
    if (isLast) {
      setAnimating(true);
      submitAndRedirect();
      return;
    }
    setAnimating(true);
    setDirection("forward");
    setExitingIndex(stepIndex);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setStepIndex((i) => i + 1);
      setExitingIndex(null);
      setAnimating(false);
      timeoutRef.current = null;
    }, TRANSITION_MS);
  }, [canProceed, step, isLast, animating, stepIndex]);

  const goBack = useCallback(() => {
    if (animating) return;
    if (isFirst) {
      router.push("/");
      return;
    }
    setAnimating(true);
    setDirection("back");
    setExitingIndex(stepIndex);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setStepIndex((i) => i - 1);
      setExitingIndex(null);
      setAnimating(false);
      timeoutRef.current = null;
    }, TRANSITION_MS);
  }, [isFirst, animating, router, stepIndex]);

  async function submitAndRedirect() {
    const experiencesList = pastExperiences
      .split(/[\n,;]/)
      .map((s) => s.trim())
      .filter(Boolean);
    await patchProfile(
      {
        name: user?.name,
        email: user?.email,
        major: major || user?.major,
        interests,
        strengths,
        pastExperiences: experiencesList,
      },
      token ?? undefined
    );
    setOnboardingComplete();
    router.push("/dashboard");
  }

  const progress = ((stepIndex + 1) / STEPS.length) * 100;

  const enteringIndex =
    exitingIndex !== null
      ? direction === "forward"
        ? exitingIndex + 1
        : exitingIndex - 1
      : stepIndex;
  const displayStep = STEPS[exitingIndex !== null ? enteringIndex : stepIndex];

  const renderStep = (s: Step, animateClass: string) => (
    <div key={s} className={`absolute inset-0 ${animateClass}`}>
      {s === "major" && (
        <StepContentMajor
          major={major}
          setMajor={setMajor}
          userName={user?.name}
          userEmail={user?.email}
        />
      )}
      {s === "interests" && (
        <StepContentInterests interests={interests} toggleInterest={toggleInterest} />
      )}
      {s === "strengths" && (
        <StepContentStrengths strengths={strengths} toggleStrength={toggleStrength} />
      )}
      {s === "experiences" && (
        <StepContentExperiences
          pastExperiences={pastExperiences}
          setPastExperiences={setPastExperiences}
        />
      )}
    </div>
  );

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col px-6 py-10">
      <div
        className="mb-10 h-1 w-full overflow-hidden rounded-full bg-zinc-200"
        role="progressbar"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full bg-zinc-900 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="relative min-h-[320px] flex-1 overflow-hidden">
        {exitingIndex !== null &&
          renderStep(
            STEPS[exitingIndex],
            direction === "forward"
              ? "onboarding-step-exit"
              : "onboarding-step-exit-back"
          )}
        {renderStep(
          displayStep,
          exitingIndex !== null
            ? direction === "forward"
              ? "onboarding-step-enter"
              : "onboarding-step-enter-back"
            : "onboarding-step-enter"
        )}
      </div>

      <div className="mt-12 flex items-center justify-between gap-4 border-t border-zinc-200 pt-8">
        <Button variant="secondary" onClick={goBack}>
          {isFirst ? "Back to home" : "Back"}
        </Button>
        <Button
          variant="primary"
          onClick={goNext}
          disabled={(step === "interests" || step === "major") && !canProceed}
          iconAfter={isLast ? undefined : "→"}
        >
          {isLast ? "Finish" : "Next"}
        </Button>
      </div>
    </div>
  );
}
