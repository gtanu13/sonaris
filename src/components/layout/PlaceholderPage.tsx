import type { LucideIcon } from "lucide-react";

interface PlaceholderPageProps {
  icon: LucideIcon;
  title: string;
  stage: string;
  description: string;
}

export function PlaceholderPage({ icon: Icon, title, stage, description }: PlaceholderPageProps) {
  return (
    <div className="flex h-full min-h-[70vh] flex-col items-center justify-center rounded-xl border border-dashed border-[--color-depth-border] text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-[--color-depth-border] bg-[--color-depth-900]">
        <Icon className="h-6 w-6 text-[--color-ink-500]" strokeWidth={1.5} />
      </div>
      <h2 className="font-display mt-4 text-lg font-semibold text-[--color-ink-100]">{title}</h2>
      <p className="mt-1.5 max-w-sm text-[13px] text-[--color-ink-500]">{description}</p>
      <span className="mt-4 rounded-full border border-[--color-depth-border] px-3 py-1 text-[10.5px] font-medium tracking-wide text-[--color-ink-700]">
        {stage}
      </span>
    </div>
  );
}
