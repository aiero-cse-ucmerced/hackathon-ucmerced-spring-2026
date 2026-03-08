"use client";

import { useRouter } from "next/navigation";
import { ViewTransitionLink } from "@/components/ViewTransitionLink";
import { useState, useCallback, useRef, useEffect } from "react";
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
import { useAuth } from "@/components/AuthProvider";
import { GoogleSignInButton } from "@/components/GoogleSignInButton";
import { useOnlineStatus } from "@/lib/use-online-status";
import { env } from "@/lib/env";
import { workerSignup, workerGoogleLogin, workerCheckEmail } from "@/lib/worker-auth-api";
import {
  isValidEmail,
  isValidPassword,
  isValidDisplayName,
  sanitizeDisplayName,
} from "@/lib/validation";

export default function SignupPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const { online } = useOnlineStatus();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [checkingEmail, setCheckingEmail] = useState(false);
  const checkEmailTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const disabled = submitting || !online || !!fieldErrors.email;

  const handleEmailBlur = useCallback(() => {
    const trimmed = email.trim();
    if (!trimmed || !env.useWorkersApi) return;
    if (!isValidEmail(trimmed)) return;

    if (checkEmailTimeoutRef.current) {
      clearTimeout(checkEmailTimeoutRef.current);
      checkEmailTimeoutRef.current = null;
    }

    checkEmailTimeoutRef.current = setTimeout(async () => {
      checkEmailTimeoutRef.current = null;
      setCheckingEmail(true);
      setFieldErrors((p) => ({ ...p, email: undefined }));
      try {
        const { exists } = await workerCheckEmail(trimmed);
        if (exists) {
          setFieldErrors((p) => ({ ...p, email: "Email already registered. Sign in instead." }));
        }
      } catch {
        // Ignore check errors; backend will validate on submit
      } finally {
        setCheckingEmail(false);
      }
    }, 400);
  }, [email]);

  const handleEmailChange = useCallback((value: string) => {
    setEmail(value);
    setFieldErrors((p) => ({ ...p, email: undefined }));
  }, []);

  useEffect(() => {
    return () => {
      if (checkEmailTimeoutRef.current) clearTimeout(checkEmailTimeoutRef.current);
    };
  }, []);

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
    const nameCheck = isValidDisplayName(name);
    if (!nameCheck.valid) errors.name = nameCheck.message;
    if (!email.trim()) errors.email = "Email is required.";
    else if (!isValidEmail(email)) errors.email = "Enter a valid email address.";
    const pwdCheck = isValidPassword(password, { requireComplexity: true });
    if (!pwdCheck.valid) errors.password = pwdCheck.message;
    if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    if (fieldErrors.email) return;

    setSubmitting(true);
    try {
      if (env.useWorkersApi) {
        const authRes = await workerSignup({
          name: sanitizeDisplayName(name),
          email: email.trim().toLowerCase(),
          password,
          turnstile_token: token ?? undefined,
        });
        signIn({ name: sanitizeDisplayName(name), email: email.trim().toLowerCase() }, authRes.token);
      } else {
        signIn({ name: sanitizeDisplayName(name), email: email.trim().toLowerCase() });
      }
      router.replace("/onboarding");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Sign up failed.";
      if (msg.toLowerCase().includes("email already") || msg.toLowerCase().includes("already registered")) {
        setError(null);
        setFieldErrors((p) => ({ ...p, email: msg }));
      } else {
        setError(msg);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="vt-auth-card mx-auto w-full max-w-md border-zinc-200/80 bg-white shadow-lg shadow-zinc-200/50">
      <CardHeader>
        <CardTitle>Create your account</CardTitle>
        <CardDescription>
          Join UncookedAura to find internships and jobs that match your major
          and profile.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1.5 auth-field-1">
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
          <div className="space-y-1.5 auth-field-2">
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
              <p id="email-error" className="text-sm text-red-600" role="alert">{fieldErrors.email}</p>
            )}
            {checkingEmail && (
              <p className="text-sm text-zinc-500">Checking…</p>
            )}
          </div>
          <div className="space-y-1.5 auth-field-3">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              placeholder="At least 8 characters, include a letter and number"
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
          <div className="auth-field-5 pt-1">
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
          {env.googleClientId ? (
            <div className="auth-field-7 mt-4 flex flex-col items-center gap-2">
              <div className="relative w-full">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-zinc-200" />
                </div>
                <span className="relative flex justify-center text-xs uppercase tracking-wide text-zinc-500">
                  Or sign up with
                </span>
              </div>
              <GoogleSignInButton
                clientId={env.googleClientId}
                disabled={submitting || !online}
                theme="outline"
                size="large"
                useOneTap
                className="w-full"
                onSuccess={async ({ idToken, email, name }) => {
                  setError(null);
                  if (!env.useWorkersApi) {
                    setError("Sign up with Google is not configured.");
                    return;
                  }
                  const { token } = await workerGoogleLogin(idToken);
                  signIn(
                    {
                      name: name ?? email?.split("@")[0] ?? "Student",
                      email: email ?? "",
                    },
                    token
                  );
                  router.replace("/onboarding");
                }}
                onError={(msg) => setError(msg)}
              />
            </div>
          ) : null}
        </form>
        <div className="mt-4 text-sm text-zinc-600">
          <ViewTransitionLink
            href="/login"
            className="text-left text-sm text-zinc-700 underline underline-offset-2"
          >
            Already have an account? Sign in
          </ViewTransitionLink>
        </div>
      </CardContent>
    </Card>
  );
}

