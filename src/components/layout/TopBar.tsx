import { Search, Bell, ChevronDown, Sparkles } from "lucide-react";
import { StatusPill } from "@/components/ui/StatusPill";
import { Button } from "@/components/ui/Button";
import { useDemoMode } from "@/lib/demoMode";

export function TopBar() {
  const { active, start } = useDemoMode();
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-[--color-depth-border-soft] bg-[--color-depth-950]/60 px-6 backdrop-blur-sm">
      <div className="flex items-center gap-5">
        <div>
          <div className="text-[10px] font-medium tracking-[0.1em] text-[--color-ink-500]">SURVEY</div>
          <div className="font-mono-data text-[13px] font-semibold text-[--color-ink-100]">SURVEY-024</div>
        </div>
        <span className="h-8 w-px bg-[--color-depth-border-soft]" />
        <div>
          <div className="text-[10px] font-medium tracking-[0.1em] text-[--color-ink-500]">AREA</div>
          <div className="text-[13px] font-medium text-[--color-ink-100]">Zone A — Bay Sector 07</div>
        </div>
        <span className="h-8 w-px bg-[--color-depth-border-soft]" />
        <StatusPill label="AI ANALYSIS COMPLETE" tone="green" size="sm" />
      </div>

      <div className="flex items-center gap-3">
        <Button variant={active ? "primary" : "outline"} size="sm" onClick={start} disabled={active}>
          <Sparkles className="h-3.5 w-3.5" strokeWidth={2} />
          {active ? "Demo Running" : "Demo Mode"}
        </Button>
        <button
          className="flex h-9 w-64 items-center gap-2 rounded-lg border border-[--color-depth-border-soft] bg-[--color-depth-900]/70 px-3 text-left text-[--color-ink-500] transition-colors hover:border-[--color-depth-border] hover:text-[--color-ink-300]"
          aria-label="Search"
        >
          <Search className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
          <span className="text-[12.5px]">Search targets, surveys, reports…</span>
          <kbd className="ml-auto rounded border border-[--color-depth-border] px-1.5 py-0.5 font-mono-data text-[10px] text-[--color-ink-700]">
            ⌘K
          </kbd>
        </button>

        <button
          className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-[--color-depth-border-soft] text-[--color-ink-500] transition-colors hover:border-[--color-depth-border] hover:text-[--color-ink-300]"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" strokeWidth={1.75} />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[--color-signal-magenta] shadow-[0_0_6px_var(--color-signal-magenta)]" />
        </button>

        <button className="flex items-center gap-2 rounded-lg border border-[--color-depth-border-soft] py-1 pl-1 pr-2.5 transition-colors hover:border-[--color-depth-border]">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-[--color-signal-purple] to-[--color-signal-cyan] font-display text-[11px] font-semibold text-[#04121a]">
            RM
          </span>
          <span className="text-[12.5px] font-medium text-[--color-ink-100]">R. Mercer</span>
          <ChevronDown className="h-3.5 w-3.5 text-[--color-ink-500]" strokeWidth={2} />
        </button>
      </div>
    </header>
  );
}
