export interface SurveyMeta {
  id: string;
  area: string;
  date: string;
  vessel: string;
  sensor: string;
  lineSpacingM: number;
  areaCoveredKm2: number;
  totalTargets: number;
  knownObjects: number;
  unknownAnomalies: number;
  highPriority: number;
  humanValidations: number;
  status: "ONLINE" | "PROCESSING" | "COMPLETE" | "REVIEW REQUIRED" | "ERROR" | "OFFLINE";
}

export const demoSurvey: SurveyMeta = {
  id: "SURVEY-024",
  area: "Zone A — Bay Sector 07",
  date: "2026-08-29",
  vessel: "RV Triton Explorer",
  sensor: "Klein 5900 Side-Scan Sonar",
  lineSpacingM: 75,
  areaCoveredKm2: 4.8,
  totalTargets: 147,
  knownObjects: 82,
  unknownAnomalies: 28,
  highPriority: 12,
  humanValidations: 19,
  status: "COMPLETE",
};

export interface PipelineStage {
  label: string;
  status: "COMPLETE" | "PROCESSING" | "PENDING";
}

export const demoPipeline: PipelineStage[] = [
  { label: "Preprocessing", status: "COMPLETE" },
  { label: "Detection / Segmentation", status: "COMPLETE" },
  { label: "Anomaly Analysis", status: "COMPLETE" },
  { label: "Classification", status: "COMPLETE" },
  { label: "Geolocation + Sizing", status: "COMPLETE" },
  { label: "Human Review", status: "PROCESSING" },
];
