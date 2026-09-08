import { Routes, Route } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import MissionControl from "@/pages/MissionControl";
import SonarAnalysis from "@/pages/SonarAnalysis";
import Detections from "@/pages/Detections";
import DetectionDetail from "@/pages/DetectionDetail";
import AIInsights from "@/pages/AIInsights";
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
        <Route path="/ai-insights" element={<AIInsights />} />
        <Route path="/survey-map" element={<SurveyMap />} />
        <Route path="/human-review" element={<HumanReview />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
