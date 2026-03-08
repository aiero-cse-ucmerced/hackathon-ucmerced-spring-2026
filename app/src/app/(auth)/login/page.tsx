"use client";

import { ViewTransitionLink } from "@/components/ViewTransitionLink";
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
import { GoogleSignInButton } from "@/components/GoogleSignInButton";
import { TurnstileWidget } from "@/components/TurnstileWidget";
import { useOnlineStatus } from "@/lib/use-online-status";
import { env } from "@/lib/env";
import { workerLogin, workerGoogleLogin } from "@/lib/worker-auth-api";

const MIN_PASSWORD_LENGTH = 8;

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
  const [token, setToken] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  const disabled = submitting || (mounted && !online);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setFieldErrors({});

    if (!online) {
      setError("Connect to the internet to login.");
      return;
    }

    if (!token) {
      setError("Complete the Turnstile check before logging in.");
      return;
    }

    const errors: { email?: string; password?: string } = {};
    if (!email.trim()) errors.email = "Email is required.";
    if (!password) {
      errors.password = "Password is required.";
    } else if (password.length < MIN_PASSWORD_LENGTH) {
      errors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setSubmitting(true);
    try {
      if (env.useWorkersApi) {
        const { token: authToken, userId } = await workerLogin({
          email,
          password,
          turnstile_token: token ?? undefined,
        });
        signIn(
          { name: email.split("@")[0] ?? "Student", email },
          authToken
        );
      } else {
        signIn({ name: email.split("@")[0] ?? "Student", email });
      }
      router.replace("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setSubmitting(false);
    }
  }

  // Render a static placeholder until mounted so server and client HTML match (avoids hydration mismatch).
  if (!mounted) {
    return (
      <Card className="vt-auth-card mx-auto w-full max-w-md border-zinc-200/80 bg-white shadow-lg shadow-zinc-200/50">
        <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 pb-4">
          <div className="space-y-1.5">
            <CardTitle className="text-xl font-semibold tracking-tight text-zinc-900">
              Login to your account
            </CardTitle>
            <CardDescription className="text-sm text-zinc-500">
              Enter your email below to login to your account.
            </CardDescription>
          </div>
          <ViewTransitionLink
            href="/signup"
            className="shrink-0 text-sm font-medium text-zinc-900 hover:text-zinc-700"
          >
            Sign Up
          </ViewTransitionLink>
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
    <Card className="vt-auth-card mx-auto w-full max-w-md border-zinc-200/80 bg-white shadow-lg shadow-zinc-200/50">
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 pb-4">
        <div className="space-y-1.5">
          <CardTitle className="text-xl font-semibold tracking-tight text-zinc-900">
            Login to your account
          </CardTitle>
          <CardDescription className="text-sm text-zinc-500">
            Enter your email below to login to your account.
          </CardDescription>
        </div>
        <ViewTransitionLink
          href="/signup"
          className="shrink-0 text-sm font-medium text-zinc-900 hover:text-zinc-700"
        >
          Sign Up
        </ViewTransitionLink>
      </CardHeader>
      <CardContent className="space-y-6">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2 auth-field-1">
            <Label htmlFor="email" className="text-sm font-medium text-zinc-900">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="m@example.com"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                if (fieldErrors.email) setFieldErrors((p) => ({ ...p, email: undefined }));
              }}
              invalid={!!fieldErrors.email}
              aria-invalid={!!fieldErrors.email}
              required
              className="h-11 text-base"
            />
            {fieldErrors.email && (
              <p className="text-sm text-red-600" role="alert">{fieldErrors.email}</p>
            )}
          </div>
          <div className="space-y-2 auth-field-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-sm font-medium text-zinc-900">
                Password
              </Label>
              <ViewTransitionLink
                href="/login/forgot-password"
                className="text-sm font-medium text-zinc-700 hover:text-zinc-900"
              >
                Forgot your password?
              </ViewTransitionLink>
            </div>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder={`At least ${MIN_PASSWORD_LENGTH} characters`}
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                if (fieldErrors.password) setFieldErrors((p) => ({ ...p, password: undefined }));
              }}
              invalid={!!fieldErrors.password}
              aria-invalid={!!fieldErrors.password}
              required
              className="h-11 text-base"
            />
            {fieldErrors.password && (
              <p className="text-sm text-red-600" role="alert">{fieldErrors.password}</p>
            )}
          </div>
          {error && (
            <p className="auth-field-3 text-sm text-red-600" role="status">
              {error}
            </p>
          )}
          {mounted && !online && !error && (
            <p className="auth-field-3 text-sm text-amber-600">
              You&apos;re offline. Connect to the internet to login.
            </p>
          )}
          <TurnstileWidget onTokenChange={setToken} />
          <Button
            type="submit"
            disabled={disabled}
            size="lg"
            className="auth-field-5 h-11 w-full text-base font-medium"
          >
            {submitting ? "Logging in…" : "Login"}
          </Button>
          {env.googleClientId ? (
            <div className="auth-field-6 flex flex-col items-center gap-2">
              <div className="relative w-full">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-zinc-200" />
                </div>
                <span className="relative flex justify-center text-xs uppercase tracking-wide text-zinc-500">
                  Or continue with
                </span>
              </div>
              <GoogleSignInButton
                clientId={env.googleClientId}
                disabled={submitting || (mounted && !online)}
                theme="outline"
                size="large"
                useOneTap
                className="w-full"
                onSuccess={async ({ idToken, email, name }) => {
                  setError(null);
                  if (!env.useWorkersApi) {
                    setError("Sign in with Google is not configured.");
                    return;
                  }
                  const { token, isNewUser } = await workerGoogleLogin(idToken);
                  signIn(
                    {
                      name: name ?? email?.split("@")[0] ?? "Student",
                      email: email ?? "",
                    },
                    token
                  );
                  router.replace(isNewUser ? "/onboarding" : "/dashboard");
                }}
                onError={(msg) => setError(msg)}
              />
            </div>
          ) : null}
        </form>
      </CardContent>
    </Card>
  );
}

