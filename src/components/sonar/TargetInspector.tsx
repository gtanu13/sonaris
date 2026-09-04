import { Send, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ScoreRing } from "@/components/ui/ScoreRing";
import { EvidenceBar } from "@/components/ui/EvidenceBar";
import { DetectionStatusPill } from "@/components/detections/DetectionStatusPill";
import type { Detection } from "@/data/demoDetections";

interface TargetInspectorProps {
  detection: Detection | null;
  onClose: () => void;
}

export function TargetInspector({ detection, onClose }: TargetInspectorProps) {
  if (!detection) {
    return (
      <div className="flex h-full flex-col items-center justify-center px-6 text-center text-[--color-ink-500]">
        <p className="text-[13px]">Select a target marker on the sonar image to inspect its evidence and metadata.</p>
      </div>
    );
  }

  const isUnknown = detection.detectionStatus === "UNKNOWN ANOMALY";

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-[--color-depth-border-soft] px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="font-mono-data text-sm font-semibold text-[--color-ink-100]">{detection.id}</span>
          <DetectionStatusPill status={detection.detectionStatus} />
        </div>
        <button onClick={onClose} className="text-[--color-ink-500] hover:text-[--color-ink-300]" aria-label="Close inspector">
          <X className="h-4 w-4" strokeWidth={2} />
        </button>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto p-4">
        {isUnknown && (
          <div className="rounded-lg border border-[--color-signal-magenta]/30 bg-[--color-signal-magenta]/[0.06] px-3 py-2.5 text-[12px] text-[--color-signal-magenta]">
            ⚠ NOT CONFIDENTLY MATCHED TO KNOWN OBJECT CLASSES
          </div>
        )}

        <div className="flex items-center gap-4">
          <ScoreRing
            value={Math.round(detection.anomalyScore * 100)}
            tone={isUnknown ? "var(--color-signal-magenta)" : "var(--color-signal-cyan)"}
            label="SCORE"
          />
          <div className="space-y-1 text-[12.5px]">
            <div className="flex justify-between gap-4">
              <span className="text-[--color-ink-500]">Anomaly Score</span>
              <span className="font-mono-data text-[--color-ink-100]">{Math.round(detection.anomalyScore * 100)} / 100</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-[--color-ink-500]">Known-Class Match</span>
              <span className="font-mono-data text-[--color-ink-100]">{Math.round(detection.confidence * 100)}%</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-[--color-ink-500]">Classification</span>
              <span className="font-mono-data text-[--color-ink-100]">{detection.classification.toUpperCase()}</span>
            </div>
          </div>
        </div>

        <div>
          <div className="mb-2.5 text-[11px] font-medium tracking-wide text-[--color-ink-500]">AI EVIDENCE</div>
          <div className="space-y-2.5">
            <EvidenceBar label="Object Shape" value={detection.evidence.shape} tone="cyan" />
            <EvidenceBar label="Local Texture" value={detection.evidence.texture} tone="cyan" />
            <EvidenceBar label="Acoustic Contrast" value={detection.evidence.contrast} tone="cyan" />
            <EvidenceBar label="Shadow Consistency" value={detection.evidence.shadowConsistency} tone="cyan" />
            <EvidenceBar label="Seabed Context" value={detection.evidence.seabedContext} tone="cyan" />
          </div>
        </div>

        <div>
          <div className="mb-2.5 text-[11px] font-medium tracking-wide text-[--color-ink-500]">LOCATION &amp; SIZE</div>
          <dl className="grid grid-cols-2 gap-y-2 text-[12.5px]">
            <MetaField label="Latitude" value={`${detection.latitude.toFixed(4)}°`} />
            <MetaField label="Longitude" value={`${detection.longitude.toFixed(4)}°`} />
            <MetaField label="Depth" value={`${detection.depth.toFixed(1)} m`} />
            <MetaField label="Dimensions" value={`${detection.length.toFixed(2)} × ${detection.width.toFixed(2)} × ${detection.height.toFixed(2)} m`} />
          </dl>
        </div>
      </div>

      <div className="border-t border-[--color-depth-border-soft] p-3">
        <Button variant="primary" className="w-full justify-center">
          <Send className="h-3.5 w-3.5" strokeWidth={2} />
          Send to Human Review
        </Button>
      </div>
    </div>
  );
}

function MetaField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10.5px] text-[--color-ink-500]">{label}</dt>
      <dd className="font-mono-data text-[--color-ink-100]">{value}</dd>
    </div>
  );
}
