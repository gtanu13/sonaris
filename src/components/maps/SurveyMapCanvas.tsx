import { useMemo } from "react";
import { computeBounds, generateSurveyTrack, project } from "@/lib/geo";
import { demoDetections, type Detection } from "@/data/demoDetections";
import { cn } from "@/lib/utils";

const markerColor: Record<Detection["detectionStatus"], string> = {
  "KNOWN OBJECT": "var(--color-signal-teal)",
  "POSSIBLE OBJECT": "var(--color-signal-amber)",
  "UNKNOWN ANOMALY": "var(--color-signal-magenta)",
  "NATURAL FORMATION": "var(--color-ink-500)",
  "NEEDS REVIEW": "var(--color-signal-orange)",
  "HUMAN VERIFIED": "var(--color-signal-green)",
};

interface SurveyMapCanvasProps {
  selectedId: string | null;
  onSelect: (id: string) => void;
  showTrack: boolean;
}

export function SurveyMapCanvas({ selectedId, onSelect, showTrack }: SurveyMapCanvasProps) {
  const bounds = useMemo(() => computeBounds(demoDetections), []);
  const track = useMemo(() => generateSurveyTrack(bounds, 9), [bounds]);

  const trackPath = track.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x * 1000} ${p.y * 600}`).join(" ");

  return (
    <div className="relative h-full w-full overflow-hidden bg-[--color-abyss]">
      {/* Depth-gradient seabed backdrop */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 900px 600px at 50% 40%, rgba(23,58,84,0.9), rgba(5,11,19,1) 75%)",
        }}
      />
      {/* Bathymetric contour rings */}
      <svg className="absolute inset-0 h-full w-full opacity-40" viewBox="0 0 1000 600" preserveAspectRatio="none">
        {[80, 160, 240, 320].map((r) => (
          <ellipse
            key={r}
            cx={500}
            cy={300}
            rx={r * 1.5}
            ry={r}
            fill="none"
            stroke="rgba(120,190,210,0.15)"
            strokeWidth={1}
            strokeDasharray="4 6"
          />
        ))}
      </svg>

      {/* Coordinate grid */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.12]" viewBox="0 0 1000 600" preserveAspectRatio="none">
        {Array.from({ length: 11 }).map((_, i) => (
          <line key={`v${i}`} x1={(i / 10) * 1000} y1={0} x2={(i / 10) * 1000} y2={600} stroke="#9fd2e0" strokeWidth={1} />
        ))}
        {Array.from({ length: 7 }).map((_, i) => (
          <line key={`h${i}`} x1={0} y1={(i / 6) * 600} x2={1000} y2={(i / 6) * 600} stroke="#9fd2e0" strokeWidth={1} />
        ))}
      </svg>

      {/* Survey track */}
      {showTrack && (
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1000 600" preserveAspectRatio="none">
          <path d={trackPath} fill="none" stroke="var(--color-signal-cyan)" strokeWidth={1.5} strokeOpacity={0.35} strokeDasharray="6 5" />
          {track.map((p, i) => (
            <circle key={i} cx={p.x * 1000} cy={p.y * 600} r={2.5} fill="var(--color-signal-cyan)" opacity={0.5} />
          ))}
        </svg>
      )}

      {/* Compass */}
      <div className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-[--color-depth-border] bg-[--color-depth-950]/80 text-[10px] font-semibold text-[--color-ink-300]">
        N↑
      </div>

      {/* Target markers */}
      {demoDetections.map((d) => {
        const { x, y } = project(d.latitude, d.longitude, bounds);
        const isSelected = d.id === selectedId;
        const color = markerColor[d.detectionStatus];
        const isUnknown = d.detectionStatus === "UNKNOWN ANOMALY";
        return (
          <button
            key={d.id}
            onClick={() => onSelect(d.id)}
            style={{ left: `${x * 100}%`, top: `${y * 100}%` }}
            className="group absolute -translate-x-1/2 -translate-y-1/2"
            aria-label={`Target ${d.id}`}
          >
            {isUnknown && (
              <span
                className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full opacity-50"
                style={{ border: `1px solid ${color}` }}
              />
            )}
            <span
              className={cn(
                "relative flex items-center justify-center rounded-full border-2 bg-[--color-depth-950]/80 transition-transform",
                isSelected ? "h-5 w-5 scale-110" : "h-3.5 w-3.5 group-hover:scale-125"
              )}
              style={{ borderColor: color, boxShadow: isSelected ? `0 0 12px ${color}` : `0 0 6px ${color}` }}
            />
            {isSelected && (
              <span className="pointer-events-none absolute left-1/2 top-full mt-1.5 -translate-x-1/2 whitespace-nowrap rounded-md border border-[--color-depth-border] bg-[--color-depth-950] px-1.5 py-0.5 font-mono-data text-[10px] text-[--color-ink-100]">
                {d.id}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
