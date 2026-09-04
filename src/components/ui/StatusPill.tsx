import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { SignalTone } from "@/lib/status";

const toneStyles: Record<SignalTone, string> = {
  cyan: "text-[--color-signal-cyan] bg-[color-mix(in_srgb,var(--color-signal-cyan)_14%,transparent)] border-[color-mix(in_srgb,var(--color-signal-cyan)_35%,transparent)]",
  teal: "text-[--color-signal-teal] bg-[color-mix(in_srgb,var(--color-signal-teal)_14%,transparent)] border-[color-mix(in_srgb,var(--color-signal-teal)_35%,transparent)]",
  purple: "text-[--color-signal-purple] bg-[color-mix(in_srgb,var(--color-signal-purple)_14%,transparent)] border-[color-mix(in_srgb,var(--color-signal-purple)_35%,transparent)]",
  magenta: "text-[--color-signal-magenta] bg-[color-mix(in_srgb,var(--color-signal-magenta)_14%,transparent)] border-[color-mix(in_srgb,var(--color-signal-magenta)_35%,transparent)]",
  green: "text-[--color-signal-green] bg-[color-mix(in_srgb,var(--color-signal-green)_14%,transparent)] border-[color-mix(in_srgb,var(--color-signal-green)_35%,transparent)]",
  amber: "text-[--color-signal-amber] bg-[color-mix(in_srgb,var(--color-signal-amber)_14%,transparent)] border-[color-mix(in_srgb,var(--color-signal-amber)_35%,transparent)]",
  orange: "text-[--color-signal-orange] bg-[color-mix(in_srgb,var(--color-signal-orange)_14%,transparent)] border-[color-mix(in_srgb,var(--color-signal-orange)_35%,transparent)]",
  red: "text-[--color-signal-red] bg-[color-mix(in_srgb,var(--color-signal-red)_14%,transparent)] border-[color-mix(in_srgb,var(--color-signal-red)_35%,transparent)]",
  neutral: "text-[--color-ink-300] bg-white/[0.03] border-[--color-depth-border]",
};

const dotToneStyles: Record<SignalTone, string> = {
  cyan: "bg-[--color-signal-cyan] shadow-[0_0_8px_var(--color-signal-cyan)]",
  teal: "bg-[--color-signal-teal] shadow-[0_0_8px_var(--color-signal-teal)]",
  purple: "bg-[--color-signal-purple] shadow-[0_0_8px_var(--color-signal-purple)]",
  magenta: "bg-[--color-signal-magenta] shadow-[0_0_8px_var(--color-signal-magenta)]",
  green: "bg-[--color-signal-green] shadow-[0_0_8px_var(--color-signal-green)]",
  amber: "bg-[--color-signal-amber] shadow-[0_0_8px_var(--color-signal-amber)]",
  orange: "bg-[--color-signal-orange] shadow-[0_0_8px_var(--color-signal-orange)]",
  red: "bg-[--color-signal-red] shadow-[0_0_8px_var(--color-signal-red)]",
  neutral: "bg-[--color-ink-500]",
};

interface StatusPillProps {
  label: string;
  tone: SignalTone;
  icon?: ReactNode;
  pulse?: boolean;
  size?: "sm" | "md";
}

export function StatusPill({ label, tone, icon, pulse, size = "md" }: StatusPillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border font-medium tracking-wide",
        size === "sm" ? "px-2 py-0.5 text-[10.5px]" : "px-2.5 py-1 text-xs",
        toneStyles[tone]
      )}
    >
      {icon ? (
        <span className="shrink-0">{icon}</span>
      ) : (
        <span className="relative flex h-1.5 w-1.5 shrink-0">
          {pulse && (
            <span
              className={cn(
                "absolute inline-flex h-full w-full animate-ping rounded-full opacity-60",
                dotToneStyles[tone]
              )}
            />
          )}
          <span className={cn("relative inline-flex h-1.5 w-1.5 rounded-full", dotToneStyles[tone])} />
        </span>
      )}
      {label}
    </span>
  );
}
