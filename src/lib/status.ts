// Canonical status vocabulary — do not introduce synonyms elsewhere in the app.

export type SystemStatus =
  | "ONLINE"
  | "PROCESSING"
  | "COMPLETE"
  | "REVIEW REQUIRED"
  | "ERROR"
  | "OFFLINE";

export type DetectionStatus =
  | "KNOWN OBJECT"
  | "POSSIBLE OBJECT"
  | "UNKNOWN ANOMALY"
  | "NATURAL FORMATION"
  | "NEEDS REVIEW"
  | "HUMAN VERIFIED";

export type SignalTone =
  | "cyan"
  | "teal"
  | "purple"
  | "magenta"
  | "green"
  | "amber"
  | "orange"
  | "red"
  | "neutral";

export const systemStatusTone: Record<SystemStatus, SignalTone> = {
  ONLINE: "teal",
  PROCESSING: "cyan",
  COMPLETE: "green",
  "REVIEW REQUIRED": "amber",
  ERROR: "red",
  OFFLINE: "neutral",
};

export const toneHex: Record<SignalTone, string> = {
  cyan: "#2fd7ee",
  teal: "#33ddc0",
  purple: "#a684fb",
  magenta: "#f34fd8",
  green: "#4fdb8f",
  amber: "#f6c453",
  orange: "#fb9552",
  red: "#fb5f68",
  neutral: "#7d97a8",
};

export const detectionStatusTone: Record<DetectionStatus, SignalTone> = {
  "KNOWN OBJECT": "teal",
  "POSSIBLE OBJECT": "amber",
  "UNKNOWN ANOMALY": "magenta",
  "NATURAL FORMATION": "neutral",
  "NEEDS REVIEW": "orange",
  "HUMAN VERIFIED": "green",
};
