import { StatusPill } from "@/components/ui/StatusPill";
import { detectionStatusTone, type DetectionStatus } from "@/lib/status";

interface DetectionStatusPillProps {
  status: DetectionStatus;
  size?: "sm" | "md";
}

export function DetectionStatusPill({ status, size = "sm" }: DetectionStatusPillProps) {
  return <StatusPill label={status} tone={detectionStatusTone[status]} size={size} />;
}
