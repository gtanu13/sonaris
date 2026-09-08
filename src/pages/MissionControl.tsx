import { Target, ShieldAlert, Gauge, CheckCircle2, Waves, ArrowRight, Radar, Anchor } from "lucide-react";
import { Link } from "react-router-dom";
import { MetricCard } from "@/components/ui/MetricCard";
import { Panel } from "@/components/ui/Panel";
import { Button } from "@/components/ui/Button";
import { StatusPill } from "@/components/ui/StatusPill";
import { ScoreRing } from "@/components/ui/ScoreRing";
import { DetectionStatusPill } from "@/components/detections/DetectionStatusPill";
import { demoSurvey, demoPipeline } from "@/data/demoSurvey";
import { demoDetections } from "@/data/demoDetections";
import { systemStatusTone } from "@/lib/status";
import { cn } from "@/lib/utils";

export default function MissionControl() {
  const priorityTargets = [...demoDetections]
    .sort((a, b) => b.anomalyScore - a.anomalyScore)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-xl font-semibold text-[--color-ink-100]">Mission Control</h1>
          <p className="mt-1 text-[13px] text-[--color-ink-500]">
            Survey overview for <span className="font-mono-data text-[--color-ink-300]">{demoSurvey.id}</span> — {demoSurvey.area}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Anchor className="h-3.5 w-3.5" strokeWidth={2} />
            Survey Log
          </Button>
          <Link to="/sonar-analysis">
            <Button variant="primary" size="sm">
              <Waves className="h-3.5 w-3.5" strokeWidth={2} />
              Open Sonar Analysis
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <MetricCard
          label="Total Targets"
          value={demoSurvey.totalTargets}
          icon={<Target className="h-4 w-4" strokeWidth={1.75} />}
          accent="cyan"
        />
        <MetricCard
          label="Known Objects"
          value={demoSurvey.knownObjects}
          delta={`${Math.round((demoSurvey.knownObjects / demoSurvey.totalTargets) * 100)}% of total`}
          deltaTone="flat"
          icon={<CheckCircle2 className="h-4 w-4" strokeWidth={1.75} />}
          accent="teal"
        />
        <MetricCard
          label="Unknown Anomalies"
          value={demoSurvey.unknownAnomalies}
          delta="+4 since last pass"
          deltaTone="up"
          icon={<ShieldAlert className="h-4 w-4" strokeWidth={1.75} />}
          accent="magenta"
        />
        <MetricCard
          label="High Priority"
          value={demoSurvey.highPriority}
          delta="Awaiting review"
          deltaTone="down"
          icon={<Gauge className="h-4 w-4" strokeWidth={1.75} />}
          accent="amber"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Priority targets */}
        <Panel
          eyebrow="SORTED BY ANOMALY SCORE"
          title="Priority Targets"
          className="lg:col-span-2"
          bleed
          action={
            <Link to="/detections" className="flex items-center gap-1 text-[12px] font-medium text-[--color-signal-cyan] hover:underline">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          }
        >
          <div className="divide-y divide-[--color-depth-border-soft]">
            {priorityTargets.map((t) => (
              <div key={t.id} className="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-white/[0.02]">
                <ScoreRing
                  value={Math.round(t.anomalyScore * 100)}
                  size={44}
                  tone={t.detectionStatus === "UNKNOWN ANOMALY" ? "var(--color-signal-magenta)" : "var(--color-signal-cyan)"}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono-data text-[13px] font-semibold text-[--color-ink-100]">{t.id}</span>
                    <DetectionStatusPill status={t.detectionStatus} />
                  </div>
                  <div className="mt-0.5 truncate text-[12px] text-[--color-ink-500]">
                    {t.classification} · {t.length.toFixed(2)}m × {t.width.toFixed(2)}m · depth {t.depth.toFixed(1)}m
                  </div>
                </div>
                <div className="hidden text-right sm:block">
                  <div className="text-[10px] text-[--color-ink-700]">CONFIDENCE</div>
                  <div className="font-mono-data text-[13px] text-[--color-ink-300]">{Math.round(t.confidence * 100)}%</div>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        {/* Pipeline status */}
        <Panel eyebrow="PROCESSING PIPELINE" title="Analysis Stages">
          <div className="space-y-3.5">
            {demoPipeline.map((stage, i) => (
              <div key={stage.label} className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[10px] font-semibold",
                    stage.status === "COMPLETE" &&
                      "border-[--color-signal-green]/50 bg-[--color-signal-green]/10 text-[--color-signal-green]",
                    stage.status === "PROCESSING" &&
                      "border-[--color-signal-cyan]/50 bg-[--color-signal-cyan]/10 text-[--color-signal-cyan]",
                    stage.status === "PENDING" && "border-[--color-depth-border] text-[--color-ink-700]"
                  )}
                >
                  {i + 1}
                </div>
                <span
                  className={cn(
                    "flex-1 text-[13px]",
                    stage.status === "PENDING" ? "text-[--color-ink-700]" : "text-[--color-ink-100]"
                  )}
                >
                  {stage.label}
                </span>
                {stage.status === "PROCESSING" && <StatusPill label="PROCESSING" tone="cyan" size="sm" pulse />}
                {stage.status === "COMPLETE" && (
                  <CheckCircle2 className="h-4 w-4 text-[--color-signal-green]" strokeWidth={1.75} />
                )}
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-lg border border-[--color-depth-border-soft] bg-[--color-depth-950]/60 p-3">
            <div className="flex items-center gap-2 text-[--color-ink-500]">
              <Radar className="h-3.5 w-3.5" strokeWidth={2} />
              <span className="text-[11px]">Survey status</span>
            </div>
            <div className="mt-1.5">
              <StatusPill label={demoSurvey.status} tone={systemStatusTone[demoSurvey.status]} pulse />
            </div>
          </div>
        </Panel>
      </div>

      {/* Survey meta strip */}
      <Panel eyebrow="SURVEY DETAILS" title="Mission Parameters">
        <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-[13px] sm:grid-cols-3 lg:grid-cols-6">
          <Meta label="Date" value={demoSurvey.date} />
          <Meta label="Vessel" value={demoSurvey.vessel} mono={false} />
          <Meta label="Sensor" value={demoSurvey.sensor} mono={false} />
          <Meta label="Line Spacing" value={`${demoSurvey.lineSpacingM} m`} />
          <Meta label="Area Covered" value={`${demoSurvey.areaCoveredKm2} km²`} />
          <Meta label="Human Validations" value={String(demoSurvey.humanValidations)} />
        </div>
      </Panel>
    </div>
  );
}

function Meta({ label, value, mono = true }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <div className="text-[10.5px] text-[--color-ink-500]">{label}</div>
      <div className={cn("mt-0.5 text-[--color-ink-100]", mono && "font-mono-data")}>{value}</div>
    </div>
  );
}
