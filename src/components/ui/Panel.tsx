import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PanelProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  title?: ReactNode;
  eyebrow?: ReactNode;
  action?: ReactNode;
  bleed?: boolean;
}

export function Panel({ title, eyebrow, action, bleed, className, children, ...props }: PanelProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-[--color-depth-border-soft] bg-[--color-depth-900]/70 shadow-[--shadow-panel]",
        className
      )}
      {...props}
    >
      {(title || eyebrow || action) && (
        <div className="flex items-center justify-between gap-3 border-b border-[--color-depth-border-soft] px-4 py-3">
          <div>
            {eyebrow && (
              <div className="text-[10.5px] font-medium tracking-wide text-[--color-ink-500]">{eyebrow}</div>
            )}
            {title && <h3 className="font-display text-sm font-semibold text-[--color-ink-100]">{title}</h3>}
          </div>
          {action}
        </div>
      )}
      <div className={cn(!bleed && "p-4")}>{children}</div>
    </div>
  );
}
