import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: ReactNode;
  unit?: string;
  delta?: string;
  deltaTone?: "up" | "down" | "flat";
  icon?: ReactNode;
  accent?: "cyan" | "teal" | "purple" | "magenta" | "amber";
}

const accentBar: Record<string, string> = {
  cyan: "bg-[--color-signal-cyan]",
  teal: "bg-[--color-signal-teal]",
  purple: "bg-[--color-signal-purple]",
  magenta: "bg-[--color-signal-magenta]",
  amber: "bg-[--color-signal-amber]",
};

const deltaColor: Record<string, string> = {
  up: "text-[--color-signal-green]",
  down: "text-[--color-signal-red]",
  flat: "text-[--color-ink-500]",
};

export function MetricCard({ label, value, unit, delta, deltaTone = "flat", icon, accent = "cyan" }: MetricCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-[--color-depth-border-soft] bg-[--color-depth-900]/70 p-4">
      <div className={cn("absolute left-0 top-0 h-full w-[3px] opacity-70", accentBar[accent])} />
      <div className="flex items-start justify-between">
        <span className="text-[11px] font-medium text-[--color-ink-500]">{label}</span>
        {icon && <span className="text-[--color-ink-500]">{icon}</span>}
      </div>
      <div className="mt-2 flex items-baseline gap-1.5">
        <span className="font-mono-data font-display text-[28px] font-semibold leading-none text-[--color-ink-100]">
          {value}
        </span>
        {unit && <span className="text-xs text-[--color-ink-500]">{unit}</span>}
      </div>
      {delta && <div className={cn("mt-1.5 text-[11px] font-medium", deltaColor[deltaTone])}>{delta}</div>}
    </div>
  );
}
