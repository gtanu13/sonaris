import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

export interface DemoStep {
  label: string;
  path: string;
  description: string;
}

export const DEMO_STEPS: DemoStep[] = [
  { label: "Load Demo Survey", path: "/", description: "SURVEY-024 loaded — 147 targets detected across Zone A, Bay Sector 07." },
  { label: "Sonar Analysis", path: "/sonar-analysis", description: "Open the sonar workspace to inspect the raw and enhanced side-scan imagery." },
  { label: "AI Analysis", path: "/sonar-analysis", description: "Toggle AI Analysis mode to overlay detection boxes and the anomaly heatmap." },
  { label: "Targets Appear", path: "/sonar-analysis", description: "The model surfaces candidate targets directly on the sonar swath." },
  { label: "Sort by Anomaly Score", path: "/detections", description: "Detection Intelligence ranks every target by investigation priority." },
  { label: "Select Unknown Anomaly", path: "/detections/TGT-027", description: "TGT-027 — high anomaly score, low known-class match. Not confidently classified." },
  { label: "Show Sonar Crop", path: "/detections/TGT-027", description: "The target return and its acoustic shadow, rendered from the raw sonar swath." },
  { label: "Show Evidence", path: "/detections/TGT-027", description: "Shape, texture, contrast and shadow evidence explain why the model flagged this target." },
  { label: "Show Location", path: "/survey-map", description: "Geolocation and survey track place the target precisely within the survey area." },
  { label: "Send to Human Review", path: "/human-review?target=TGT-027", description: "Uncertain targets are routed to an operator for validation." },
  { label: "Validate", path: "/human-review?target=TGT-027", description: "The operator classifies the target and confirms whether it's artificial." },
  { label: "Show Feedback", path: "/human-review?target=TGT-027", description: "The validation feeds the continuous-learning loop for future model passes." },
  { label: "Generate Report", path: "/reports", description: "Export a survey report with the highest-priority targets and their evidence." },
];

interface DemoModeContextValue {
  active: boolean;
  stepIndex: number;
  step: DemoStep;
  start: () => void;
  exit: () => void;
  next: () => void;
  prev: () => void;
}

const DemoModeContext = createContext<DemoModeContextValue | null>(null);

export function DemoModeProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  const start = useCallback(() => {
    setStepIndex(0);
    setActive(true);
  }, []);
  const exit = useCallback(() => setActive(false), []);
  const next = useCallback(() => setStepIndex((i) => Math.min(i + 1, DEMO_STEPS.length - 1)), []);
  const prev = useCallback(() => setStepIndex((i) => Math.max(i - 1, 0)), []);

  const value = useMemo<DemoModeContextValue>(
    () => ({ active, stepIndex, step: DEMO_STEPS[stepIndex], start, exit, next, prev }),
    [active, stepIndex, start, exit, next, prev]
  );

  return <DemoModeContext.Provider value={value}>{children}</DemoModeContext.Provider>;
}

export function useDemoMode() {
  const ctx = useContext(DemoModeContext);
  if (!ctx) throw new Error("useDemoMode must be used within a DemoModeProvider");
  return ctx;
}
