"use client";

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
import { TurnstileWidget } from "@/components/TurnstileWidget";
import { useOnlineStatus } from "@/lib/use-online-status";

export default function ForgotPasswordPage() {
  const { online } = useOnlineStatus();
  const [email, setEmail] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const disabled = submitting || !online;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!online) {
      setError("Connect to the internet to request a reset link.");
      return;
    }

    if (!token) {
      setError("Complete the Turnstile check to continue.");
      return;
    }

    setSubmitting(true);
    setError(null);
    setMessage(null);

    try {
      if (!email) {
        setError("Enter your email address.");
        return;
      }

      setMessage("If an account exists, a reset link will be sent shortly.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle>Reset password</CardTitle>
        <CardDescription>
          Enter your email and we&apos;ll send you a reset link.
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
              You&apos;re offline. Connect to the internet to request a reset
              link.
            </p>
          )}
          {message && (
            <p className="text-sm text-emerald-700" role="status">
              {message}
            </p>
          )}
          <Button
            type="submit"
            disabled={disabled}
            className="mt-2 w-full"
          >
            {submitting ? "Sending…" : "Send reset link"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

