import type { Detection } from "@/data/demoDetections";

export interface HistoricalMatch {
  previousSurveyId: string;
  previousDate: string;
  distanceMeters: number;
  previousClassification: string;
  previousConfidence: number;
  matchStrength: "strong" | "moderate" | "weak";
}

/** Demo cross-survey memory lookup — simulates previously logged detections near a current target. */
export const surveyMemory: Record<string, HistoricalMatch> = {
  "TGT-027": {
    previousSurveyId: "SURVEY-018",
    previousDate: "2025-11-14",
    distanceMeters: 4.2,
    previousClassification: "Possible Debris",
    previousConfidence: 0.52,
    matchStrength: "strong",
  },
  "TGT-042": {
    previousSurveyId: "SURVEY-021",
    previousDate: "2026-02-03",
    distanceMeters: 9.8,
    previousClassification: "Unknown",
    previousConfidence: 0.4,
    matchStrength: "moderate",
  },
  "TGT-093": {
    previousSurveyId: "SURVEY-018",
    previousDate: "2025-11-14",
    distanceMeters: 6.1,
    previousClassification: "Possible Wreck Fragment",
    previousConfidence: 0.61,
    matchStrength: "strong",
  },
  "TGT-009": {
    previousSurveyId: "SURVEY-011",
    previousDate: "2025-06-30",
    distanceMeters: 2.3,
    previousClassification: "Wreck",
    previousConfidence: 0.95,
    matchStrength: "strong",
  },
  "TGT-061": {
    previousSurveyId: "SURVEY-021",
    previousDate: "2026-02-03",
    distanceMeters: 14.6,
    previousClassification: "Net",
    previousConfidence: 0.66,
    matchStrength: "weak",
  },
  "TGT-158": {
    previousSurveyId: "SURVEY-021",
    previousDate: "2026-02-03",
    distanceMeters: 11.2,
    previousClassification: "Unknown",
    previousConfidence: 0.33,
    matchStrength: "moderate",
  },
  "TGT-121": {
    previousSurveyId: "SURVEY-011",
    previousDate: "2025-06-30",
    distanceMeters: 3.5,
    previousClassification: "Possible Wreck",
    previousConfidence: 0.79,
    matchStrength: "strong",
  },
};

/** Builds a synthetic "previous survey" detection record so it can be rendered with TargetCropView. */
export function buildPreviousDetection(current: Detection, match: HistoricalMatch): Detection {
  const strengthFactor = match.matchStrength === "strong" ? 1 : match.matchStrength === "moderate" ? 0.85 : 0.65;
  return {
    ...current,
    id: `${current.id}-PREV`,
    classification: match.previousClassification,
    confidence: match.previousConfidence,
    length: current.length * (0.9 + strengthFactor * 0.15),
    width: current.width * (0.9 + strengthFactor * 0.15),
    evidence: {
      shape: current.evidence.shape * strengthFactor,
      texture: current.evidence.texture * strengthFactor,
      contrast: current.evidence.contrast * strengthFactor,
      shadowConsistency: current.evidence.shadowConsistency * strengthFactor,
      seabedContext: current.evidence.seabedContext * strengthFactor,
    },
  };
}
