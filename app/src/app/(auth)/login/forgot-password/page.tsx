"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { InputOTP } from "@/components/InputOTP";
import { useOnlineStatus } from "@/lib/use-online-status";
import { env } from "@/lib/env";
import { workerForgotPassword, workerResetPassword } from "@/lib/worker-auth-api";
import { toast } from "sonner";

const MIN_PASSWORD_LENGTH = 8;
const SUPPORT_LINK = "/contact";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { online } = useOnlineStatus();
  const [step, setStep] = useState<"email" | "otp" | "password">("email");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const disabled = submitting || !online;

  async function handleSendEmail(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    if (!online) {
      setError("Connect to the internet to request a reset.");
      return;
    }
    if (!token) {
      setError("Complete the Turnstile check to continue.");
      return;
    }
    if (!email.trim()) {
      setError("Enter your email address.");
      return;
    }
    if (!env.useWorkersApi) {
      setError("Password reset is not available.");
      return;
    }
    setSubmitting(true);
    try {
      await workerForgotPassword({
        email: email.trim(),
        turnstile_token: token ?? undefined,
      });
      toast.info("Check your email", {
        description: `We sent an 8-digit code to ${email.trim()}. Enter it below.`,
      });
      setStep("otp");
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to send reset email.";
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  function handleVerifyOtp(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    if (otp.replace(/\D/g, "").length !== 8) {
      setError("Enter the 8-digit code from your email.");
      return;
    }
    setShowPasswordModal(true);
  }

  async function handleSetPassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    if (newPassword.length < MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!env.useWorkersApi) return;
    setSubmitting(true);
    try {
      await workerResetPassword({
        email: email.trim(),
        otp: otp.replace(/\D/g, ""),
        new_password: newPassword,
      });
      setShowPasswordModal(false);
      toast.success("Password updated", {
        description: "Redirecting you to the dashboard.",
      });
      router.replace("/dashboard");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Card className="mx-auto w-full max-w-md">
        <CardHeader>
          <CardTitle>Reset password</CardTitle>
          <CardDescription>
            {step === "email" && "Enter your email and we'll send you an 8-digit code."}
            {step === "otp" && "Enter the code we sent to your email."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === "email" && (
            <form className="space-y-4" onSubmit={handleSendEmail}>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="pt-1">
                <TurnstileWidget onTokenChange={setToken} />
              </div>
              {error && (
                <p className="text-sm text-red-600" role="alert">
                  {error}
                </p>
              )}
              {!online && !error && (
                <p className="text-sm text-amber-600">You're offline. Connect to the internet to request a reset.</p>
              )}
              <Button type="submit" disabled={disabled} className="mt-2 w-full">
                {submitting ? "Sending…" : "Send code"}
              </Button>
            </form>
          )}

          {step === "otp" && (
            <form className="space-y-4" onSubmit={handleVerifyOtp}>
              <p className="text-sm text-zinc-600">
                Code sent to <strong>{email}</strong>
              </p>
              <div className="space-y-2">
                <Label>8-digit code</Label>
                <InputOTP
                  value={otp}
                  onChange={setOtp}
                  disabled={disabled}
                  aria-label="8-digit verification code"
                />
              </div>
              <p className="text-sm text-zinc-500">
                Need help? <Link href={SUPPORT_LINK} className="font-medium text-zinc-900 underline hover:no-underline">Contact support</Link>.
              </p>
              {error && (
                <p className="text-sm text-red-600" role="alert">
                  {error}
                </p>
              )}
              <Button type="submit" disabled={otp.replace(/\D/g, "").length !== 8} className="mt-2 w-full">
                Continue
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

      {/* New password modal */}
      {showPasswordModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="new-password-modal-title"
        >
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 id="new-password-modal-title" className="text-lg font-semibold text-zinc-900">
              Set new password
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Enter and confirm your new password below.
            </p>
            <form className="mt-4 space-y-4" onSubmit={handleSetPassword}>
              <div className="space-y-1.5">
                <Label htmlFor="new-password">New password</Label>
                <Input
                  id="new-password"
                  type="password"
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder={`At least ${MIN_PASSWORD_LENGTH} characters`}
                  minLength={MIN_PASSWORD_LENGTH}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="confirm-password">Confirm password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  required
                />
              </div>
              {error && (
                <p className="text-sm text-red-600" role="alert">
                  {error}
                </p>
              )}
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowPasswordModal(false);
                    setError(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submitting || newPassword.length < MIN_PASSWORD_LENGTH || newPassword !== confirmPassword}
                >
                  {submitting ? "Updating…" : "Update password"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
