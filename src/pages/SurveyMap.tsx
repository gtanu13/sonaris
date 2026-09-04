import { useState } from "react";
import { Layers, Locate, MapPin } from "lucide-react";
import { SurveyMapCanvas } from "@/components/maps/SurveyMapCanvas";
import { Button } from "@/components/ui/Button";
import { Panel } from "@/components/ui/Panel";
import { DetectionStatusPill } from "@/components/detections/DetectionStatusPill";
import { RiskBadge } from "@/components/detections/RiskBadge";
import { ScoreRing } from "@/components/ui/ScoreRing";
import { demoDetections } from "@/data/demoDetections";
import { demoSurvey } from "@/data/demoSurvey";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function SurveyMap() {
  const [selectedId, setSelectedId] = useState<string | null>("TGT-027");
  const [showTrack, setShowTrack] = useState(true);

  const selected = demoDetections.find((d) => d.id === selectedId) ?? null;

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col gap-4">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-xl font-semibold text-[--color-ink-100]">Survey Map</h1>
          <p className="mt-1 flex items-center gap-1.5 text-[13px] text-[--color-ink-500]">
            <MapPin className="h-3.5 w-3.5" strokeWidth={2} />
            {demoSurvey.id} · {demoSurvey.area} · {demoSurvey.areaCoveredKm2} km² covered
          </p>
        </div>
        <Button variant={showTrack ? "secondary" : "outline"} size="sm" onClick={() => setShowTrack((s) => !s)}>
          <Layers className="h-3.5 w-3.5" strokeWidth={2} />
          Survey Track
        </Button>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 xl:grid-cols-[1fr_320px]">
        {/* Map */}
        <div className="min-h-0 overflow-hidden rounded-xl border border-[--color-depth-border-soft]">
          <SurveyMapCanvas selectedId={selectedId} onSelect={setSelectedId} showTrack={showTrack} />
        </div>

        {/* Synced side panel */}
        <div className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-[--color-depth-border-soft] bg-[--color-depth-900]/70">
          {selected ? (
            <div className="flex h-full flex-col">
              <div className="border-b border-[--color-depth-border-soft] px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono-data text-sm font-semibold text-[--color-ink-100]">{selected.id}</span>
                  <DetectionStatusPill status={selected.detectionStatus} />
                </div>
                <div className="mt-1.5 flex items-center gap-2">
                  <RiskBadge risk={selected.risk} />
                  <span className="text-[12px] text-[--color-ink-500]">{selected.classification}</span>
                </div>
              </div>

              <div className="space-y-4 border-b border-[--color-depth-border-soft] p-4">
                <div className="flex items-center gap-4">
                  <ScoreRing
                    value={Math.round(selected.anomalyScore * 100)}
                    size={56}
                    tone={selected.detectionStatus === "UNKNOWN ANOMALY" ? "var(--color-signal-magenta)" : "var(--color-signal-cyan)"}
                    label="SCORE"
                  />
                  <dl className="space-y-1 text-[12.5px]">
                    <div className="flex justify-between gap-6">
                      <dt className="text-[--color-ink-500]">Latitude</dt>
                      <dd className="font-mono-data text-[--color-ink-100]">{selected.latitude.toFixed(4)}°</dd>
                    </div>
                    <div className="flex justify-between gap-6">
                      <dt className="text-[--color-ink-500]">Longitude</dt>
                      <dd className="font-mono-data text-[--color-ink-100]">{selected.longitude.toFixed(4)}°</dd>
                    </div>
                    <div className="flex justify-between gap-6">
                      <dt className="text-[--color-ink-500]">Depth</dt>
                      <dd className="font-mono-data text-[--color-ink-100]">{selected.depth.toFixed(1)} m</dd>
                    </div>
                  </dl>
                </div>
                <Link to={`/detections/${selected.id}`}>
                  <Button variant="primary" className="w-full justify-center" size="sm">
                    <Locate className="h-3.5 w-3.5" strokeWidth={2} />
                    Open Full Investigation
                  </Button>
                </Link>
              </div>

              <div className="flex-1 overflow-y-auto">
                <div className="px-4 py-2.5 text-[10.5px] font-medium tracking-wide text-[--color-ink-500]">
                  ALL TARGETS ({demoDetections.length})
                </div>
                <div className="divide-y divide-[--color-depth-border-soft]">
                  {demoDetections.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => setSelectedId(d.id)}
                      className={cn(
                        "flex w-full items-center justify-between gap-2 px-4 py-2 text-left transition-colors hover:bg-white/[0.02]",
                        d.id === selectedId && "bg-[--color-signal-cyan]/[0.06]"
                      )}
                    >
                      <span className="font-mono-data text-[12px] text-[--color-ink-100]">{d.id}</span>
                      <DetectionStatusPill status={d.detectionStatus} size="sm" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <Panel title="No target selected">
              <p className="text-[13px] text-[--color-ink-500]">Click a marker on the map to view its location and details.</p>
            </Panel>
          )}
        </div>
      </div>
    </div>
  );
}
