import { useEffect, useRef, useState } from "react";
import { Waves } from "lucide-react";
import { SonarCanvasBackdrop } from "@/components/sonar/SonarCanvasBackdrop";
import { TargetMarker } from "@/components/sonar/TargetMarker";
import { SonarToolbar } from "@/components/sonar/SonarToolbar";
import { TargetInspector } from "@/components/sonar/TargetInspector";
import { DetectionStatusPill } from "@/components/detections/DetectionStatusPill";
import { demoDetections } from "@/data/demoDetections";
import { demoSurvey } from "@/data/demoSurvey";
import { cn } from "@/lib/utils";

export default function SonarAnalysis() {
  const [selectedId, setSelectedId] = useState<string | null>("TGT-027");
  const [zoom, setZoom] = useState(1);
  const [gain, setGain] = useState(62);
  const [showGrid, setShowGrid] = useState(true);
  const [playing, setPlaying] = useState(true);
  const [sweepPos, setSweepPos] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ w: 1000, h: 560 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setDims({ w: entry.contentRect.width, h: entry.contentRect.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Slow scan-line sweep to reinforce "live-feeling" analysis without being noisy.
  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setSweepPos((p) => (p + 0.4) % 100);
    }, 60);
    return () => clearInterval(id);
  }, [playing]);

  const selected = demoDetections.find((d) => d.id === selectedId) ?? null;

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col gap-4">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-xl font-semibold text-[--color-ink-100]">Sonar Analysis Workspace</h1>
          <p className="mt-1 flex items-center gap-1.5 text-[13px] text-[--color-ink-500]">
            <Waves className="h-3.5 w-3.5" strokeWidth={2} />
            {demoSurvey.sensor} · {demoSurvey.id} · {demoSurvey.area}
          </p>
        </div>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 xl:grid-cols-[1fr_320px]">
        {/* Main canvas panel */}
        <div className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-[--color-depth-border-soft] bg-[--color-depth-900]/70">
          <SonarToolbar
            zoom={zoom}
            onZoomIn={() => setZoom((z) => Math.min(2.5, +(z + 0.25).toFixed(2)))}
            onZoomOut={() => setZoom((z) => Math.max(0.5, +(z - 0.25).toFixed(2)))}
            gain={gain}
            onGainChange={setGain}
            showGrid={showGrid}
            onToggleGrid={() => setShowGrid((s) => !s)}
            playing={playing}
            onTogglePlay={() => setPlaying((p) => !p)}
          />

          <div ref={containerRef} className="relative min-h-0 flex-1 overflow-hidden bg-black">
            <div
              className="absolute inset-0 origin-center transition-transform duration-200"
              style={{ transform: `scale(${zoom})`, filter: `brightness(${0.7 + gain / 130})` }}
            >
              <SonarCanvasBackdrop width={Math.max(1, Math.floor(dims.w))} height={Math.max(1, Math.floor(dims.h))} />

              {showGrid && (
                <div
                  className="pointer-events-none absolute inset-0 opacity-[0.15]"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
                    backgroundSize: "10% 10%",
                  }}
                />
              )}

              {/* Sweep scan-line */}
              <div
                className="pointer-events-none absolute top-0 h-full w-[3px] bg-[--color-signal-cyan]/70 shadow-[0_0_16px_var(--color-signal-cyan)]"
                style={{ left: `${sweepPos}%` }}
              />

              {demoDetections.map((d) => (
                <TargetMarker key={d.id} detection={d} selected={d.id === selectedId} onSelect={() => setSelectedId(d.id)} />
              ))}
            </div>

            {/* Legend */}
            <div className="pointer-events-none absolute bottom-3 left-3 flex flex-wrap gap-x-4 gap-y-1 rounded-lg border border-[--color-depth-border-soft] bg-[--color-depth-950]/80 px-3 py-2 text-[10.5px] text-[--color-ink-500] backdrop-blur-sm">
              <LegendDot color="var(--color-signal-teal)" label="Known" />
              <LegendDot color="var(--color-signal-amber)" label="Possible" />
              <LegendDot color="var(--color-signal-magenta)" label="Unknown anomaly" />
              <LegendDot color="var(--color-ink-500)" label="Natural" />
            </div>
          </div>

          {/* Filmstrip of targets along the bottom */}
          <div className="flex gap-2 overflow-x-auto border-t border-[--color-depth-border-soft] px-3 py-2.5">
            {demoDetections.map((d) => (
              <button
                key={d.id}
                onClick={() => setSelectedId(d.id)}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-lg border px-2.5 py-1.5 text-left transition-colors",
                  d.id === selectedId
                    ? "border-[--color-signal-cyan]/50 bg-[--color-signal-cyan]/[0.08]"
                    : "border-[--color-depth-border-soft] hover:border-[--color-depth-border]"
                )}
              >
                <span className="font-mono-data text-[11px] text-[--color-ink-100]">{d.id}</span>
                <DetectionStatusPill status={d.detectionStatus} />
              </button>
            ))}
          </div>
        </div>

        {/* Inspector */}
        <div className="min-h-0 overflow-hidden rounded-xl border border-[--color-depth-border-soft] bg-[--color-depth-900]/70">
          <TargetInspector detection={selected} onClose={() => setSelectedId(null)} />
        </div>
      </div>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}` }} />
      {label}
    </span>
  );
}
