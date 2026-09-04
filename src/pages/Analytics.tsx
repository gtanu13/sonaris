import { BarChart3, Target, CheckCircle2, ShieldAlert, Gauge, UserCheck } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { MetricCard } from "@/components/ui/MetricCard";
import { Panel } from "@/components/ui/Panel";
import { demoDetections, summarizeDetections } from "@/data/demoDetections";
import { demoSurvey } from "@/data/demoSurvey";
import { detectionDistribution, histogram, reviewAgreement } from "@/lib/analytics";
import { detectionStatusTone, toneHex } from "@/lib/status";

const chartTooltipStyle = {
  background: "var(--color-depth-950)",
  border: "1px solid var(--color-depth-border)",
  borderRadius: 8,
  fontSize: 12,
  color: "var(--color-ink-100)",
};

export default function Analytics() {
  const summary = summarizeDetections(demoDetections);
  const distribution = detectionDistribution(demoDetections);
  const anomalyHist = histogram(demoDetections, "anomalyScore");
  const confidenceHist = histogram(demoDetections, "confidence");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display flex items-center gap-2 text-xl font-semibold text-[--color-ink-100]">
          <BarChart3 className="h-5 w-5 text-[--color-signal-cyan]" strokeWidth={1.75} />
          Analytics
        </h1>
        <p className="mt-1 text-[13px] text-[--color-ink-500]">
          Survey-wide detection, anomaly, and confidence distributions for {demoSurvey.id}.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        <MetricCard
          label="Total Detections"
          value={summary.total}
          icon={<Target className="h-4 w-4" strokeWidth={1.75} />}
          accent="cyan"
        />
        <MetricCard
          label="Known Objects"
          value={summary.known}
          icon={<CheckCircle2 className="h-4 w-4" strokeWidth={1.75} />}
          accent="teal"
        />
        <MetricCard
          label="Unknown Anomalies"
          value={summary.unknown}
          icon={<ShieldAlert className="h-4 w-4" strokeWidth={1.75} />}
          accent="magenta"
        />
        <MetricCard
          label="High Priority"
          value={summary.highPriority}
          icon={<Gauge className="h-4 w-4" strokeWidth={1.75} />}
          accent="amber"
        />
        <MetricCard
          label="Human Validations"
          value={demoSurvey.humanValidations}
          icon={<UserCheck className="h-4 w-4" strokeWidth={1.75} />}
          accent="purple"
        />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <Panel eyebrow="BY STATUS" title="Detection Distribution">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={distribution} layout="vertical" margin={{ left: 8, right: 16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-depth-border-soft)" horizontal={false} />
                <XAxis type="number" allowDecimals={false} tick={{ fill: "var(--color-ink-500)", fontSize: 11 }} stroke="var(--color-depth-border)" />
                <YAxis
                  type="category"
                  dataKey="label"
                  width={130}
                  tick={{ fill: "var(--color-ink-300)", fontSize: 11 }}
                  stroke="var(--color-depth-border)"
                />
                <RechartsTooltip cursor={{ fill: "rgba(255,255,255,0.03)" }} contentStyle={chartTooltipStyle} />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {distribution.map((d) => (
                    <Cell key={d.label} fill={toneHex[detectionStatusTone[d.label as keyof typeof detectionStatusTone]]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel eyebrow="HUMAN REVIEW" title="Review Agreement">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={reviewAgreement} margin={{ top: 8, right: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-depth-border-soft)" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: "var(--color-ink-500)", fontSize: 11 }} stroke="var(--color-depth-border)" />
                <YAxis allowDecimals={false} tick={{ fill: "var(--color-ink-500)", fontSize: 11 }} stroke="var(--color-depth-border)" />
                <RechartsTooltip cursor={{ fill: "rgba(255,255,255,0.03)" }} contentStyle={chartTooltipStyle} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} fill="var(--color-signal-green)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-3 text-[11.5px] text-[--color-ink-500]">
            Illustrative aggregate of {reviewAgreement.reduce((a, b) => a + b.count, 0)} demo validations recorded to
            date. Not a live audit feed.
          </p>
        </Panel>

        <Panel eyebrow="ANOMALY SCORE" title="Score Distribution">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={anomalyHist} margin={{ top: 8, right: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-depth-border-soft)" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: "var(--color-ink-500)", fontSize: 11 }} stroke="var(--color-depth-border)" />
                <YAxis allowDecimals={false} tick={{ fill: "var(--color-ink-500)", fontSize: 11 }} stroke="var(--color-depth-border)" />
                <RechartsTooltip cursor={{ fill: "rgba(255,255,255,0.03)" }} contentStyle={chartTooltipStyle} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} fill="var(--color-signal-magenta)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel eyebrow="AI CERTAINTY" title="Confidence Distribution">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={confidenceHist} margin={{ top: 8, right: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-depth-border-soft)" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: "var(--color-ink-500)", fontSize: 11 }} stroke="var(--color-depth-border)" />
                <YAxis allowDecimals={false} tick={{ fill: "var(--color-ink-500)", fontSize: 11 }} stroke="var(--color-depth-border)" />
                <RechartsTooltip cursor={{ fill: "rgba(255,255,255,0.03)" }} contentStyle={chartTooltipStyle} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} fill="var(--color-signal-cyan)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>
    </div>
  );
}
