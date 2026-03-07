import { Logo } from "@/components/Logo";
import { OnboardingGuard } from "@/components/onboarding/OnboardingGuard";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";

export const metadata = {
  title: "Set up your profile – UncookedAura",
  description: "Tell us your interests, strengths, and experiences to match you with the right internships.",
};

export default function OnboardingPage() {
  return (
    <OnboardingGuard>
      <div className="min-h-screen bg-white text-zinc-900">
        <header className="border-b border-zinc-100 px-6 py-4">
          <div className="mx-auto max-w-6xl">
            <Logo />
          </div>
        </header>
        <OnboardingFlow />
      </div>
    </OnboardingGuard>
  );
}
