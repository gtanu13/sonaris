import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { BrainCircuit, Gauge, ShieldAlert, UserCheck, Sparkles, Info } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { MetricCard } from "@/components/ui/MetricCard";
import { Panel } from "@/components/ui/Panel";
import { EvidenceBar } from "@/components/ui/EvidenceBar";
import { ScoreRing } from "@/components/ui/ScoreRing";
import { DetectionStatusPill } from "@/components/detections/DetectionStatusPill";
import { RiskBadge } from "@/components/detections/RiskBadge";
import { demoDetections } from "@/data/demoDetections";
import { demoSurvey } from "@/data/demoSurvey";
import {
  classificationBreakdown,
  confidenceAnomalyScatter,
  confidenceByClassification,
  evidenceAverages,
  reviewAgreement,
} from "@/lib/analytics";
import { detectionStatusTone, toneHex } from "@/lib/status";

const chartTooltipStyle = {
  background: "var(--color-depth-950)",
  border: "1px solid var(--color-depth-border)",
  borderRadius: 8,
  fontSize: 12,
  color: "var(--color-ink-100)",
};

const EVIDENCE_LABELS: { key: keyof ReturnType<typeof evidenceAverages>; label: string }[] = [
  { key: "shape", label: "Object Shape" },
  { key: "texture", label: "Local Texture" },
  { key: "contrast", label: "Acoustic Contrast" },
  { key: "shadowConsistency", label: "Shadow Consistency" },
  { key: "seabedContext", label: "Seabed Context" },
];

export default function AIInsights() {
  const navigate = useNavigate();

  const unknownAnomalies = useMemo(
    () => demoDetections.filter((d) => d.detectionStatus === "UNKNOWN ANOMALY"),
    []
  );
  const knownObjects = useMemo(
    () => demoDetections.filter((d) => d.detectionStatus === "KNOWN OBJECT"),
    []
  );

  const avgConfidence = useMemo(
    () => demoDetections.reduce((sum, d) => sum + d.confidence, 0) / demoDetections.length,
    []
  );
  const avgAnomaly = useMemo(
    () => demoDetections.reduce((sum, d) => sum + d.anomalyScore, 0) / demoDetections.length,
    []
  );
  const agreementRate = useMemo(() => {
    const total = reviewAgreement.reduce((a, b) => a + b.count, 0);
    const agreed = reviewAgreement.find((r) => r.label === "Agreed with AI")?.count ?? 0;
    return total === 0 ? 0 : agreed / total;
  }, []);
  const highConfidenceUnknowns = useMemo(
    () => unknownAnomalies.filter((d) => d.anomalyScore >= 0.85).length,
    [unknownAnomalies]
  );

  const unknownEvidence = useMemo(() => evidenceAverages(unknownAnomalies), [unknownAnomalies]);
  const knownEvidence = useMemo(() => evidenceAverages(knownObjects), [knownObjects]);
  const scatter = useMemo(() => confidenceAnomalyScatter(demoDetections), []);
  const classBreakdown = useMemo(() => classificationBreakdown(demoDetections), []);
  const leastConfidentClass = useMemo(() => confidenceByClassification(demoDetections)[0], []);

  const priorityQueue = useMemo(
    () =>
      [...demoDetections]
        .filter((d) => d.detectionStatus === "UNKNOWN ANOMALY" || d.detectionStatus === "NEEDS REVIEW")
        .sort((a, b) => b.anomalyScore - a.anomalyScore)
        .slice(0, 6),
    []
  );

  const statusGrouped = new Map<string, typeof scatter>();
  for (const point of scatter) {
    const list = statusGrouped.get(point.status) ?? [];
    list.push(point);
    statusGrouped.set(point.status, list);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display flex items-center gap-2 text-xl font-semibold text-[--color-ink-100]">
          <BrainCircuit className="h-5 w-5 text-[--color-signal-cyan]" strokeWidth={1.75} />
          AI Insights
        </h1>
        <p className="mt-1 text-[13px] text-[--color-ink-500]">
          Model reasoning across {demoDetections.length} targets in {demoSurvey.id} — evidence signatures,
          classification confidence, and where human review is most needed.
        </p>
      </div>

      {/* Top metrics */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <MetricCard
          label="Avg. Model Confidence"
          value={Math.round(avgConfidence * 100)}
          unit="%"
          icon={<Gauge className="h-4 w-4" strokeWidth={1.75} />}
          accent="cyan"
        />
        <MetricCard
          label="Avg. Anomaly Score"
          value={Math.round(avgAnomaly * 100)}
          unit="%"
          icon={<ShieldAlert className="h-4 w-4" strokeWidth={1.75} />}
          accent="magenta"
        />
        <MetricCard
          label="AI / Human Agreement"
          value={Math.round(agreementRate * 100)}
          unit="%"
          icon={<UserCheck className="h-4 w-4" strokeWidth={1.75} />}
          accent="teal"
        />
        <MetricCard
          label="High-Certainty Unknowns"
          value={highConfidenceUnknowns}
          icon={<Sparkles className="h-4 w-4" strokeWidth={1.75} />}
          accent="amber"
        />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        {/* Evidence signature comparison */}
        <Panel eyebrow="MODEL EVIDENCE" title="Evidence Signature — Unknown vs. Known">
          <p className="mb-4 text-[12.5px] text-[--color-ink-500]">
            Average feature scores the model weighs when separating unknown anomalies from known objects.
          </p>
          <div className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
            <div className="space-y-3">
              <div className="text-[10.5px] font-medium tracking-wide text-[--color-signal-magenta]">
                UNKNOWN ANOMALY ({unknownAnomalies.length})
              </div>
              {EVIDENCE_LABELS.map(({ key, label }) => (
                <EvidenceBar key={key} label={label} value={unknownEvidence[key]} tone="magenta" />
              ))}
            </div>
            <div className="space-y-3">
              <div className="text-[10.5px] font-medium tracking-wide text-[--color-signal-cyan]">
                KNOWN OBJECT ({knownObjects.length})
              </div>
              {EVIDENCE_LABELS.map(({ key, label }) => (
                <EvidenceBar key={key} label={label} value={knownEvidence[key]} tone="cyan" />
              ))}
            </div>
          </div>
        </Panel>

        {/* Confidence vs anomaly scatter */}
        <Panel eyebrow="MODEL BEHAVIOR" title="Confidence vs. Anomaly Score">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 8, right: 16, bottom: 4, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-depth-border-soft)" />
                <XAxis
                  type="number"
                  dataKey="confidence"
                  name="Confidence"
                  unit="%"
                  domain={[0, 100]}
                  tick={{ fill: "var(--color-ink-500)", fontSize: 11 }}
                  stroke="var(--color-depth-border)"
                />
                <YAxis
                  type="number"
                  dataKey="anomalyScore"
                  name="Anomaly score"
                  unit="%"
                  domain={[0, 100]}
                  tick={{ fill: "var(--color-ink-500)", fontSize: 11 }}
                  stroke="var(--color-depth-border)"
                />
                <ZAxis range={[50, 50]} />
                <RechartsTooltip
                  cursor={{ strokeDasharray: "3 3", stroke: "var(--color-depth-border)" }}
                  contentStyle={chartTooltipStyle}
                  formatter={(value: number, name: string) => [`${value}%`, name]}
                  labelFormatter={() => ""}
                />
                {[...statusGrouped.entries()].map(([status, points]) => (
                  <Scatter
                    key={status}
                    name={status}
                    data={points}
                    fill={toneHex[detectionStatusTone[status as keyof typeof detectionStatusTone]]}
                  />
                ))}
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-[11.5px] text-[--color-ink-500]">
            Upper-left cluster (low confidence, high anomaly) is where the model is flagging targets it cannot
            confidently match to a known class.
          </p>
        </Panel>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_1.3fr]">
        {/* Classification breakdown */}
        <Panel eyebrow="AI CLASSIFICATION" title="Classification Breakdown">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={classBreakdown} layout="vertical" margin={{ left: 8, right: 16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-depth-border-soft)" horizontal={false} />
                <XAxis type="number" allowDecimals={false} tick={{ fill: "var(--color-ink-500)", fontSize: 11 }} stroke="var(--color-depth-border)" />
                <YAxis
                  type="category"
                  dataKey="label"
                  width={110}
                  tick={{ fill: "var(--color-ink-300)", fontSize: 11 }}
                  stroke="var(--color-depth-border)"
                />
                <RechartsTooltip cursor={{ fill: "rgba(255,255,255,0.03)" }} contentStyle={chartTooltipStyle} />
                <Bar dataKey="count" radius={[0, 4, 4, 0]} fill="var(--color-signal-purple)">
                  {classBreakdown.map((c) => (
                    <Cell key={c.label} opacity={c.label === leastConfidentClass?.label ? 1 : 0.55} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          {leastConfidentClass && (
            <div className="mt-3 flex items-start gap-2 rounded-lg border border-[--color-depth-border-soft] bg-[--color-depth-950]/60 px-3.5 py-2.5 text-[11.5px] text-[--color-ink-500]">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[--color-ink-500]" strokeWidth={2} />
              <p>
                Lowest average confidence is on <span className="font-medium text-[--color-ink-300]">{leastConfidentClass.label}</span>{" "}
                targets ({Math.round(leastConfidentClass.avgConfidence * 100)}%) — a good candidate class to
                prioritize in human review.
              </p>
            </div>
          )}
        </Panel>

        {/* Priority anomaly queue */}
        <Panel eyebrow="REQUIRES ATTENTION" title="Priority Anomaly Queue" bleed>
          {priorityQueue.length === 0 ? (
            <div className="px-4 py-10 text-center text-[12.5px] text-[--color-ink-500]">
              No unresolved anomalies — every target has a confident classification.
            </div>
          ) : (
            <div className="divide-y divide-[--color-depth-border-soft]">
              {priorityQueue.map((d) => (
                <button
                  key={d.id}
                  onClick={() => navigate(`/detections/${d.id}`)}
                  className="flex w-full items-center gap-3.5 px-4 py-3 text-left transition-colors hover:bg-white/[0.02]"
                >
                  <ScoreRing
                    value={Math.round(d.anomalyScore * 100)}
                    size={40}
                    tone={d.detectionStatus === "UNKNOWN ANOMALY" ? "var(--color-signal-magenta)" : "var(--color-signal-cyan)"}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="font-mono-data text-[13px] font-semibold text-[--color-ink-100]">{d.id}</div>
                    <div className="truncate text-[11.5px] text-[--color-ink-500]">
                      AI guess: {d.classification} · {Math.round(d.confidence * 100)}% confidence
                    </div>
                  </div>
                  <div className="hidden sm:block">
                    <DetectionStatusPill status={d.detectionStatus} size="sm" />
                  </div>
                  <RiskBadge risk={d.risk} />
                </button>
              ))}
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
}
