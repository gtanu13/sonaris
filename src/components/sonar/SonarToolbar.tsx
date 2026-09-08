import { ZoomIn, ZoomOut, SlidersHorizontal, Layers, Play, Pause, Crosshair } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Tooltip } from "@/components/ui/Tooltip";
import { cn } from "@/lib/utils";

interface SonarToolbarProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  gain: number;
  onGainChange: (v: number) => void;
  showGrid: boolean;
  onToggleGrid: () => void;
  playing: boolean;
  onTogglePlay: () => void;
}

export function SonarToolbar({
  zoom,
  onZoomIn,
  onZoomOut,
  gain,
  onGainChange,
  showGrid,
  onToggleGrid,
  playing,
  onTogglePlay,
}: SonarToolbarProps) {
  const [showGain, setShowGain] = useState(false);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[--color-depth-border-soft] px-4 py-2.5">
      <div className="flex items-center gap-1.5">
        <Tooltip label={playing ? "Pause sweep" : "Play sweep"}>
          <Button variant="secondary" size="icon" onClick={onTogglePlay} aria-label="Toggle scan playback">
            {playing ? <Pause className="h-4 w-4" strokeWidth={1.75} /> : <Play className="h-4 w-4" strokeWidth={1.75} />}
          </Button>
        </Tooltip>

        <span className="mx-1 h-6 w-px bg-[--color-depth-border-soft]" />

        <Tooltip label="Zoom out">
          <Button variant="ghost" size="icon" onClick={onZoomOut} aria-label="Zoom out">
            <ZoomOut className="h-4 w-4" strokeWidth={1.75} />
          </Button>
        </Tooltip>
        <span className="w-12 text-center font-mono-data text-[12px] text-[--color-ink-300]">{Math.round(zoom * 100)}%</span>
        <Tooltip label="Zoom in">
          <Button variant="ghost" size="icon" onClick={onZoomIn} aria-label="Zoom in">
            <ZoomIn className="h-4 w-4" strokeWidth={1.75} />
          </Button>
        </Tooltip>

        <span className="mx-1 h-6 w-px bg-[--color-depth-border-soft]" />

        <div className="relative">
          <Tooltip label="Gain / contrast">
            <Button
              variant={showGain ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setShowGain((s) => !s)}
              aria-label="Adjust gain"
            >
              <SlidersHorizontal className="h-4 w-4" strokeWidth={1.75} />
            </Button>
          </Tooltip>
          {showGain && (
            <div className="absolute left-0 top-full z-20 mt-2 w-52 rounded-lg border border-[--color-depth-border] bg-[--color-depth-900] p-3 shadow-xl">
              <div className="flex items-center justify-between text-[11px] text-[--color-ink-500]">
                <span>Gain</span>
                <span className="font-mono-data text-[--color-ink-300]">{gain}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={gain}
                onChange={(e) => onGainChange(Number(e.target.value))}
                className="mt-2 w-full accent-[--color-signal-cyan]"
              />
            </div>
          )}
        </div>

        <Tooltip label="Toggle coordinate grid">
          <Button variant={showGrid ? "secondary" : "ghost"} size="icon" onClick={onToggleGrid} aria-label="Toggle grid overlay">
            <Layers className="h-4 w-4" strokeWidth={1.75} />
          </Button>
        </Tooltip>
      </div>

      <div className="flex items-center gap-2 text-[11px] text-[--color-ink-500]">
        <Crosshair className="h-3.5 w-3.5" strokeWidth={2} />
        <span className={cn("font-mono-data", "text-[--color-ink-300]")}>Line 07 of 14</span>
        <span className="h-1 w-1 rounded-full bg-[--color-ink-700]" />
        <span className="font-mono-data">Range 60m</span>
      </div>
    </div>
  );
}
