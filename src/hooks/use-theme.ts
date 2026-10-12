import { useEffect, useState } from "react";

export type ThemeMode = "system" | "light" | "dark";

export function useTheme() {
  const [mode, setMode] = useState<ThemeMode | null>(null);
  useEffect(() => {
    const stored = localStorage.getItem("flowmesh-theme");
    setMode(stored === "light" || stored === "dark" ? stored : "system");
  }, []);
  useEffect(() => {
    if (!mode) return;
    const query = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => document.documentElement.classList.toggle("dark", mode === "dark" || (mode === "system" && query.matches));
    apply();
    localStorage.setItem("flowmesh-theme", mode);
    if (mode !== "system") return;
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, [mode]);
  return { mode: mode ?? "system", setMode };
}