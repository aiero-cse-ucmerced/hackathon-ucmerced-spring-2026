"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type AuthUser = {
  name: string;
  email: string;
  major?: string;
} | null;

const TOKEN_KEY = "uncookedaura_token";

type AuthContextValue = {
  user: AuthUser;
  loading: boolean;
  /** Sign in with user and optional token (from Worker login/signup). Token is stored for API calls. */
  signIn: (user: NonNullable<AuthUser>, token?: string) => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("uncookedaura:user");
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      // Ignore storage errors in restricted environments.
    } finally {
      setLoading(false);
    }
  }, []);

  const persistToken = (t: string | undefined) => {
    try {
      if (t) window.localStorage.setItem(TOKEN_KEY, t);
      else window.localStorage.removeItem(TOKEN_KEY);
    } catch {
      // Ignore.
    }
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      signIn(next, token) {
        setUser(next);
        try {
          window.localStorage.setItem(
            "uncookedaura:user",
            JSON.stringify(next),
          );
          persistToken(token);
        } catch {
          // Ignore storage errors.
        }
      },
      signOut() {
        setUser(null);
        try {
          window.localStorage.removeItem("uncookedaura:user");
          window.localStorage.removeItem(TOKEN_KEY);
        } catch {
          // Ignore storage errors.
        }
      },
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}

