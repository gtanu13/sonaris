import { cn } from "@/lib/utils";

interface SegmentedControlProps {
  options: { value: string; label: string }[];
  value: string | null;
  onChange: (value: string) => void;
  tone?: "cyan" | "green" | "red";
  className?: string;
}

const toneActive: Record<string, string> = {
  cyan: "border-[--color-signal-cyan]/50 bg-[--color-signal-cyan]/10 text-[--color-signal-cyan]",
  green: "border-[--color-signal-green]/50 bg-[--color-signal-green]/10 text-[--color-signal-green]",
  red: "border-[--color-signal-red]/50 bg-[--color-signal-red]/10 text-[--color-signal-red]",
};

export function SegmentedControl({ options, value, onChange, tone = "cyan", className }: SegmentedControlProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              "rounded-lg border px-3.5 py-2 text-[12.5px] font-medium transition-colors",
              active
                ? toneActive[tone]
                : "border-[--color-depth-border-soft] bg-[--color-depth-900]/70 text-[--color-ink-300] hover:border-[--color-ink-500] hover:text-[--color-ink-100]"
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
