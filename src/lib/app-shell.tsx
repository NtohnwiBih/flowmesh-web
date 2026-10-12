import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

import type { AccountView, Profile } from "@/components/account-views";
import { useTheme, type ThemeMode } from "@/hooks/use-theme";

type AppShellState = {
  workspace: string;
  setWorkspace: (workspace: string) => void;
  environment: string;
  setEnvironment: (environment: string) => void;
  profile: Profile;
  setProfile: (profile: Profile) => void;
  accountView: AccountView | null;
  setAccountView: (view: AccountView | null) => void;
  theme: ThemeMode;
  setTheme: (mode: ThemeMode) => void;
  pendingIntegration: string | null;
  setPendingIntegration: (key: string | null) => void;
};

const AppShellContext = createContext<AppShellState | null>(null);

export function AppShellProvider({ children }: { children: ReactNode }) {
  const [workspace, setWorkspace] = useState("Acme Engineering");
  const [environment, setEnvironment] = useState("Production");
  const [profile, setProfile] = useState<Profile>({ name: "Jordan Davis", email: "jordan@acme.dev", role: "Engineering Lead" });
  const [accountView, setAccountView] = useState<AccountView | null>(null);
  const [pendingIntegration, setPendingIntegration] = useState<string | null>(null);
  const { mode: theme, setMode: setTheme } = useTheme();

  const value = useMemo<AppShellState>(
    () => ({
      workspace,
      setWorkspace,
      environment,
      setEnvironment,
      profile,
      setProfile,
      accountView,
      setAccountView,
      theme,
      setTheme,
      pendingIntegration,
      setPendingIntegration,
    }),
    [workspace, environment, profile, accountView, theme, setTheme, pendingIntegration],
  );

  return <AppShellContext.Provider value={value}>{children}</AppShellContext.Provider>;
}

export function useAppShell() {
  const ctx = useContext(AppShellContext);
  if (!ctx) throw new Error("useAppShell must be used inside AppShellProvider");
  return ctx;
}
