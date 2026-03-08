"use client";

import { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/Button";

const MOCK_EMAIL = "user@example.com"; // Replace with auth context when available

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
}: {
  label: string;
  description?: string;
  action: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-medium text-zinc-900">{label}</p>
        {description && (
          <p className="mt-0.5 text-sm text-zinc-500">{description}</p>
        )}
      </div>
      <div className="shrink-0">{action}</div>
    </div>
  );
}

export function SettingsContent() {
  const [email, setEmail] = useState(MOCK_EMAIL);
  const [emailFormOpen, setEmailFormOpen] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [passwordFormOpen, setPasswordFormOpen] = useState(false);
  const [passkeys, setPasskeys] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim()) return;
    setEmail(newEmail);
    setNewEmail("");
    setEmailFormOpen(false);
    setStatus({ type: "success", msg: "Email updated." });
    setTimeout(() => setStatus(null), 3000);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordFormOpen(false);
    setStatus({ type: "success", msg: "Password updated." });
    setTimeout(() => setStatus(null), 3000);
  };

  const handleSignOut = () => {
    // TODO: Clear auth token, redirect to /
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
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
                    <Button type="submit" variant="primary">
                      Save
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
              action={
                passwordFormOpen ? (
                  <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <input
                      type="password"
                      placeholder="New password"
                      className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                    />
                    <input
                      type="password"
                      placeholder="Confirm password"
                      className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                    />
                    <div className="flex gap-2">
                      <Button type="submit" variant="primary">
                        Update
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => setPasswordFormOpen(false)}
                      >
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
            <SettingsRow
              label="Passkeys"
              description="Use passkeys for passwordless sign-in."
              action={
                <Toggle checked={passkeys} onChange={setPasskeys} />
              }
            />
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
