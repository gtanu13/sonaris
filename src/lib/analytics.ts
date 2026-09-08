import type { Detection } from "@/data/demoDetections";
import type { DetectionStatus } from "@/lib/status";

export interface Bucket {
  label: string;
  count: number;
}

/** Buckets a 0–1 score field into 5 even ranges for a histogram. */
export function histogram(detections: Detection[], field: "anomalyScore" | "confidence"): Bucket[] {
  const ranges = [
    { label: "0–20%", min: 0, max: 0.2 },
    { label: "20–40%", min: 0.2, max: 0.4 },
    { label: "40–60%", min: 0.4, max: 0.6 },
    { label: "60–80%", min: 0.6, max: 0.8 },
    { label: "80–100%", min: 0.8, max: 1.01 },
  ];
  return ranges.map((r) => ({
    label: r.label,
    count: detections.filter((d) => d[field] >= r.min && d[field] < r.max).length,
  }));
}

const STATUS_ORDER: DetectionStatus[] = [
  "UNKNOWN ANOMALY",
  "NEEDS REVIEW",
  "POSSIBLE OBJECT",
  "KNOWN OBJECT",
  "NATURAL FORMATION",
  "HUMAN VERIFIED",
];

export function detectionDistribution(detections: Detection[]): Bucket[] {
  return STATUS_ORDER.map((status) => ({
    label: status,
    count: detections.filter((d) => d.detectionStatus === status).length,
  }));
}

/** Demo human-review agreement outcome — illustrative aggregate, not derived from a real audit trail. */
export const reviewAgreement: Bucket[] = [
  { label: "Agreed with AI", count: 12 },
  { label: "Reclassified", count: 5 },
  { label: "Marked Unknown", count: 2 },
];

/** Counts detections per AI-assigned classification label, sorted descending. */
export function classificationBreakdown(detections: Detection[]): Bucket[] {
  const counts = new Map<string, number>();
  for (const d of detections) {
    counts.set(d.classification, (counts.get(d.classification) ?? 0) + 1);
  }
  return [...counts.entries()].map(([label, count]) => ({ label, count })).sort((a, b) => b.count - a.count);
}

export type EvidenceKey = keyof Detection["evidence"];

const EVIDENCE_KEYS: EvidenceKey[] = ["shape", "texture", "contrast", "shadowConsistency", "seabedContext"];

/** Mean of every evidence dimension across a set of detections, 0–1. Returns zeros for an empty set. */
export function evidenceAverages(detections: Detection[]): Record<EvidenceKey, number> {
  const totals: Record<EvidenceKey, number> = {
    shape: 0,
    texture: 0,
    contrast: 0,
    shadowConsistency: 0,
    seabedContext: 0,
  };
  if (detections.length === 0) return totals;
  for (const d of detections) {
    for (const key of EVIDENCE_KEYS) totals[key] += d.evidence[key];
  }
  for (const key of EVIDENCE_KEYS) totals[key] = totals[key] / detections.length;
  return totals;
}

export interface ScatterPoint {
  id: string;
  confidence: number;
  anomalyScore: number;
  status: DetectionStatus;
}

/** Maps detections to a confidence/anomaly-score scatter, both scaled 0–100. */
export function confidenceAnomalyScatter(detections: Detection[]): ScatterPoint[] {
  return detections.map((d) => ({
    id: d.id,
    confidence: Math.round(d.confidence * 100),
    anomalyScore: Math.round(d.anomalyScore * 100),
    status: d.detectionStatus,
  }));
}

/** Mean confidence per classification label — used to surface the class the model is least sure about. */
export function confidenceByClassification(detections: Detection[]): { label: string; avgConfidence: number }[] {
  const groups = new Map<string, number[]>();
  for (const d of detections) {
    const list = groups.get(d.classification) ?? [];
    list.push(d.confidence);
    groups.set(d.classification, list);
  }
  return [...groups.entries()]
    .map(([label, values]) => ({
      label,
      avgConfidence: values.reduce((a, b) => a + b, 0) / values.length,
    }))
    .sort((a, b) => a.avgConfidence - b.avgConfidence);
}
