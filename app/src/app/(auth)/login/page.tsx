"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
import { useOnlineStatus } from "@/lib/use-online-status";

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const { online } = useOnlineStatus();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const disabled = submitting || (mounted && !online);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!online) {
      setError("Connect to the internet to login.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      if (!email || !password) {
        setError("Enter both email and password.");
        return;
      }

      signIn({ name: email.split("@")[0] ?? "Student", email });
      router.replace("/dashboard");
    } finally {
      setSubmitting(false);
    }
  }

  // Render a static placeholder until mounted so server and client HTML match (avoids hydration mismatch).
  if (!mounted) {
    return (
      <Card className="mx-auto w-full max-w-md shadow-md">
        <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 pb-4">
          <div className="space-y-1.5">
            <CardTitle className="text-xl font-semibold tracking-tight text-zinc-900">
              Login to your account
            </CardTitle>
            <CardDescription className="text-sm text-zinc-500">
              Enter your email below to login to your account.
            </CardDescription>
          </div>
          <Link
            href="/signup"
            className="shrink-0 text-sm font-medium text-zinc-900 hover:text-zinc-700"
          >
            Sign Up
          </Link>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-5" aria-busy="true" aria-label="Loading form">
            <div className="space-y-2">
              <div className="h-4 w-16 rounded bg-zinc-200" />
              <div className="h-11 rounded-md border border-zinc-300 bg-zinc-100" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-20 rounded bg-zinc-200" />
              <div className="h-11 rounded-md border border-zinc-300 bg-zinc-100" />
            </div>
            <div className="h-11 rounded-md bg-zinc-200" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-auto w-full max-w-md shadow-md">
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 pb-4">
        <div className="space-y-1.5">
          <CardTitle className="text-xl font-semibold tracking-tight text-zinc-900">
            Login to your account
          </CardTitle>
          <CardDescription className="text-sm text-zinc-500">
            Enter your email below to login to your account.
          </CardDescription>
        </div>
        <Link
          href="/signup"
          className="shrink-0 text-sm font-medium text-zinc-900 hover:text-zinc-700"
        >
          Sign Up
        </Link>
      </CardHeader>
      <CardContent className="space-y-6">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-zinc-900">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="m@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="h-11 text-base"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-sm font-medium text-zinc-900">
                Password
              </Label>
              <button
                type="button"
                onClick={() => router.push("/login/forgot-password")}
                className="text-sm font-medium text-zinc-700 hover:text-zinc-900"
              >
                Forgot your password?
              </button>
            </div>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="h-11 text-base"
            />
          </div>
          {error && (
            <p className="text-sm text-red-600" role="status">
              {error}
            </p>
          )}
          {mounted && !online && !error && (
            <p className="text-sm text-amber-600">
              You&apos;re offline. Connect to the internet to login.
            </p>
          )}
          <Button
            type="submit"
            disabled={disabled}
            size="lg"
            className="h-11 w-full text-base font-medium"
          >
            {submitting ? "Logging in…" : "Login"}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="h-11 w-full text-base font-medium"
            onClick={() => {}}
          >
            Login with Google
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

