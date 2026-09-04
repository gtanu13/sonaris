import { motion } from "framer-motion";
import { Database, Layers, BrainCircuit, HelpCircle, UserCheck, Sparkles, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoopNodeProps {
  icon: typeof Database;
  label: string;
  sublabel?: string;
  tone: "cyan" | "purple" | "amber" | "green" | "magenta";
  pulse?: boolean;
}

const toneStyles: Record<LoopNodeProps["tone"], string> = {
  cyan: "border-[--color-signal-cyan]/40 text-[--color-signal-cyan] bg-[--color-signal-cyan]/[0.07]",
  purple: "border-[--color-signal-purple]/40 text-[--color-signal-purple] bg-[--color-signal-purple]/[0.07]",
  amber: "border-[--color-signal-amber]/40 text-[--color-signal-amber] bg-[--color-signal-amber]/[0.07]",
  green: "border-[--color-signal-green]/40 text-[--color-signal-green] bg-[--color-signal-green]/[0.07]",
  magenta: "border-[--color-signal-magenta]/40 text-[--color-signal-magenta] bg-[--color-signal-magenta]/[0.07]",
};

function LoopNode({ icon: Icon, label, sublabel, tone, pulse }: LoopNodeProps) {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <div className={cn("relative flex h-14 w-14 items-center justify-center rounded-xl border", toneStyles[tone])}>
        {pulse && (
          <motion.span
            className={cn("absolute inset-0 rounded-xl border", toneStyles[tone])}
            animate={{ opacity: [0.6, 0, 0.6], scale: [1, 1.25, 1] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
        <Icon className="h-[22px] w-[22px]" strokeWidth={1.75} />
      </div>
      <div>
        <div className="text-[11.5px] font-semibold leading-tight text-[--color-ink-100]">{label}</div>
        {sublabel && <div className="mt-0.5 font-mono-data text-[10.5px] text-[--color-ink-500]">{sublabel}</div>}
      </div>
    </div>
  );
}

function Arrow() {
  return <ChevronRight className="mt-[-18px] h-4 w-4 shrink-0 text-[--color-ink-700]" strokeWidth={2} />;
}

interface LearningLoopDiagramProps {
  labelledCount: number;
  unlabelledCount: number;
  uncertainCount: number;
  validatedCount: number;
}

export function LearningLoopDiagram({
  labelledCount,
  unlabelledCount,
  uncertainCount,
  validatedCount,
}: LearningLoopDiagramProps) {
  return (
    <div className="flex flex-wrap items-start justify-center gap-x-1 gap-y-6 px-2 py-2 sm:flex-nowrap sm:overflow-x-auto">
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-2">
          <LoopNode icon={Layers} label="Labelled Set" sublabel={`${labelledCount} targets`} tone="green" />
          <span className="mb-5 text-[10px] font-semibold text-[--color-ink-700]">+</span>
          <LoopNode icon={Database} label="Unlabelled Set" sublabel={`${unlabelledCount} pings`} tone="cyan" />
        </div>
      </div>
      <Arrow />
      <LoopNode icon={BrainCircuit} label="AI Model" sublabel="Semi-supervised" tone="purple" />
      <Arrow />
      <LoopNode icon={HelpCircle} label="Uncertain Detections" sublabel={`${uncertainCount} pending`} tone="amber" />
      <Arrow />
      <LoopNode
        icon={UserCheck}
        label="Human Validation"
        sublabel={`${validatedCount} this session`}
        tone="magenta"
        pulse={validatedCount > 0}
      />
      <Arrow />
      <LoopNode icon={Sparkles} label="Improved Model" sublabel="Next retrain cycle" tone="green" />
    </div>
  );
}
