import { Routes, Route } from "react-router-dom";
import { BrainCircuit } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";
import MissionControl from "@/pages/MissionControl";
import SonarAnalysis from "@/pages/SonarAnalysis";
import Detections from "@/pages/Detections";
import DetectionDetail from "@/pages/DetectionDetail";
import SurveyMap from "@/pages/SurveyMap";
import HumanReview from "@/pages/HumanReview";
import Analytics from "@/pages/Analytics";
import Reports from "@/pages/Reports";
import NotFound from "@/pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<MissionControl />} />
        <Route path="/sonar-analysis" element={<SonarAnalysis />} />
        <Route path="/detections" element={<Detections />} />
        <Route path="/detections/:id" element={<DetectionDetail />} />
        <Route
          path="/ai-insights"
          element={
            <PlaceholderPage
              icon={BrainCircuit}
              title="AI Insights"
              stage="Stage 5"
              description="Target evidence, anomaly scoring, and classification detail will be built here."
            />
          }
        />
        <Route path="/survey-map" element={<SurveyMap />} />
        <Route path="/human-review" element={<HumanReview />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
