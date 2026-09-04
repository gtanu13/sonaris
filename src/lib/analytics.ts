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
