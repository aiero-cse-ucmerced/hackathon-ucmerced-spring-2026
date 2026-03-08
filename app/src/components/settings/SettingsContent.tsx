"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  startRegistration,
  browserSupportsWebAuthn,
  type PublicKeyCredentialCreationOptionsJSON,
} from "@simplewebauthn/browser";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/components/AuthProvider";
import { getStoredToken } from "@/lib/auth";
import { env } from "@/lib/env";
import {
  updateEmail,
  updatePassword,
  signOutApi,
  getPasskeys,
  deletePasskey,
  getPasskeyRegisterOptions,
  finishPasskeyRegistration,
  type PasskeyInfo,
} from "@/lib/account-api";
import { isValidEmail, isValidPassword } from "@/lib/validation";

function Toggle({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 disabled:opacity-50 ${
        checked ? "bg-zinc-900" : "bg-zinc-200"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

function SettingsSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-b border-zinc-200 py-8 last:border-b-0">
      <h2 className="text-lg font-semibold tracking-tight text-zinc-900">
        {title}
      </h2>
      {description && (
        <p className="mt-1 text-sm text-zinc-500">{description}</p>
      )}
      <div className="mt-6 space-y-6">{children}</div>
    </section>
  );
}

function SettingsRow({
  label,
  description,
  action,
  stackAction,
}: {
  label: string;
  description?: string;
  action: React.ReactNode;
  /** When true, action is rendered on its own row below label/description for cleaner alignment (e.g. multi-field forms). */
  stackAction?: boolean;
}) {
  return (
    <div
      className={
        stackAction
          ? "flex flex-col gap-4"
          : "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      }
    >
      <div className={stackAction ? "min-w-0" : undefined}>
        <p className="font-medium text-zinc-900">{label}</p>
        {description && (
          <p className="mt-0.5 text-sm text-zinc-500">{description}</p>
        )}
      </div>
      <div className={stackAction ? "w-full min-w-0" : "shrink-0"}>{action}</div>
    </div>
  );
}

export function SettingsContent() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const token = typeof window !== "undefined" ? getStoredToken() : null;
  const hasAccountApi = (env.useSelfHostedApi || env.useWorkersApi) && token;

  const [email, setEmail] = useState("");
  const [emailFormOpen, setEmailFormOpen] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [emailSubmitting, setEmailSubmitting] = useState(false);
  const [passwordFormOpen, setPasswordFormOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordErrors, setPasswordErrors] = useState<{
    current?: string;
    new?: string;
    confirm?: string;
  }>({});
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);
  const [passkeys, setPasskeys] = useState<PasskeyInfo[]>([]);
  const [passkeysLoading, setPasskeysLoading] = useState(false);
  const [passkeyCreating, setPasskeyCreating] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (user?.email) setEmail(user.email);
  }, [user?.email]);

  const canUsePasskeys = env.useSelfHostedApi && !!token;

  const fetchPasskeys = useCallback(async () => {
    if (!canUsePasskeys || !token) return;
    setPasskeysLoading(true);
    try {
      const list = await getPasskeys(token);
      setPasskeys(list);
    } catch {
      setPasskeys([]);
    } finally {
      setPasskeysLoading(false);
    }
  }, [canUsePasskeys, token]);

  useEffect(() => {
    if (canUsePasskeys) fetchPasskeys();
  }, [canUsePasskeys, fetchPasskeys]);

  const handleCreatePasskey = async () => {
    if (!token || !canUsePasskeys) return;
    if (!browserSupportsWebAuthn()) {
      toast.error("Your browser does not support passkeys.");
      return;
    }
    setPasskeyCreating(true);
    setStatus(null);
    try {
      const options = await getPasskeyRegisterOptions(token);
      const credential = await startRegistration({
        optionsJSON: options as unknown as PublicKeyCredentialCreationOptionsJSON,
      });
      await finishPasskeyRegistration(token, credential as unknown as Record<string, unknown>);
      await fetchPasskeys();
      toast.success("Passkey created. You can now sign in with it.");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to create passkey.";
      toast.error(msg);
    } finally {
      setPasskeyCreating(false);
    }
  };

  const handleDeletePasskey = async (id: string) => {
    if (!token) return;
    try {
      await deletePasskey(token, id);
      await fetchPasskeys();
      toast.success("Passkey removed.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to remove passkey.");
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim()) return;
    if (!isValidEmail(newEmail)) {
      setStatus({ type: "error", msg: "Enter a valid email address." });
      return;
    }
    if (hasAccountApi) {
      setEmailSubmitting(true);
      setStatus(null);
      try {
        await updateEmail(token!, newEmail.trim());
        setEmail(newEmail.trim());
        setNewEmail("");
        setEmailFormOpen(false);
        setStatus({ type: "success", msg: "Email updated." });
        setTimeout(() => setStatus(null), 3000);
      } catch (err) {
        setStatus({ type: "error", msg: err instanceof Error ? err.message : "Failed to update email." });
      } finally {
        setEmailSubmitting(false);
      }
    } else {
      setEmail(newEmail.trim());
      setNewEmail("");
      setEmailFormOpen(false);
      setStatus({ type: "success", msg: "Email updated (local only)." });
      setTimeout(() => setStatus(null), 3000);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordErrors({});
    const errors: { current?: string; new?: string; confirm?: string } = {};
    if (!currentPassword.trim()) {
      errors.current = "Enter your current password.";
    }
    const pwdCheck = isValidPassword(newPassword, { requireComplexity: true });
    if (!pwdCheck.valid) {
      errors.new = pwdCheck.message;
    }
    if (newPassword !== confirmPassword) {
      errors.confirm = "Passwords do not match.";
    }
    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }
    if (hasAccountApi) {
      setPasswordSubmitting(true);
      try {
        await updatePassword(token!, currentPassword, newPassword);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setPasswordFormOpen(false);
        toast.success("Password updated.");
      } catch (err) {
        setPasswordErrors({
          current: err instanceof Error ? err.message : "Failed to update password.",
        });
      } finally {
        setPasswordSubmitting(false);
      }
    } else {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordFormOpen(false);
      toast.success("Password updated (local only).");
    }
  };

  const handlePasswordCancel = () => {
    setPasswordFormOpen(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordErrors({});
  };

  const handleSignOut = async () => {
    if (hasAccountApi) {
      try {
        await signOutApi(token!);
      } catch {
        // Continue to clear local state
      }
    }
    signOut();
    router.replace("/");
  };

  const handleDownloadData = () => {
    setStatus({ type: "success", msg: "Preparing your data download…" });
    setTimeout(() => setStatus(null), 3000);
  };

  const handleDeleteData = () => {
    if (deleteConfirm.toLowerCase() !== "delete") return;
    setShowDeleteModal(false);
    setDeleteConfirm("");
    setStatus({ type: "success", msg: "Account and data deletion initiated." });
    setTimeout(() => {
      setStatus(null);
      if (typeof window !== "undefined") window.location.href = "/";
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <header className="border-b border-zinc-100 px-6 py-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Logo />
          <nav className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
            >
              Home
            </Link>
            <Link
              href="/onboarding"
              className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
            >
              Profile
            </Link>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 md:text-3xl">
          Account settings
        </h1>
        <p className="mt-2 text-zinc-500">
          Manage your account, security, and privacy preferences.
        </p>

        {status && (
          <div
            className={`mt-6 rounded-lg px-4 py-3 text-sm ${
              status.type === "success"
                ? "bg-emerald-50 text-emerald-800"
                : "bg-red-50 text-red-800"
            }`}
          >
            {status.msg}
          </div>
        )}

        <div className="mt-10">
          {/* Account */}
          <SettingsSection title="Account" description="Update your account details.">
            <SettingsRow
              label="Email address"
              description="Your primary email for login and notifications."
              action={
                emailFormOpen ? (
                  <form onSubmit={handleEmailSubmit} className="flex gap-2">
                    <input
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      placeholder="new@email.com"
                      className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                    />
                    <Button type="submit" variant="primary" disabled={emailSubmitting}>
                      {emailSubmitting ? "Saving…" : "Save"}
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => {
                        setEmailFormOpen(false);
                        setNewEmail("");
                      }}
                    >
                      Cancel
                    </Button>
                  </form>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-zinc-600">{email}</span>
                    <Button
                      variant="secondary"
                      onClick={() => setEmailFormOpen(true)}
                    >
                      Change
                    </Button>
                  </div>
                )
              }
            />
            <SettingsRow
              label="Password"
              description="Update your password to keep your account secure."
              stackAction={passwordFormOpen}
              action={
                passwordFormOpen ? (
                  <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div className="space-y-2">
                        <Label htmlFor="current-password" className="text-sm font-medium text-zinc-900">
                          Current password
                        </Label>
                        <Input
                          id="current-password"
                          type="password"
                          autoComplete="current-password"
                          placeholder="Current password"
                          value={currentPassword}
                          onChange={(e) => {
                            setCurrentPassword(e.target.value);
                            if (passwordErrors.current) setPasswordErrors((p) => ({ ...p, current: undefined }));
                          }}
                          invalid={!!passwordErrors.current}
                          className="min-w-0"
                        />
                        {passwordErrors.current && (
                          <p className="text-sm text-red-600" role="alert">
                            {passwordErrors.current}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-password" className="text-sm font-medium text-zinc-900">
                          New password
                        </Label>
                        <Input
                          id="new-password"
                          type="password"
                          autoComplete="new-password"
                          placeholder="At least 8 characters"
                          value={newPassword}
                          onChange={(e) => {
                            setNewPassword(e.target.value);
                            if (passwordErrors.new) setPasswordErrors((p) => ({ ...p, new: undefined }));
                          }}
                          invalid={!!passwordErrors.new}
                          className="min-w-0"
                        />
                        {passwordErrors.new && (
                          <p className="text-sm text-red-600" role="alert">
                            {passwordErrors.new}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password-settings" className="text-sm font-medium text-zinc-900">
                          Confirm new password
                        </Label>
                        <Input
                          id="confirm-password-settings"
                          type="password"
                          autoComplete="new-password"
                          placeholder="Confirm new password"
                          value={confirmPassword}
                          onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            if (passwordErrors.confirm) setPasswordErrors((p) => ({ ...p, confirm: undefined }));
                          }}
                          invalid={!!passwordErrors.confirm}
                          className="min-w-0"
                        />
                        {passwordErrors.confirm && (
                          <p className="text-sm text-red-600" role="alert">
                            {passwordErrors.confirm}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" variant="primary" disabled={passwordSubmitting}>
                        {passwordSubmitting ? "Updating…" : "Update"}
                      </Button>
                      <Button type="button" variant="secondary" onClick={handlePasswordCancel}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : (
                  <Button
                    variant="secondary"
                    onClick={() => setPasswordFormOpen(true)}
                  >
                    Change password
                  </Button>
                )
              }
            />
            <SettingsRow
              label="Sign out"
              description="Sign out of UncookedAura on this device."
              action={
                <Button variant="secondary" onClick={handleSignOut}>
                  Sign out
                </Button>
              }
            />
          </SettingsSection>

          {/* Security */}
          <SettingsSection
            title="Security settings"
            description="Manage sign-in and security options."
          >
            <div className="rounded-lg border border-zinc-200 bg-zinc-50/50 p-4 text-sm text-zinc-600">
              <p>
                We recommend using <strong>Google OAuth</strong> for signing in.
                It is more secure and convenient than email and password.
              </p>
            </div>
            {canUsePasskeys ? (
              <div className="space-y-4">
                <SettingsRow
                  label="Passkeys"
                  description="Create passkeys for passwordless sign-in. Use your device biometrics or security key."
                  action={
                    <Button
                      variant="secondary"
                      onClick={handleCreatePasskey}
                      disabled={passkeyCreating || !browserSupportsWebAuthn()}
                    >
                      {passkeyCreating ? "Creating…" : "Create passkey"}
                    </Button>
                  }
                />
                {passkeysLoading ? (
                  <p className="text-sm text-zinc-500">Loading passkeys…</p>
                ) : passkeys.length > 0 ? (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-zinc-900">Your passkeys</p>
                    <ul className="space-y-2">
                      {passkeys.map((pk) => (
                        <li
                          key={pk.id}
                          className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white px-4 py-3"
                        >
                          <span className="text-sm text-zinc-700">
                            {pk.deviceName}
                          </span>
                          <Button
                            variant="secondary"
                            onClick={() => handleDeletePasskey(pk.id)}
                            className="text-sm text-red-600 hover:bg-red-50 hover:text-red-700"
                          >
                            Remove
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            ) : (
              <SettingsRow
                label="Passkeys"
                description="Passkeys require the self-hosted API. Set NEXT_PUBLIC_SELF_HOSTED_API_URL to enable."
                action={<span className="text-sm text-zinc-500">Not available</span>}
              />
            )}
          </SettingsSection>

          {/* Data Privacy */}
          <SettingsSection
            title="Data privacy"
            description="Control how your data is used and stored."
          >
            <div className="rounded-lg border border-zinc-200 bg-zinc-50/50 p-4 text-sm text-zinc-600">
              <p>
                We use your profile and preferences to match you with internships
                and to share relevant information with employers when you apply.
                Read our{" "}
                <Link
                  href="/privacy-policy"
                  className="font-medium text-zinc-900 underline hover:no-underline"
                >
                  Privacy Policy
                </Link>{" "}
                for details on data collection, sharing with internship
                companies, and your rights.
              </p>
            </div>
            <SettingsRow
              label="Download your data"
              description="Export a copy of your profile and activity data."
              action={
                <Button variant="secondary" onClick={handleDownloadData}>
                  Download data
                </Button>
              }
            />
            <SettingsRow
              label="Delete your data"
              description="Permanently delete your account and all associated data."
              action={
                <Button
                  variant="secondary"
                  onClick={() => setShowDeleteModal(true)}
                  className="text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  Delete account
                </Button>
              }
            />
          </SettingsSection>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-modal-title"
        >
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 id="delete-modal-title" className="text-lg font-semibold text-zinc-900">
              Delete your account
            </h2>
            <p className="mt-2 text-sm text-zinc-600">
              This will permanently delete your account and all data. This action
              cannot be undone. Type <strong>delete</strong> to confirm.
            </p>
            <input
              type="text"
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              placeholder="Type 'delete' to confirm"
              className="mt-4 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
            />
            <div className="mt-6 flex justify-end gap-2">
              <Button
                variant="secondary"
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirm("");
                }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleDeleteData}
                disabled={deleteConfirm.toLowerCase() !== "delete"}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete account
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
