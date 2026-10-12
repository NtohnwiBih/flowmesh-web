"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

import type { AccountView, Profile } from "@/components/account-views";
import { useTheme, type ThemeMode } from "@/hooks/use-theme";

type AppContextValue = {
  workspace: string;
  setWorkspace: (v: string) => void;
  environment: string;
  setEnvironment: (v: string) => void;
  pendingIntegration: string | null;
  setPendingIntegration: (v: string | null) => void;
  accountView: AccountView | null;
  setAccountView: (v: AccountView | null) => void;
  profile: Profile;
  setProfile: (p: Profile) => void;
  theme: ThemeMode;
  setTheme: (m: ThemeMode) => void;
};

const AppContext = createContext<AppContextValue | null>(null);

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
  return ctx;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [workspace, setWorkspace] = useState("Acme Engineering");
  const [environment, setEnvironment] = useState("Production");
  const [pendingIntegration, setPendingIntegration] = useState<string | null>(null);
  const [accountView, setAccountView] = useState<AccountView | null>(null);
  const [profile, setProfile] = useState<Profile>({
    name: "Jordan Davis",
    email: "jordan@acme.dev",
    role: "Engineering Lead",
  });
  // Call useTheme once here so every consumer shares the same state.
  const { mode: theme, setMode: setTheme } = useTheme();

  const value = useMemo(
    () => ({
      workspace, setWorkspace,
      environment, setEnvironment,
      pendingIntegration, setPendingIntegration,
      accountView, setAccountView,
      profile, setProfile,
      theme, setTheme,
    }),
    [workspace, environment, pendingIntegration, accountView, profile, theme, setTheme],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}