import { cn } from "@/lib/utils";

interface EvidenceBarProps {
  label: string;
  value: number; // 0–1
  tone?: "cyan" | "magenta" | "teal" | "amber";
}

const toneBar: Record<string, string> = {
  cyan: "bg-[--color-signal-cyan]",
  magenta: "bg-[--color-signal-magenta]",
  teal: "bg-[--color-signal-teal]",
  amber: "bg-[--color-signal-amber]",
};

export function EvidenceBar({ label, value, tone = "cyan" }: EvidenceBarProps) {
  const pct = Math.round(value * 100);
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-[12px]">
        <span className="text-[--color-ink-300]">{label}</span>
        <span className="font-mono-data text-[--color-ink-100]">{pct}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[--color-depth-800]">
        <div
          className={cn("h-full rounded-full transition-[width] duration-500", toneBar[tone])}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
