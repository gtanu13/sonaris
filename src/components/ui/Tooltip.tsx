import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TooltipProps {
  label: string;
  children: ReactNode;
  side?: "right" | "bottom" | "top";
}

export function Tooltip({ label, children, side = "right" }: TooltipProps) {
  const [open, setOpen] = useState(false);

  const positions: Record<string, string> = {
    right: "left-full top-1/2 ml-2 -translate-y-1/2",
    bottom: "top-full left-1/2 mt-2 -translate-x-1/2",
    top: "bottom-full left-1/2 mb-2 -translate-x-1/2",
  };

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {children}
      {open && (
        <span
          role="tooltip"
          className={cn(
            "pointer-events-none absolute z-50 whitespace-nowrap rounded-md border border-[--color-depth-border] bg-[--color-depth-950] px-2 py-1 text-[11px] font-medium text-[--color-ink-100] shadow-lg",
            positions[side]
          )}
        >
          {label}
        </span>
      )}
    </span>
  );
}
