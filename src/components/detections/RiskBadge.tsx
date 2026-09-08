import { cn } from "@/lib/utils";
import type { Detection } from "@/data/demoDetections";

const styles: Record<Detection["risk"], string> = {
  high: "text-[--color-signal-red] bg-[--color-signal-red]/10 border-[--color-signal-red]/30",
  medium: "text-[--color-signal-orange] bg-[--color-signal-orange]/10 border-[--color-signal-orange]/30",
  low: "text-[--color-ink-500] bg-white/[0.03] border-[--color-depth-border]",
};

const labels: Record<Detection["risk"], string> = {
  high: "High",
  medium: "Medium",
  low: "Low",
};

export function RiskBadge({ risk }: { risk: Detection["risk"] }) {
  return (
    <span className={cn("inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-medium", styles[risk])}>
      {labels[risk]}
    </span>
  );
}
