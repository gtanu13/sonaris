import { useState } from "react";
import { History, GitCompareArrows, ArrowRight } from "lucide-react";
import { Panel } from "@/components/ui/Panel";
import { Button } from "@/components/ui/Button";
import { TargetCropView } from "@/components/sonar/TargetCropView";
import type { Detection } from "@/data/demoDetections";
import { surveyMemory, buildPreviousDetection } from "@/data/surveyMemory";

const matchToneStyles: Record<string, string> = {
  strong: "text-[--color-signal-green] border-[--color-signal-green]/30 bg-[--color-signal-green]/10",
  moderate: "text-[--color-signal-amber] border-[--color-signal-amber]/30 bg-[--color-signal-amber]/10",
  weak: "text-[--color-ink-500] border-[--color-depth-border] bg-white/[0.03]",
};

interface SurveyMemoryPanelProps {
  detection: Detection;
}

export function SurveyMemoryPanel({ detection }: SurveyMemoryPanelProps) {
  const [comparing, setComparing] = useState(false);
  const match = surveyMemory[detection.id];

  return (
    <Panel
      eyebrow="HISTORICAL CROSS-REFERENCE"
      title={
        <span className="flex items-center gap-2">
          <History className="h-4 w-4 text-[--color-signal-purple]" strokeWidth={1.75} />
          Survey Memory
        </span>
      }
    >
      {!match ? (
        <p className="text-[12.5px] text-[--color-ink-500]">
          No matching detections found within 25 m in previous surveys of this area.
        </p>
      ) : !comparing ? (
        <div className="space-y-3.5">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono-data text-[13px] font-semibold text-[--color-ink-100]">{detection.id}</span>
            <ArrowRight className="h-3.5 w-3.5 text-[--color-ink-700]" strokeWidth={2} />
            <span
              className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-medium ${matchToneStyles[match.matchStrength]}`}
            >
              POSSIBLE PREVIOUS DETECTION
            </span>
          </div>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-[13px] sm:grid-cols-3">
            <Row label="Survey" value={match.previousSurveyId} />
            <Row label="Date" value={match.previousDate} />
            <Row label="Distance" value={`${match.distanceMeters.toFixed(1)} m`} />
            <Row label="Previous Class" value={match.previousClassification} />
            <Row label="Previous Confidence" value={`${Math.round(match.previousConfidence * 100)}%`} />
            <Row label="Match Strength" value={match.matchStrength.toUpperCase()} />
          </dl>
          <Button variant="secondary" size="sm" onClick={() => setComparing(true)}>
            <GitCompareArrows className="h-3.5 w-3.5" strokeWidth={2} />
            Compare Surveys
          </Button>
        </div>
      ) : (
        <div className="space-y-3.5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2 text-center">
              <div className="text-[10.5px] font-medium tracking-wide text-[--color-ink-500]">
                CURRENT · {detection.id}
              </div>
              <div className="flex justify-center">
                <TargetCropView detection={detection} size={200} />
              </div>
            </div>
            <div className="space-y-2 text-center">
              <div className="text-[10.5px] font-medium tracking-wide text-[--color-ink-500]">
                {match.previousSurveyId} · {match.previousDate}
              </div>
              <div className="flex justify-center">
                <TargetCropView detection={buildPreviousDetection(detection, match)} size={200} />
              </div>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => setComparing(false)}>
            Back to Summary
          </Button>
        </div>
      )}
    </Panel>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[--color-ink-500]">{label}</dt>
      <dd className="font-mono-data text-[--color-ink-100]">{value}</dd>
    </div>
  );
}
