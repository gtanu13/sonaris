import type { Detection } from "@/data/demoDetections";

interface AIAnalysisPanelProps {
  detection: Detection;
}

function ScoreBar({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-400">{label}</span>
        <span className="font-medium text-white">
          {Math.round(value * 100)}%
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-700">
        <div
          className="h-full rounded-full bg-cyan-400 transition-all"
          style={{ width: `${Math.max(0, Math.min(1, value)) * 100}%` }}
        />
      </div>
    </div>
  );
}

function getAnomalyColor(score: number) {
  if (score >= 0.75) return "text-red-400";
  if (score >= 0.45) return "text-yellow-400";
  return "text-green-400";
}

export default function AIAnalysisPanel({
  detection,
}: AIAnalysisPanelProps) {
  const anomalyPercent = Math.round(detection.anomalyScore * 100);
  const confidencePercent = Math.round(detection.confidence * 100);

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900 p-5 text-white shadow-lg">

      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-slate-400">
            AI Analysis
          </p>

          <h2 className="mt-1 text-xl font-semibold">
            {detection.id}
          </h2>
        </div>

        <span className="rounded-full border border-slate-600 px-3 py-1 text-xs font-medium">
          {detection.detectionStatus}
        </span>
      </div>

      {/* Main scores */}
      <div className="grid grid-cols-2 gap-4">

        <div className="rounded-lg bg-slate-800 p-4">
          <p className="text-sm text-slate-400">
            Anomaly Score
          </p>

          <p
            className={`mt-1 text-3xl font-bold ${getAnomalyColor(
              detection.anomalyScore
            )}`}
          >
            {anomalyPercent}%
          </p>
        </div>

        <div className="rounded-lg bg-slate-800 p-4">
          <p className="text-sm text-slate-400">
            Confidence
          </p>

          <p className="mt-1 text-3xl font-bold text-cyan-400">
            {confidencePercent}%
          </p>
        </div>

      </div>

      {/* Classification */}
      <div className="mt-4 rounded-lg border border-slate-700 p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-400">
            Classification
          </span>

          <span className="font-semibold">
            {detection.classification}
          </span>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm text-slate-400">
            Risk
          </span>

          <span className="font-semibold uppercase">
            {detection.risk}
          </span>
        </div>
      </div>

      {/* Evidence */}
      <div className="mt-5">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-300">
          Evidence Analysis
        </h3>

        <div className="space-y-4">

          <ScoreBar
            label="Shape"
            value={detection.evidence.shape}
          />

          <ScoreBar
            label="Texture"
            value={detection.evidence.texture}
          />

          <ScoreBar
            label="Contrast"
            value={detection.evidence.contrast}
          />

          <ScoreBar
            label="Shadow Consistency"
            value={detection.evidence.shadowConsistency}
          />

          <ScoreBar
            label="Seabed Context"
            value={detection.evidence.seabedContext}
          />

        </div>
      </div>

      {/* Physical information */}
      <div className="mt-6">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-300">
          Target Information
        </h3>

        <div className="grid grid-cols-2 gap-3 text-sm">

          <div className="rounded-lg bg-slate-800 p-3">
            <p className="text-slate-400">Depth</p>
            <p className="mt-1 font-medium">
              {detection.depth} m
            </p>
          </div>

          <div className="rounded-lg bg-slate-800 p-3">
            <p className="text-slate-400">Length</p>
            <p className="mt-1 font-medium">
              {detection.length} m
            </p>
          </div>

          <div className="rounded-lg bg-slate-800 p-3">
            <p className="text-slate-400">Width</p>
            <p className="mt-1 font-medium">
              {detection.width} m
            </p>
          </div>

          <div className="rounded-lg bg-slate-800 p-3">
            <p className="text-slate-400">Height</p>
            <p className="mt-1 font-medium">
              {detection.height} m
            </p>
          </div>

        </div>
      </div>

      {/* Location */}
      <div className="mt-4 rounded-lg border border-slate-700 p-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
          Location
        </h3>

        <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-slate-400">Latitude</p>
            <p className="font-medium">{detection.latitude}</p>
          </div>

          <div>
            <p className="text-slate-400">Longitude</p>
            <p className="font-medium">{detection.longitude}</p>
          </div>
        </div>
      </div>

    </div>
  );
}