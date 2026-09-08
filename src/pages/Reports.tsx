import { FileText, Download, FileSpreadsheet } from "lucide-react";
import { Panel } from "@/components/ui/Panel";
import { Button } from "@/components/ui/Button";
import { DetectionStatusPill } from "@/components/detections/DetectionStatusPill";
import { demoDetections } from "@/data/demoDetections";
import { demoSurvey } from "@/data/demoSurvey";
import { exportDetectionsCSV, exportReportPDF } from "@/lib/exportReport";

export default function Reports() {
  const topTargets = [...demoDetections].sort((a, b) => b.anomalyScore - a.anomalyScore).slice(0, 10);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display flex items-center gap-2 text-xl font-semibold text-[--color-ink-100]">
            <FileText className="h-5 w-5 text-[--color-signal-cyan]" strokeWidth={1.75} />
            Reports
          </h1>
          <p className="mt-1 text-[13px] text-[--color-ink-500]">
            Survey report preview for {demoSurvey.id} — {demoSurvey.area}.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => exportDetectionsCSV(demoSurvey, demoDetections)}>
            <FileSpreadsheet className="h-3.5 w-3.5" strokeWidth={2} />
            Export CSV
          </Button>
          <Button variant="primary" size="sm" onClick={() => exportReportPDF(demoSurvey, topTargets)}>
            <Download className="h-3.5 w-3.5" strokeWidth={2} />
            Export PDF
          </Button>
        </div>
      </div>

      <Panel bleed>
        {/* Report letterhead */}
        <div className="border-b border-[--color-depth-border-soft] px-6 py-6">
          <div className="text-[10.5px] font-medium tracking-[0.14em] text-[--color-ink-500]">
            SONARIS · SEAFLOOR INTELLIGENCE
          </div>
          <h2 className="font-display mt-1.5 text-lg font-semibold text-[--color-ink-100]">
            SEAFLOOR AI SURVEY REPORT
          </h2>
          <div className="mt-4 grid grid-cols-2 gap-x-8 gap-y-3 text-[13px] sm:grid-cols-3 lg:grid-cols-6">
            <Meta label="Survey" value={demoSurvey.id} />
            <Meta label="Area" value={demoSurvey.area} mono={false} />
            <Meta label="Date" value={demoSurvey.date} />
            <Meta label="Total Targets" value={String(demoSurvey.totalTargets)} />
            <Meta label="Unknown Anomalies" value={String(demoSurvey.unknownAnomalies)} />
            <Meta label="High Priority Targets" value={String(demoSurvey.highPriority)} />
          </div>
        </div>

        {/* Top detections table */}
        <div className="px-2 py-2">
          <div className="px-4 py-2 text-[10.5px] font-medium tracking-wide text-[--color-ink-500]">
            TOP DETECTIONS · SORTED BY ANOMALY SCORE
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-[13px]">
              <thead>
                <tr className="border-b border-[--color-depth-border-soft] text-[10.5px] font-medium tracking-wide text-[--color-ink-500]">
                  <th className="px-4 py-2">Target ID</th>
                  <th className="px-4 py-2">Classification</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Location</th>
                  <th className="px-4 py-2">Size</th>
                  <th className="px-4 py-2">Anomaly Score</th>
                  <th className="px-4 py-2">Confidence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[--color-depth-border-soft]">
                {topTargets.map((d) => (
                  <tr key={d.id} className="hover:bg-white/[0.02]">
                    <td className="px-4 py-2.5 font-mono-data font-semibold text-[--color-ink-100]">{d.id}</td>
                    <td className="px-4 py-2.5 text-[--color-ink-300]">{d.classification}</td>
                    <td className="px-4 py-2.5">
                      <DetectionStatusPill status={d.detectionStatus} size="sm" />
                    </td>
                    <td className="px-4 py-2.5 font-mono-data text-[--color-ink-300]">
                      {d.latitude.toFixed(4)}, {d.longitude.toFixed(4)}
                    </td>
                    <td className="px-4 py-2.5 font-mono-data text-[--color-ink-300]">
                      {d.length.toFixed(1)}×{d.width.toFixed(1)}m
                    </td>
                    <td className="px-4 py-2.5 font-mono-data text-[--color-ink-100]">
                      {Math.round(d.anomalyScore * 100)}
                    </td>
                    <td className="px-4 py-2.5 font-mono-data text-[--color-ink-300]">
                      {Math.round(d.confidence * 100)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Panel>
    </div>
  );
}

function Meta({ label, value, mono = true }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <div className="text-[10.5px] text-[--color-ink-500]">{label}</div>
      <div className={`mt-0.5 text-[--color-ink-100] ${mono ? "font-mono-data" : ""}`}>{value}</div>
    </div>
  );
}
