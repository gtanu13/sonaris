import { cn } from "@/lib/utils";

interface TabsProps {
  tabs: string[];
  active: string;
  onChange: (tab: string) => void;
  className?: string;
}

export function Tabs({ tabs, active, onChange, className }: TabsProps) {
  return (
    <div className={cn("inline-flex items-center gap-1 rounded-lg border border-[--color-depth-border-soft] bg-[--color-depth-950]/60 p-1", className)}>
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={cn(
            "relative rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
            active === tab
              ? "bg-[--color-depth-800] text-[--color-ink-100] shadow-[inset_0_0_0_1px_var(--color-depth-border)]"
              : "text-[--color-ink-500] hover:text-[--color-ink-300]"
          )}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
