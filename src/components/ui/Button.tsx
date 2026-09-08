import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "icon";
}

const variants: Record<string, string> = {
  primary:
    "bg-gradient-to-b from-[--color-signal-cyan] to-[#1fb8cf] text-[#00232a] font-semibold shadow-[0_0_0_1px_rgba(47,215,238,0.4),0_8px_20px_-8px_rgba(47,215,238,0.6)] hover:brightness-110 active:brightness-95",
  secondary:
    "bg-[--color-depth-800] text-[--color-ink-100] border border-[--color-depth-border] hover:border-[--color-signal-cyan]/40 hover:bg-[--color-depth-850]",
  outline:
    "bg-transparent text-[--color-ink-300] border border-[--color-depth-border] hover:text-[--color-ink-100] hover:border-[--color-ink-500]",
  ghost:
    "bg-transparent text-[--color-ink-300] hover:text-[--color-ink-100] hover:bg-white/[0.04]",
};

const sizes: Record<string, string> = {
  sm: "h-8 px-3 text-xs gap-1.5",
  md: "h-9 px-4 text-sm gap-2",
  icon: "h-9 w-9 justify-center",
};

export function Button({ variant = "secondary", size = "md", className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center rounded-lg transition-all duration-150 disabled:opacity-40 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
}
