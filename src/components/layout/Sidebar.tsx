import {
  Radar,
  Waves,
  Target,
  BrainCircuit,
  Map as MapIcon,
  ClipboardCheck,
  BarChart3,
  FileText,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Tooltip } from "@/components/ui/Tooltip";

const NAV_ITEMS = [
  { to: "/", label: "Mission Control", icon: Radar, end: true },
  { to: "/sonar-analysis", label: "Sonar Analysis", icon: Waves },
  { to: "/detections", label: "Detections", icon: Target },
  { to: "/ai-insights", label: "AI Insights", icon: BrainCircuit },
  { to: "/survey-map", label: "Survey Map", icon: MapIcon },
  { to: "/human-review", label: "Human Review", icon: ClipboardCheck },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/reports", label: "Reports", icon: FileText },
];

export function Sidebar() {
  return (
    <aside className="flex h-full w-[248px] shrink-0 flex-col border-r border-[--color-depth-border-soft] bg-[--color-depth-950]/80">
      {/* Logo / wordmark */}
      <div className="flex h-16 items-center gap-2.5 border-b border-[--color-depth-border-soft] px-5">
        <div className="relative flex h-8 w-8 items-center justify-center rounded-md border border-[--color-signal-cyan]/40 bg-[--color-signal-cyan]/10">
          <Radar className="h-4 w-4 text-[--color-signal-cyan]" strokeWidth={2} />
          <span className="absolute h-full w-full animate-[ping_3s_ease-in-out_infinite] rounded-md border border-[--color-signal-cyan]/30" />
        </div>
        <div className="leading-tight">
          <div className="font-display text-[15px] font-semibold tracking-[0.02em] text-[--color-ink-100]">
            SONARIS
          </div>
          <div className="text-[9.5px] font-medium tracking-[0.14em] text-[--color-ink-500]">
            SEAFLOOR INTELLIGENCE
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors",
                isActive
                  ? "bg-[--color-depth-850] text-[--color-ink-100]"
                  : "text-[--color-ink-500] hover:bg-white/[0.03] hover:text-[--color-ink-300]"
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full bg-[--color-signal-cyan] shadow-[0_0_8px_var(--color-signal-cyan)]" />
                )}
                <Icon
                  className={cn("h-4 w-4 shrink-0", isActive ? "text-[--color-signal-cyan]" : "text-[--color-ink-500] group-hover:text-[--color-ink-300]")}
                  strokeWidth={1.75}
                />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* System status */}
      <div className="border-t border-[--color-depth-border-soft] px-4 py-4">
        <div className="text-[10px] font-semibold tracking-[0.14em] text-[--color-ink-700]">
          SYSTEM STATUS
        </div>
        <div className="mt-2.5 space-y-1.5">
          <StatusRow label="AI Engine Online" tone="teal" />
          <StatusRow label="Sonar Pipeline Active" tone="cyan" />
        </div>
      </div>
    </aside>
  );
}

function StatusRow({ label, tone }: { label: string; tone: "teal" | "cyan" }) {
  const dotColor = tone === "teal" ? "bg-[--color-signal-teal]" : "bg-[--color-signal-cyan]";
  return (
    <Tooltip label="Nominal" side="right">
      <div className="flex w-full items-center gap-2 text-[12px] text-[--color-ink-300]">
        <span className="relative flex h-1.5 w-1.5">
          <span className={cn("absolute inline-flex h-full w-full animate-ping rounded-full opacity-50", dotColor)} />
          <span className={cn("relative inline-flex h-1.5 w-1.5 rounded-full", dotColor)} />
        </span>
        {label}
      </div>
    </Tooltip>
  );
}
