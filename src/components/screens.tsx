import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  Activity,
  Bot,
  Boxes,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Gauge,
  Plus,
  Sparkles,
  Workflow,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useAppShell } from "@/lib/app-shell";
import { integrations, integrationCategories, initials } from "@/lib/integrations";
import { cn } from "@/lib/utils";

export const executions = [
  { id: "exec_9Jv3Q", workflow: "Support intake routing", status: "Succeeded", duration: "1.84s", time: "2m ago" },
  { id: "exec_9Jv2K", workflow: "Customer enrichment", status: "Succeeded", duration: "3.12s", time: "8m ago" },
  { id: "exec_9JuY7", workflow: "Invoice reconciliation", status: "Running", duration: "14.2s", time: "14m ago" },
  { id: "exec_9JtP1", workflow: "Churn risk monitor", status: "Failed", duration: "6.41s", time: "27m ago" },
];

export const screenTitles: Record<string, [string, string]> = {
  Dashboard: ["System overview", "Monitor workflows, executions, and worker health."],
  Workflows: ["Workflows", "Build and manage your automated processes."],
  "Execution Details": ["Execution details", "Inspect every step, input, and output for a single run."],
  Templates: ["Workflow templates", "Start faster with production-ready patterns."],
  Integrations: ["Integrations", "Connect the services your workflows depend on."],
  Workers: ["Worker fleet", "Observe execution capacity across every region."],
  Analytics: ["Analytics", "Understand reliability, volume, and latency."],
  Settings: ["Workspace settings", "Manage environments, variables, and workspace preferences."],
};

export function ScreenFrame({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  const navigate = useNavigate();
  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-semibold">{title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          </div>
          <Button onClick={() => navigate({ to: "/workflows" })}>
            <Plus /> New workflow
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Overview({ variant }: { variant: "Dashboard" | "Workers" | "Analytics" }) {
  const navigate = useNavigate();
  const stats =
    variant === "Workers"
      ? [["Healthy workers", "12", "+2 this week"], ["Available slots", "84", "of 120"], ["Queue depth", "18", "Normal"], ["Avg. utilization", "62.4%", "-3.2%"]]
      : [["Executions", "68.2k", "+12.4%"], ["Success rate", "99.42%", "+0.18%"], ["Active workflows", "24", "+3"], ["P95 latency", "842ms", "-126ms"]];
  return (
    <>
      <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(([label, value, change], index) => (
          <div className="metric-card" key={label}>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{label}</span>
              {index === 0 ? <Activity className="size-4 text-primary" /> : index === 1 ? <CheckCircle2 className="size-4 text-success" /> : index === 2 ? <Workflow className="size-4 text-info" /> : <Gauge className="size-4 text-warning" />}
            </div>
            <p className="mt-4 font-mono text-2xl font-semibold">{value}</p>
            <p className="mt-1 text-[10px] text-success">
              {change} <span className="text-muted-foreground">vs last month</span>
            </p>
          </div>
        ))}
      </div>
      <div className="mb-6 grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <section className="panel">
          <div className="panel-header">
            <div>
              <h2>Execution volume</h2>
              <p>Last 14 days</p>
            </div>
            <button className="range-select">14 days <ChevronDown /></button>
          </div>
          <div className="chart-area">
            <div className="chart-grid">{[0, 1, 2, 3].map((i) => <span key={i} />)}</div>
            <div className="bars">{[38, 52, 44, 66, 58, 72, 49, 76, 83, 68, 89, 74, 92, 86].map((height, i) => <div key={i} className="bar-track"><div className="bar" style={{ height: `${height}%` }} /></div>)}</div>
          </div>
        </section>
        <section className="panel">
          <div className="panel-header">
            <div>
              <h2>System health</h2>
              <p>All regions operational</p>
            </div>
            <span className="status-live">Healthy</span>
          </div>
          <div className="space-y-1 p-4">
            {[["us-east-1", "42ms", 99], ["eu-west-3", "68ms", 96], ["ap-southeast-2", "104ms", 91]].map(([region, latency, width]) => (
              <div className="health-row" key={String(region)}>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-success" />{region}</span>
                  <span className="font-mono text-[10px] text-muted-foreground">{latency}</span>
                </div>
                <div className="mt-2 h-1 overflow-hidden rounded bg-muted"><div className="h-full bg-success" style={{ width: `${width}%` }} /></div>
              </div>
            ))}
          </div>
        </section>
      </div>
      <section className="panel">
        <div className="panel-header">
          <div>
            <h2>Recent executions</h2>
            <p>Live across all environments</p>
          </div>
          <Button variant="ghost" size="sm">View all</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead><tr><th>Execution ID</th><th>Workflow</th><th>Status</th><th>Duration</th><th>Started</th></tr></thead>
            <tbody>
              {executions.map((run) => (
                <tr key={run.id} onClick={() => navigate({ to: "/execution-details" })}>
                  <td className="font-mono text-primary">{run.id}</td>
                  <td className="font-medium">{run.workflow}</td>
                  <td><span className={cn("run-status", run.status === "Failed" ? "run-failed" : run.status === "Running" ? "run-running" : "run-success")}><span />{run.status}</span></td>
                  <td className="font-mono text-muted-foreground">{run.duration}</td>
                  <td className="text-muted-foreground">{run.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

export function TemplateGrid() {
  const navigate = useNavigate();
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {[["AI support triage", "Classify and route incoming support requests", Sparkles, "5 nodes"], ["Data enrichment", "Enrich new records from external sources", Zap, "7 nodes"], ["Scheduled ETL", "Transform and sync data on a schedule", Clock3, "9 nodes"], ["Incident response", "Coordinate alerts across engineering teams", Activity, "8 nodes"], ["Content moderation", "Score, review, and route user content", Bot, "6 nodes"], ["Webhook fan-out", "Reliably deliver events to many endpoints", Boxes, "4 nodes"]].map(([name, desc, Icon, nodes]) => {
        const I = Icon as typeof Sparkles;
        return (
          <button className="template-card" onClick={() => navigate({ to: "/workflows" })} key={String(name)}>
            <div className="template-icon"><I /></div>
            <h3>{String(name)}</h3>
            <p>{String(desc)}</p>
            <div><span className="font-mono">{String(nodes)}</span><span>Use template →</span></div>
          </button>
        );
      })}
    </div>
  );
}

export function IntegrationGrid() {
  const navigate = useNavigate();
  const { setPendingIntegration } = useAppShell();
  const [filter, setFilter] = useState<string>("All");
  const [connected, setConnected] = useState<Record<string, boolean>>(() => Object.fromEntries(integrations.map((i) => [i.key, i.connected])));
  const list = integrations.filter((i) => filter === "All" || i.category === filter);
  return (
    <>
      <div className="mb-5 flex flex-wrap gap-2">
        {["All", ...integrationCategories].map((c) => (
          <Button key={c} size="sm" variant={filter === c ? "default" : "outline"} onClick={() => setFilter(c)}>{c}</Button>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {list.map((item) => {
          const on = connected[item.key];
          return (
            <div className="panel flex flex-col gap-3 p-4" key={item.key}>
              <div className="flex items-start gap-3">
                <div className="integration-logo shrink-0">{initials(item.name)}</div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold">{item.name}</h3>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
                <span className={cn("mt-1 size-2 shrink-0 rounded-full", on ? "bg-success" : "bg-muted-foreground")} />
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] uppercase text-muted-foreground">{item.category}</span>
                <div className="flex gap-1.5">
                  <Button size="sm" variant="outline" onClick={() => { setConnected((s) => ({ ...s, [item.key]: !on })); toast.success(on ? `${item.name} disconnected` : `${item.name} connected`); }}>{on ? "Disconnect" : "Connect"}</Button>
                  <Button size="sm" disabled={!on} onClick={() => { setPendingIntegration(item.key); navigate({ to: "/workflows" }); }}><Plus /> Add to workflow</Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export function SettingsPanel() {
  const { workspace, environment } = useAppShell();
  return (
    <div className="panel max-w-3xl">
      <div className="panel-header">
        <div>
          <h2>General</h2>
          <p>Workspace-level configuration</p>
        </div>
      </div>
      <div className="divide-y divide-border">
        {[["Workspace name", workspace], ["Default environment", environment], ["Execution retention", "30 days"], ["Timezone", "UTC"]].map(([label, value]) => (
          <div className="settings-row" key={label}>
            <div>
              <p>{label}</p>
              <span>Used across FlowMesh</span>
            </div>
            <button>{value}<ChevronDown /></button>
          </div>
        ))}
      </div>
      <div className="flex justify-end border-t border-border p-4"><Button>Save changes</Button></div>
    </div>
  );
}

export function ExecutionDetails() {
  const steps = [
    ["Order webhook", "Trigger", "18ms"],
    ["Fetch customer", "HTTP Request", "264ms"],
    ["Classify intent", "AI Classifier", "1.42s"],
    ["High priority?", "Condition", "3ms"],
    ["Create incident", "Action", "137ms"],
  ];
  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_22rem]">
      <section className="panel">
        <div className="panel-header">
          <div>
            <h2>Execution trace</h2>
            <p>exec_9Jv3Q · Support intake routing</p>
          </div>
          <span className="run-status run-success"><span />Succeeded in 1.84s</span>
        </div>
        <div className="p-4 sm:p-6">
          {steps.map(([name, kind, duration], index) => (
            <div className="trace-step" key={name}>
              <div className="trace-line"><CheckCircle2 /></div>
              <div className="flex min-w-0 flex-1 items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium">{name}</p>
                  <span className="text-[10px] text-muted-foreground">{kind}</span>
                </div>
                <span className="font-mono text-[10px] text-muted-foreground">{duration}</span>
              </div>
              {index < steps.length - 1 && <div className="trace-connector" />}
            </div>
          ))}
        </div>
      </section>
      <section className="panel self-start">
        <div className="panel-header">
          <div>
            <h2>Step output</h2>
            <p>Classify intent</p>
          </div>
        </div>
        <div className="p-4">
          <div className="mb-4 grid grid-cols-2 gap-3">
            <div className="detail-stat"><span>Status</span><strong className="text-success">Succeeded</strong></div>
            <div className="detail-stat"><span>Attempt</span><strong>1 of 3</strong></div>
          </div>
          <pre className="execution-code">{`{\n  "category": "urgent",\n  "confidence": 0.94,\n  "model": "classifier-v2",\n  "tokens": 286\n}`}</pre>
        </div>
      </section>
    </div>
  );
}
