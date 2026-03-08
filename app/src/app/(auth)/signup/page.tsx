"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
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
import { Select } from "@/components/ui/select";
import { TurnstileWidget } from "@/components/TurnstileWidget";
import { useAuth } from "@/components/AuthProvider";
import { useOnlineStatus } from "@/lib/use-online-status";

const MAJORS = ["CSE", "CS", "Applied Math", "Others"] as const;
const MIN_PASSWORD_LENGTH = 8;

export default function SignupPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const { online } = useOnlineStatus();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [major, setMajor] = useState<(typeof MAJORS)[number] | "">("");
  const [token, setToken] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    major?: string;
  }>({});

  const disabled = submitting || !online;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setFieldErrors({});

    if (!online) {
      setError("Connect to the internet to sign up.");
      return;
    }

    if (!token) {
      setError("Complete the Turnstile check before signing up.");
      return;
    }

    const errors: typeof fieldErrors = {};
    if (!name.trim()) errors.name = "Name is required.";
    if (!email.trim()) errors.email = "Email is required.";
    if (!password) {
      errors.password = "Password is required.";
    } else if (password.length < MIN_PASSWORD_LENGTH) {
      errors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
    }
    if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }
    if (!major) errors.major = "Select your major.";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setSubmitting(true);
    try {
      signIn({ name, email, major });
      router.replace("/onboarding");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle>Create your account</CardTitle>
        <CardDescription>
          Join UncookedAura to find internships and jobs that match your major
          and profile.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                if (fieldErrors.name) setFieldErrors((p) => ({ ...p, name: undefined }));
              }}
              invalid={!!fieldErrors.name}
              aria-invalid={!!fieldErrors.name}
              required
            />
            {fieldErrors.name && (
              <p className="text-sm text-red-600" role="alert">{fieldErrors.name}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                if (fieldErrors.email) setFieldErrors((p) => ({ ...p, email: undefined }));
              }}
              invalid={!!fieldErrors.email}
              aria-invalid={!!fieldErrors.email}
              required
            />
            {fieldErrors.email && (
              <p className="text-sm text-red-600" role="alert">{fieldErrors.email}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              placeholder={`At least ${MIN_PASSWORD_LENGTH} characters`}
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                if (fieldErrors.password) setFieldErrors((p) => ({ ...p, password: undefined }));
              }}
              invalid={!!fieldErrors.password}
              aria-invalid={!!fieldErrors.password}
              required
            />
            {fieldErrors.password && (
              <p className="text-sm text-red-600" role="alert">{fieldErrors.password}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="confirm-password">Confirm password</Label>
            <Input
              id="confirm-password"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) => {
                setConfirmPassword(event.target.value);
                if (fieldErrors.confirmPassword) setFieldErrors((p) => ({ ...p, confirmPassword: undefined }));
              }}
              invalid={!!fieldErrors.confirmPassword}
              aria-invalid={!!fieldErrors.confirmPassword}
              required
            />
            {fieldErrors.confirmPassword && (
              <p className="text-sm text-red-600" role="alert">{fieldErrors.confirmPassword}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="major">Major</Label>
            <Select
              id="major"
              value={major}
              onChange={(event) => {
                setMajor(event.target.value as (typeof MAJORS)[number]);
                if (fieldErrors.major) setFieldErrors((p) => ({ ...p, major: undefined }));
              }}
              invalid={!!fieldErrors.major}
              aria-invalid={!!fieldErrors.major}
              required
            >
              <option value="" disabled>
                Select your major
              </option>
              {MAJORS.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </Select>
            {fieldErrors.major && (
              <p className="text-sm text-red-600" role="alert">{fieldErrors.major}</p>
            )}
          </div>
          <div className="pt-1">
            <TurnstileWidget onTokenChange={setToken} />
          </div>
          {error && (
            <p className="text-sm text-red-600" role="status">
              {error}
            </p>
          )}
          {!online && !error && (
            <p className="text-sm text-amber-600">
              You&apos;re offline. Connect to the internet to sign up.
            </p>
          )}
          <Button
            type="submit"
            disabled={disabled}
            className="mt-2 w-full"
          >
            {submitting ? "Signing up…" : "Sign up"}
          </Button>
        </form>
        <div className="mt-4 text-sm text-zinc-600">
          <button
            type="button"
            className="text-left text-sm text-zinc-700 underline underline-offset-2"
            onClick={() => router.push("/login")}
          >
            Already have an account? Sign in
          </button>
        </div>
      </CardContent>
    </Card>
  );
}

