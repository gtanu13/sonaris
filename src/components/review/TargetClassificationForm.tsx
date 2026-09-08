import { useState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SegmentedControl } from "@/components/ui/SegmentedControl";

const CLASSIFICATION_OPTIONS = [
  { value: "Pipe", label: "Pipe" },
  { value: "Wreck", label: "Wreck" },
  { value: "Net", label: "Net" },
  { value: "Debris", label: "Debris" },
  { value: "Natural Formation", label: "Natural Formation" },
  { value: "Unknown", label: "Unknown" },
];

const ARTIFICIAL_OPTIONS = [
  { value: "YES", label: "Yes" },
  { value: "NO", label: "No" },
  { value: "UNSURE", label: "Unsure" },
];

export interface ValidationResult {
  classification: string;
  isArtificial: "YES" | "NO" | "UNSURE";
}

interface TargetClassificationFormProps {
  targetId: string;
  onSubmit: (result: ValidationResult) => void;
  initialResult?: ValidationResult;
}

export function TargetClassificationForm({ targetId, onSubmit, initialResult }: TargetClassificationFormProps) {
  const [classification, setClassification] = useState<string | null>(initialResult?.classification ?? null);
  const [isArtificial, setIsArtificial] = useState<string | null>(initialResult?.isArtificial ?? null);
  const [submitted, setSubmitted] = useState(Boolean(initialResult));

  const canSubmit = Boolean(classification && isArtificial);

  function handleSubmit() {
    if (!classification || !isArtificial) return;
    setSubmitted(true);
    onSubmit({ classification, isArtificial: isArtificial as ValidationResult["isArtificial"] });
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-[--color-signal-green]/30 bg-[--color-signal-green]/[0.06] px-6 py-10 text-center">
        <CheckCircle2 className="h-8 w-8 text-[--color-signal-green]" strokeWidth={1.75} />
        <p className="text-[13px] font-semibold tracking-wide text-[--color-signal-green]">
          ✓ HUMAN VALIDATION RECORDED
        </p>
        <p className="max-w-xs text-[12px] text-[--color-ink-500]">
          {targetId} classified as <span className="text-[--color-ink-300]">{classification}</span>
          {" · "}
          Artificial object: <span className="text-[--color-ink-300]">{isArtificial}</span>
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="mb-2.5 text-[13px] font-semibold text-[--color-ink-100]">WHAT IS THIS TARGET?</p>
        <SegmentedControl options={CLASSIFICATION_OPTIONS} value={classification} onChange={setClassification} tone="cyan" />
      </div>
      <div>
        <p className="mb-2.5 text-[13px] font-semibold text-[--color-ink-100]">IS THIS AN ARTIFICIAL OBJECT?</p>
        <SegmentedControl options={ARTIFICIAL_OPTIONS} value={isArtificial} onChange={setIsArtificial} tone="green" />
      </div>
      <Button variant="primary" disabled={!canSubmit} onClick={handleSubmit} className="w-full justify-center">
        <Send className="h-3.5 w-3.5" strokeWidth={2} />
        SUBMIT VALIDATION
      </Button>
    </div>
  );
}
