import { cn } from "@/lib/utils";
import type { Detection } from "@/data/demoDetections";

const toneMap: Record<Detection["detectionStatus"], string> = {
  "KNOWN OBJECT": "border-[--color-signal-teal] shadow-[0_0_10px_var(--color-signal-teal)]",
  "POSSIBLE OBJECT": "border-[--color-signal-amber] shadow-[0_0_10px_var(--color-signal-amber)]",
  "UNKNOWN ANOMALY": "border-[--color-signal-magenta] shadow-[0_0_14px_var(--color-signal-magenta)]",
  "NATURAL FORMATION": "border-[--color-ink-500]",
  "NEEDS REVIEW": "border-[--color-signal-orange] shadow-[0_0_10px_var(--color-signal-orange)]",
  "HUMAN VERIFIED": "border-[--color-signal-green] shadow-[0_0_10px_var(--color-signal-green)]",
};

interface TargetMarkerProps {
  detection: Detection;
  selected: boolean;
  onSelect: () => void;
}

export function TargetMarker({ detection, selected, onSelect }: TargetMarkerProps) {
  const isUnknown = detection.detectionStatus === "UNKNOWN ANOMALY";

  return (
    <button
      onClick={onSelect}
      style={{ left: `${detection.x * 100}%`, top: `${detection.y * 100}%` }}
      className="group absolute -translate-x-1/2 -translate-y-1/2 focus-visible:z-20"
      aria-label={`Target ${detection.id}, ${detection.detectionStatus}`}
    >
      {isUnknown && (
        <span
          className={cn(
            "absolute left-1/2 top-1/2 h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full border animate-ping",
            "border-[--color-signal-magenta]/50 opacity-60"
          )}
        />
      )}
      <span
        className={cn(
          "relative flex h-4 w-4 items-center justify-center rounded-full border-2 bg-[--color-depth-950]/80 transition-transform",
          toneMap[detection.detectionStatus],
          selected ? "scale-150" : "group-hover:scale-125"
        )}
      />
      <span
        className={cn(
          "pointer-events-none absolute left-1/2 top-full mt-1.5 -translate-x-1/2 whitespace-nowrap rounded-md border border-[--color-depth-border] bg-[--color-depth-950] px-1.5 py-0.5 font-mono-data text-[10px] text-[--color-ink-300] opacity-0 transition-opacity",
          "group-hover:opacity-100",
          selected && "opacity-100"
        )}
      >
        {detection.id}
      </span>
    </button>
  );
}
