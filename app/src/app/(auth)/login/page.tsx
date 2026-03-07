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
import { useAuth } from "@/components/AuthProvider";
import { useOnlineStatus } from "@/lib/use-online-status";

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const { online } = useOnlineStatus();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const disabled = submitting || !online;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!online) {
      setError("Connect to the internet to sign in.");
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

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle>Sign in with email</CardTitle>
        <CardDescription>
          Enter your details to access your job matches and saved listings.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>
          {error && (
            <p className="text-sm text-red-600" role="status">
              {error}
            </p>
          )}
          {!online && !error && (
            <p className="text-sm text-amber-600">
              You&apos;re offline. Connect to the internet to sign in.
            </p>
          )}
          <div className="flex items-center justify-between pt-2">
            <Button
              type="submit"
              disabled={disabled}
              className="w-full"
            >
              {submitting ? "Signing in…" : "Sign in"}
            </Button>
          </div>
        </form>
        <div className="mt-4 flex flex-col gap-1 text-sm text-zinc-600">
          <button
            type="button"
            className="text-left text-sm text-zinc-700 underline underline-offset-2"
            onClick={() => router.push("/login/forgot-password")}
          >
            Forgot password?
          </button>
          <button
            type="button"
            className="text-left text-sm text-zinc-700 underline underline-offset-2"
            onClick={() => router.push("/signup")}
          >
            Don&apos;t have an account? Sign up
          </button>
        </div>
      </CardContent>
    </Card>
  );
}

