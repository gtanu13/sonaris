import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterSelectProps {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
  className?: string;
}

export function FilterSelect({ label, value, options, onChange, className }: FilterSelectProps) {
  return (
    <label className={cn("relative flex items-center gap-2 rounded-lg border border-[--color-depth-border-soft] bg-[--color-depth-900]/70 px-3 py-1.5 text-[12.5px] text-[--color-ink-300]", className)}>
      <span className="text-[--color-ink-500]">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-transparent pr-4 font-medium text-[--color-ink-100] outline-none"
      >
        {options.map((opt) => (
          <option key={opt} value={opt} className="bg-[--color-depth-900] text-[--color-ink-100]">
            {opt}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 h-3.5 w-3.5 text-[--color-ink-500]" strokeWidth={2} />
    </label>
  );
}
