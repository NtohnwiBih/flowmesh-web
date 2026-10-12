import { useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Activity,
  BarChart3,
  Bell,
  Blocks,
  ChevronDown,
  CircleHelp,
  Cpu,
  FileStack,
  GitBranch,
  LayoutDashboard,
  Menu,
  Monitor,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Settings,
  Sun,
  Workflow,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { AccountViews } from "@/components/account-views";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Toaster } from "@/components/ui/sonner";
import { useAppShell } from "@/lib/app-shell";
import type { ThemeMode } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";

const nav = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/" },
  { label: "Workflows", icon: Workflow, to: "/workflows" },
  { label: "Execution Details", icon: Activity, to: "/execution-details" },
  { label: "Templates", icon: FileStack, to: "/templates" },
  { label: "Integrations", icon: Blocks, to: "/integrations" },
  { label: "Workers", icon: Cpu, to: "/workers" },
  { label: "Analytics", icon: BarChart3, to: "/analytics" },
  { label: "Settings", icon: Settings, to: "/settings" },
] as const;

const themeModes: { value: ThemeMode; label: string; hint: string; icon: typeof Sun }[] = [
  { value: "system", label: "System", hint: "Match device", icon: Monitor },
  { value: "light", label: "Light", hint: "Bright", icon: Sun },
  { value: "dark", label: "Dark", hint: "Low light", icon: Moon },
];

function ThemeToggle({ mode, onModeChange }: { mode: ThemeMode; onModeChange: (mode: ThemeMode) => void }) {
  const active = themeModes.find((m) => m.value === mode) ?? themeModes[0];
  const ActiveIcon = active.icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" title="Theme" aria-label={`Theme: ${active.label}`}><ActiveIcon /></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel>Theme</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={mode} onValueChange={(value: string) => { const nextMode = value as ThemeMode; if (nextMode === "system" || nextMode === "light" || nextMode === "dark") onModeChange(nextMode); }}>
          {themeModes.map((m) => <DropdownMenuRadioItem key={m.value} value={m.value}><span className="flex items-center gap-2"><m.icon className="size-3.5" />{m.label}</span><DropdownMenuShortcut className="ml-auto font-mono text-[9px]">{m.hint}</DropdownMenuShortcut></DropdownMenuRadioItem>)}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const { workspace, setWorkspace, environment, setEnvironment, profile, setProfile, accountView, setAccountView, theme, setTheme } = useAppShell();
  const [mobileNav, setMobileNav] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const activeItem = nav.find((item) => item.to === pathname) ?? nav[0];
  const profileInitials = profile.name.trim().split(/\s+/).map((word) => word[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div className="h-screen overflow-hidden bg-background text-foreground">
      <Toaster position="bottom-right" />
      <AccountViews view={accountView} onViewChange={setAccountView} profile={profile} onSaveProfile={setProfile} theme={theme} onThemeChange={setTheme} workspace={workspace} />
      <div className="flex h-full">
        <aside className={cn("app-sidebar", mobileNav ? "translate-x-0" : "-translate-x-full lg:translate-x-0", collapsed && "app-sidebar-collapsed")}>
          <div className="flex h-14 items-center gap-2 border-b border-sidebar-border px-4">
            <div className="brand-mark shrink-0"><GitBranch /></div>
            <span className={cn("font-display text-sm font-semibold", collapsed && "lg:hidden")}>FlowMesh</span>
            <span className={cn("ml-1 rounded border border-sidebar-border px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground", collapsed && "lg:hidden")}>CLOUD</span>
            <Button variant="ghost" size="icon" className="ml-auto lg:hidden" onClick={() => setMobileNav(false)}><X /></Button>
          </div>
          <div className="border-b border-sidebar-border p-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" type="button" className={cn("workspace-switcher h-auto w-full", collapsed && "lg:justify-center lg:px-0")} title={`${workspace} · ${environment}`} aria-label="Switch workspace or environment" aria-haspopup="menu"><div className="grid size-6 shrink-0 place-items-center rounded bg-primary text-[10px] font-bold text-primary-foreground">{workspace === "Acme Labs" ? "L" : "A"}</div><div className={cn("min-w-0 flex-1 text-left", collapsed && "lg:hidden")}><p className="truncate text-xs font-medium">{workspace}</p><p className="text-[10px] text-muted-foreground">{environment}</p></div><ChevronDown className={cn("size-3.5 shrink-0 text-muted-foreground", collapsed && "lg:hidden")} /></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" align="start" className="w-56">
                <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => { setWorkspace("Acme Engineering"); toast.success("Workspace switched to Acme Engineering"); }}>
                  <div className="grid size-5 place-items-center rounded bg-primary text-[9px] font-bold text-primary-foreground">A</div> Acme Engineering
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setWorkspace("Acme Labs"); toast.success("Workspace switched to Acme Labs"); }}>
                  <div className="grid size-5 place-items-center rounded bg-secondary text-[9px] font-semibold">L</div> Acme Labs
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Environment</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => { setEnvironment("Production"); toast.success("Environment set to Production"); }}>Production</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setEnvironment("Staging"); toast.success("Environment set to Staging"); }}>Staging</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <nav className="flex-1 p-2">
            <p className={cn("px-2 pb-2 pt-1 text-[9px] font-semibold uppercase text-muted-foreground", collapsed && "lg:hidden")}>Workspace</p>
            {nav.map((item) => (
              <Link key={item.label} to={item.to} title={item.label} onClick={() => setMobileNav(false)} className={cn("nav-item", activeItem.label === item.label && "nav-item-active", collapsed && "lg:relative lg:justify-center lg:px-0")}>
                <item.icon />
                <span className={cn("truncate", collapsed && "lg:hidden")}>{item.label}</span>
                {item.label === "Workers" && <span className={cn("ml-auto size-1.5 rounded-full bg-success", collapsed && "lg:absolute lg:right-2 lg:top-2 lg:ml-0")} />}
              </Link>
            ))}
          </nav>
          <div className="border-t border-sidebar-border p-3">
            <div className={cn("mb-3 rounded-md border border-sidebar-border bg-sidebar-accent/50 p-3", collapsed && "lg:hidden")}><div className="mb-2 flex items-center justify-between text-[10px]"><span className="text-muted-foreground">Monthly executions</span><span className="font-mono">68%</span></div><div className="h-1 overflow-hidden rounded-full bg-muted"><div className="h-full w-[68%] bg-primary" /></div><p className="mt-2 font-mono text-[9px] text-muted-foreground">68,204 / 100,000</p></div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" type="button" className={cn("h-auto w-full justify-start gap-2 rounded-md p-2 text-left hover:bg-sidebar-accent", collapsed && "lg:justify-center lg:p-2 lg:px-0")} title={profile.name} aria-label="Account menu" aria-haspopup="menu"><div className="grid size-7 shrink-0 place-items-center rounded-full bg-secondary text-[10px] font-semibold">{profileInitials}</div><div className={cn("min-w-0 flex-1", collapsed && "lg:hidden")}><p className="truncate text-xs font-medium">{profile.name}</p><p className="truncate text-[10px] text-muted-foreground">{profile.email}</p></div><ChevronDown className={cn("size-3 shrink-0", collapsed && "lg:hidden")} /></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" align="end" className="w-52">
                <DropdownMenuLabel>
                  <p className="truncate text-xs font-medium">{profile.name}</p>
                  <p className="truncate text-[10px] font-normal text-muted-foreground">{profile.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setAccountView("profile")}>Profile</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setAccountView("preferences")}>Preferences</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setAccountView("keys")}>API keys</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => toast.success("Signed out", { description: "This is a demo — no session was ended." })}>Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </aside>
        {mobileNav && <button className="fixed inset-0 z-30 bg-overlay lg:hidden" onClick={() => setMobileNav(false)} aria-label="Close navigation" />}

        <main className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-background px-3 sm:px-5">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="hidden lg:inline-flex" title={collapsed ? "Open sidebar" : "Close sidebar"} aria-label={collapsed ? "Open sidebar" : "Close sidebar"} aria-expanded={!collapsed} onClick={() => setCollapsed((c) => !c)}>{collapsed ? <PanelLeftOpen /> : <PanelLeftClose />}</Button>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open navigation" onClick={() => setMobileNav(true)}><Menu /></Button>
              <div>
                <p className="text-sm font-semibold">{activeItem.label === "Workflows" ? "Workflow Editor" : activeItem.label}</p>
                <p className="hidden text-[10px] text-muted-foreground sm:block">{workspace} / {environment}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <Button variant="outline" size="sm" className="hidden w-56 justify-start text-muted-foreground md:flex"><Search /> Search anything <span className="ml-auto font-mono text-[9px]">⌘ K</span></Button>
              <ThemeToggle mode={theme} onModeChange={setTheme} />
              <Button variant="ghost" size="icon" title="Help"><CircleHelp /></Button>
              <Button variant="ghost" size="icon" title="Notifications" className="relative"><Bell /><span className="absolute right-2 top-2 size-1.5 rounded-full bg-warning" /></Button>
            </div>
          </header>
          <div className="min-h-0 flex-1">{children}</div>
        </main>
      </div>
    </div>
  );
}
