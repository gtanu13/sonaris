import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ArrowUpDown, Target as TargetIcon } from "lucide-react";
import { Panel } from "@/components/ui/Panel";
import { Tabs } from "@/components/ui/Tabs";
import { FilterSelect } from "@/components/ui/FilterSelect";
import { ScoreRing } from "@/components/ui/ScoreRing";
import { DetectionStatusPill } from "@/components/detections/DetectionStatusPill";
import { RiskBadge } from "@/components/detections/RiskBadge";
import { demoDetections, type Detection } from "@/data/demoDetections";
import type { DetectionStatus } from "@/lib/status";
import { cn } from "@/lib/utils";

const STATUS_TABS: (DetectionStatus | "ALL")[] = [
  "ALL",
  "UNKNOWN ANOMALY",
  "NEEDS REVIEW",
  "POSSIBLE OBJECT",
  "KNOWN OBJECT",
  "NATURAL FORMATION",
  "HUMAN VERIFIED",
];

type SortKey = "anomalyScore" | "confidence" | "depth";

export default function Detections() {
  const navigate = useNavigate();
  const [statusTab, setStatusTab] = useState<string>("ALL");
  const [risk, setRisk] = useState("All Risk");
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("anomalyScore");

  const filtered = useMemo(() => {
    let list: Detection[] = [...demoDetections];

    if (statusTab !== "ALL") {
      list = list.filter((d) => d.detectionStatus === statusTab);
    }
    if (risk !== "All Risk") {
      list = list.filter((d) => d.risk === risk.toLowerCase());
    }
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((d) => d.id.toLowerCase().includes(q) || d.classification.toLowerCase().includes(q));
    }

    list.sort((a, b) => b[sortKey] - a[sortKey]);
    return list;
  }, [statusTab, risk, query, sortKey]);

  const unknownCount = demoDetections.filter((d) => d.detectionStatus === "UNKNOWN ANOMALY").length;

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-xl font-semibold text-[--color-ink-100]">Detection Intelligence</h1>
          <p className="mt-1 text-[13px] text-[--color-ink-500]">
            {demoDetections.length} targets detected · {unknownCount} unknown anomalies awaiting classification
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2.5">
        <Tabs tabs={STATUS_TABS} active={statusTab} onChange={setStatusTab} className="flex-wrap" />
        <div className="ml-auto flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[--color-ink-500]" strokeWidth={2} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search target ID or class…"
              className="w-56 rounded-lg border border-[--color-depth-border-soft] bg-[--color-depth-900]/70 py-1.5 pl-8 pr-3 text-[12.5px] text-[--color-ink-100] outline-none placeholder:text-[--color-ink-500] focus:border-[--color-signal-cyan]/50"
            />
          </div>
          <FilterSelect label="Risk" value={risk} options={["All Risk", "High", "Medium", "Low"]} onChange={setRisk} />
          <button
            onClick={() => setSortKey((k) => (k === "anomalyScore" ? "confidence" : k === "confidence" ? "depth" : "anomalyScore"))}
            className="flex items-center gap-1.5 rounded-lg border border-[--color-depth-border-soft] bg-[--color-depth-900]/70 px-3 py-1.5 text-[12.5px] text-[--color-ink-300] hover:border-[--color-depth-border]"
          >
            <ArrowUpDown className="h-3.5 w-3.5" strokeWidth={2} />
            Sort: {sortKey === "anomalyScore" ? "Anomaly score" : sortKey === "confidence" ? "Confidence" : "Depth"}
          </button>
        </div>
      </div>

      {/* Results */}
      <Panel bleed>
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
            <TargetIcon className="h-6 w-6 text-[--color-ink-700]" strokeWidth={1.5} />
            <p className="text-[13px] text-[--color-ink-500]">No targets match the current filters.</p>
          </div>
        ) : (
          <div className="divide-y divide-[--color-depth-border-soft]">
            {/* Header row */}
            <div className="hidden grid-cols-[56px_1fr_140px_120px_110px_90px] items-center gap-4 px-4 py-2 text-[10.5px] font-medium tracking-wide text-[--color-ink-500] sm:grid">
              <span>SCORE</span>
              <span>TARGET</span>
              <span>STATUS</span>
              <span>RISK</span>
              <span>CONFIDENCE</span>
              <span>DEPTH</span>
            </div>
            {filtered.map((d) => (
              <button
                key={d.id}
                onClick={() => navigate(`/detections/${d.id}`)}
                className="grid w-full grid-cols-[56px_1fr] items-center gap-4 px-4 py-3 text-left transition-colors hover:bg-white/[0.02] sm:grid-cols-[56px_1fr_140px_120px_110px_90px]"
              >
                <ScoreRing
                  value={Math.round(d.anomalyScore * 100)}
                  size={44}
                  tone={d.detectionStatus === "UNKNOWN ANOMALY" ? "var(--color-signal-magenta)" : "var(--color-signal-cyan)"}
                />
                <div className="min-w-0">
                  <div className="font-mono-data text-[13px] font-semibold text-[--color-ink-100]">{d.id}</div>
                  <div className="truncate text-[12px] text-[--color-ink-500]">
                    {d.classification} · {d.length.toFixed(2)}m × {d.width.toFixed(2)}m
                  </div>
                </div>
                <div className="hidden sm:block">
                  <DetectionStatusPill status={d.detectionStatus} />
                </div>
                <div className="hidden sm:block">
                  <RiskBadge risk={d.risk} />
                </div>
                <div className={cn("hidden font-mono-data text-[13px] text-[--color-ink-300] sm:block")}>
                  {Math.round(d.confidence * 100)}%
                </div>
                <div className="hidden font-mono-data text-[13px] text-[--color-ink-300] sm:block">{d.depth.toFixed(1)}m</div>
              </button>
            ))}
          </div>
        )}
      </Panel>
    </div>
  );
}
