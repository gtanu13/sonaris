import { useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { ClipboardCheck, Sparkles, Info, ExternalLink } from "lucide-react";
import { Panel } from "@/components/ui/Panel";
import { ScoreRing } from "@/components/ui/ScoreRing";
import { EvidenceBar } from "@/components/ui/EvidenceBar";
import { DetectionStatusPill } from "@/components/detections/DetectionStatusPill";
import { RiskBadge } from "@/components/detections/RiskBadge";
import { TargetCropView } from "@/components/sonar/TargetCropView";
import { ReviewQueueItem } from "@/components/review/ReviewQueueItem";
import { TargetClassificationForm, type ValidationResult } from "@/components/review/TargetClassificationForm";
import { LearningLoopDiagram } from "@/components/review/LearningLoopDiagram";
import { demoDetections } from "@/data/demoDetections";
import { demoSurvey } from "@/data/demoSurvey";

const REVIEW_ELIGIBLE_STATUSES = new Set(["UNKNOWN ANOMALY", "NEEDS REVIEW"]);

export default function HumanReview() {
  const [searchParams] = useSearchParams();
  const queue = useMemo(
    () =>
      demoDetections
        .filter((d) => REVIEW_ELIGIBLE_STATUSES.has(d.detectionStatus))
        .sort((a, b) => b.anomalyScore - a.anomalyScore),
    []
  );

  const preselected = searchParams.get("target");
  const [selectedId, setSelectedId] = useState<string>(
    (preselected && queue.some((d) => d.id === preselected) ? preselected : queue[0]?.id) ?? ""
  );
  const [validated, setValidated] = useState<Record<string, ValidationResult>>({});

  const selected = demoDetections.find((d) => d.id === selectedId);
  const pendingCount = queue.filter((d) => !validated[d.id]).length;
  const validatedCount = Object.keys(validated).length;

  function handleValidated(id: string, result: ValidationResult) {
    setValidated((prev) => ({ ...prev, [id]: result }));
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display flex items-center gap-2 text-xl font-semibold text-[--color-ink-100]">
            <ClipboardCheck className="h-5 w-5 text-[--color-signal-cyan]" strokeWidth={1.75} />
            Human Review
          </h1>
          <p className="mt-1 text-[13px] text-[--color-ink-500]">
            AI handles obvious detections. Humans validate uncertain and unknown-anomaly targets.
          </p>
        </div>
        <div className="flex items-center gap-4 text-[12.5px]">
          <div className="text-right">
            <div className="font-mono-data text-lg font-semibold text-[--color-signal-amber]">{pendingCount}</div>
            <div className="text-[--color-ink-500]">Pending review</div>
          </div>
          <div className="h-8 w-px bg-[--color-depth-border-soft]" />
          <div className="text-right">
            <div className="font-mono-data text-lg font-semibold text-[--color-signal-green]">{validatedCount}</div>
            <div className="text-[--color-ink-500]">Validated this session</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[300px_1fr]">
        {/* Review queue */}
        <Panel eyebrow="REVIEW QUEUE" title={`${queue.length} Targets Awaiting Validation`} bleed>
          {queue.length === 0 ? (
            <div className="px-4 py-10 text-center text-[12.5px] text-[--color-ink-500]">
              No targets currently require human review.
            </div>
          ) : (
            <div className="max-h-[560px] divide-y divide-[--color-depth-border-soft] overflow-y-auto">
              {queue.map((d) => (
                <ReviewQueueItem
                  key={d.id}
                  detection={d}
                  active={d.id === selectedId}
                  validated={Boolean(validated[d.id])}
                  onSelect={() => setSelectedId(d.id)}
                />
              ))}
            </div>
          )}
        </Panel>

        {/* Review interface */}
        {!selected ? (
          <Panel>
            <div className="flex h-full min-h-[300px] flex-col items-center justify-center gap-2 text-center">
              <ClipboardCheck className="h-6 w-6 text-[--color-ink-700]" strokeWidth={1.5} />
              <p className="text-[13px] text-[--color-ink-500]">Select a target from the queue to begin review.</p>
            </div>
          </Panel>
        ) : (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[300px_1fr]">
            <div className="space-y-4">
              <Panel eyebrow="SONAR CROP" title={selected.id} bleed>
                <div className="flex justify-center p-4">
                  <TargetCropView detection={selected} size={260} />
                </div>
              </Panel>
              <Panel eyebrow="ANOMALY ANALYSIS" title="AI Assessment">
                <div className="flex items-center gap-4">
                  <ScoreRing
                    value={Math.round(selected.anomalyScore * 100)}
                    size={64}
                    tone={
                      selected.detectionStatus === "UNKNOWN ANOMALY"
                        ? "var(--color-signal-magenta)"
                        : "var(--color-signal-cyan)"
                    }
                    label="/ 100"
                  />
                  <div className="space-y-1.5 text-[12.5px]">
                    <div className="flex justify-between gap-6">
                      <span className="text-[--color-ink-500]">Confidence</span>
                      <span className="font-mono-data text-[--color-ink-100]">
                        {Math.round(selected.confidence * 100)}%
                      </span>
                    </div>
                    <div className="flex justify-between gap-6">
                      <span className="text-[--color-ink-500]">AI Guess</span>
                      <span className="font-mono-data text-[--color-ink-100]">
                        {selected.classification.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 space-y-2.5 border-t border-[--color-depth-border-soft] pt-4">
                  <EvidenceBar label="Shadow Consistency" value={selected.evidence.shadowConsistency} tone="magenta" />
                  <EvidenceBar label="Object Shape" value={selected.evidence.shape} tone="cyan" />
                </div>
              </Panel>
              <Link
                to={`/detections/${selected.id}`}
                className="flex items-center justify-center gap-1.5 rounded-lg border border-[--color-depth-border-soft] bg-[--color-depth-900]/70 py-2 text-[12px] font-medium text-[--color-ink-300] hover:border-[--color-ink-500] hover:text-[--color-ink-100]"
              >
                <ExternalLink className="h-3.5 w-3.5" strokeWidth={2} />
                Open full detection detail
              </Link>
            </div>

            <Panel
              eyebrow="OPERATOR VALIDATION"
              title="What Is This Target?"
              action={
                <div className="flex items-center gap-2">
                  <DetectionStatusPill status={selected.detectionStatus} />
                  <RiskBadge risk={selected.risk} />
                </div>
              }
            >
              <TargetClassificationForm
                key={selected.id}
                targetId={selected.id}
                initialResult={validated[selected.id]}
                onSubmit={(result) => handleValidated(selected.id, result)}
              />
              
            </Panel>
          </div>
        )}
      </div>

      {/* Stage 8 — Continuous Learning */}
      <Panel
        eyebrow="SEMI-SUPERVISED FEEDBACK LOOP"
        title={
          <span className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[--color-signal-purple]" strokeWidth={1.75} />
            Continuous Learning
          </span>
        }
      >
        <LearningLoopDiagram
          labelledCount={demoSurvey.humanValidations + validatedCount}
          unlabelledCount={2840}
          uncertainCount={pendingCount}
          validatedCount={validatedCount}
        />
        <div className="mt-4 flex items-start gap-2 rounded-lg border border-[--color-depth-border-soft] bg-[--color-depth-950]/60 px-3.5 py-2.5 text-[11.5px] text-[--color-ink-500]">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[--color-ink-500]" strokeWidth={2} />
          <p>
            Demo visualization of the semi-supervised feedback loop. Human validations here are recorded for this
            session only and do not trigger a real model retrain.
          </p>
        </div>
      </Panel>
    </div>
  );
}
