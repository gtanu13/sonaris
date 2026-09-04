import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Send, MapPin, Ruler, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Panel } from "@/components/ui/Panel";
import { ScoreRing } from "@/components/ui/ScoreRing";
import { EvidenceBar } from "@/components/ui/EvidenceBar";
import { DetectionStatusPill } from "@/components/detections/DetectionStatusPill";
import { RiskBadge } from "@/components/detections/RiskBadge";
import { TargetCropView } from "@/components/sonar/TargetCropView";
import { SurveyMemoryPanel } from "@/components/detections/SurveyMemoryPanel";
import { demoDetections } from "@/data/demoDetections";
import { demoSurvey } from "@/data/demoSurvey";

export default function DetectionDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const detection = demoDetections.find((d) => d.id === id);

  if (!detection) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-3 text-center">
        <p className="text-[13px] text-[--color-ink-500]">Target {id} was not found in this survey.</p>
        <Button variant="secondary" size="sm" onClick={() => navigate("/detections")}>
          Back to Detections
        </Button>
      </div>
    );
  }

  const isUnknown = detection.detectionStatus === "UNKNOWN ANOMALY";
  const idx = demoDetections.findIndex((d) => d.id === detection.id);
  const prev = demoDetections[(idx - 1 + demoDetections.length) % demoDetections.length];
  const next = demoDetections[(idx + 1) % demoDetections.length];

  return (
    <div className="space-y-5">
      {/* Breadcrumb / header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-[12px] text-[--color-ink-500]">
            <Link to="/detections" className="flex items-center gap-1 hover:text-[--color-ink-300]">
              <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} />
              Detection Intelligence
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="font-mono-data text-[--color-ink-300]">{detection.id}</span>
          </div>
          <div className="mt-1.5 flex items-center gap-2.5">
            <h1 className="font-display text-xl font-semibold text-[--color-ink-100]">{detection.id}</h1>
            <DetectionStatusPill status={detection.detectionStatus} />
            <RiskBadge risk={detection.risk} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate(`/detections/${prev.id}`)}>
            ← {prev.id}
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigate(`/detections/${next.id}`)}>
            {next.id} →
          </Button>
        </div>
      </div>

      {isUnknown && (
        <div className="rounded-lg border border-[--color-signal-magenta]/30 bg-[--color-signal-magenta]/[0.06] px-4 py-3 text-[13px] font-medium text-[--color-signal-magenta]">
          ⚠ NOT CONFIDENTLY MATCHED TO KNOWN OBJECT CLASSES
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[340px_1fr]">
        {/* Sonar crop */}
        <div className="space-y-4">
          <Panel eyebrow="SONAR CROP" title="Target Return &amp; Acoustic Shadow" bleed>
            <div className="flex justify-center p-4">
              <TargetCropView detection={detection} size={300} />
            </div>
          </Panel>
          <Panel eyebrow="ANOMALY ANALYSIS" title="Overall Score">
            <div className="flex items-center gap-4">
              <ScoreRing
                value={Math.round(detection.anomalyScore * 100)}
                size={80}
                tone={isUnknown ? "var(--color-signal-magenta)" : "var(--color-signal-cyan)"}
                label="/ 100"
              />
              <div className="space-y-1.5 text-[13px]">
                <div className="flex justify-between gap-6">
                  <span className="text-[--color-ink-500]">Known-Class Match</span>
                  <span className="font-mono-data text-[--color-ink-100]">{Math.round(detection.confidence * 100)}%</span>
                </div>
                <div className="flex justify-between gap-6">
                  <span className="text-[--color-ink-500]">Classification</span>
                  <span className="font-mono-data text-[--color-ink-100]">{detection.classification.toUpperCase()}</span>
                </div>
              </div>
            </div>
          </Panel>
        </div>

        {/* Details */}
        <div className="space-y-5">
          <Panel eyebrow="AI EVIDENCE" title="Why This Target Was Flagged">
            <p className="mb-4 text-[12.5px] text-[--color-ink-500]">
              Model evidence and features contributing to the anomaly score — not natural-language reasoning.
            </p>
            <div className="grid grid-cols-1 gap-x-8 gap-y-3.5 sm:grid-cols-2">
              <EvidenceBar label="Object Shape" value={detection.evidence.shape} tone="cyan" />
              <EvidenceBar label="Local Texture" value={detection.evidence.texture} tone="cyan" />
              <EvidenceBar label="Acoustic Contrast" value={detection.evidence.contrast} tone="cyan" />
              <EvidenceBar label="Shadow Consistency" value={detection.evidence.shadowConsistency} tone="cyan" />
              <EvidenceBar label="Seabed Context" value={detection.evidence.seabedContext} tone="cyan" />
            </div>
          </Panel>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Panel eyebrow="LOCATION" title="Geolocation" action={<MapPin className="h-4 w-4 text-[--color-ink-500]" strokeWidth={1.75} />}>
              <dl className="space-y-2.5 text-[13px]">
                <Row label="Latitude" value={`${detection.latitude.toFixed(4)}°`} />
                <Row label="Longitude" value={`${detection.longitude.toFixed(4)}°`} />
                <Row label="Depth" value={`${detection.depth.toFixed(1)} m`} />
                <Row label="Survey" value={demoSurvey.id} />
              </dl>
            </Panel>
            <Panel eyebrow="MEASUREMENTS" title="Estimated Size" action={<Ruler className="h-4 w-4 text-[--color-ink-500]" strokeWidth={1.75} />}>
              <dl className="space-y-2.5 text-[13px]">
                <Row label="Length" value={`${detection.length.toFixed(2)} m`} />
                <Row label="Width" value={`${detection.width.toFixed(2)} m`} />
                <Row label="Height" value={`${detection.height.toFixed(2)} m`} />
                <Row label="Aspect Ratio" value={(detection.length / detection.width).toFixed(2)} />
              </dl>
            </Panel>
          </div>

          <Panel eyebrow="OPERATOR ACTION" title="Human Review">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="max-w-md text-[12.5px] text-[--color-ink-500]">
                Send this target to the review queue for human classification and artificial-object confirmation.
              </p>
              <Button variant="primary" onClick={() => navigate(`/human-review?target=${detection.id}`)}>
                <Send className="h-3.5 w-3.5" strokeWidth={2} />
                Send to Human Review
              </Button>
            </div>
          </Panel>

          <SurveyMemoryPanel detection={detection} />
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-[--color-depth-border-soft] pb-2 last:border-0 last:pb-0">
      <dt className="text-[--color-ink-500]">{label}</dt>
      <dd className="font-mono-data text-[--color-ink-100]">{value}</dd>
    </div>
  );
}
