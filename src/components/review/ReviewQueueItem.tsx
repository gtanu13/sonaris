import { CheckCircle2, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Detection } from "@/data/demoDetections";
import { DetectionStatusPill } from "@/components/detections/DetectionStatusPill";

interface ReviewQueueItemProps {
  detection: Detection;
  active: boolean;
  validated: boolean;
  onSelect: () => void;
}

export function ReviewQueueItem({ detection, active, validated, onSelect }: ReviewQueueItemProps) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        "flex w-full items-center gap-3 border-l-2 px-4 py-3 text-left transition-colors",
        active
          ? "border-[--color-signal-cyan] bg-[--color-signal-cyan]/[0.06]"
          : "border-transparent hover:bg-white/[0.03]"
      )}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-mono-data text-[13px] font-semibold text-[--color-ink-100]">{detection.id}</span>
          {validated && <CheckCircle2 className="h-3.5 w-3.5 text-[--color-signal-green]" strokeWidth={2} />}
        </div>
        <div className="mt-1 flex items-center gap-2">
          <DetectionStatusPill status={validated ? "HUMAN VERIFIED" : detection.detectionStatus} size="sm" />
          <span className="font-mono-data text-[11px] text-[--color-ink-500]">
            {Math.round(detection.confidence * 100)}% conf
          </span>
        </div>
      </div>
      <ChevronRight
        className={cn("h-4 w-4 shrink-0", active ? "text-[--color-signal-cyan]" : "text-[--color-ink-700]")}
        strokeWidth={2}
      />
    </button>
  );
}
