import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Radar } from "lucide-react";
import { demoSurvey } from "@/data/demoSurvey";

const BOOT_LINES = [
  "Connecting to sonar pipeline…",
  `Loading demo survey ${demoSurvey.id}…`,
  "Preprocessing side-scan data…",
  "AI analysis complete.",
];

export function BootSplash({ onDone }: { onDone: () => void }) {
  const [lineIndex, setLineIndex] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (lineIndex >= BOOT_LINES.length - 1) {
      const exitTimer = setTimeout(() => setExiting(true), 450);
      const doneTimer = setTimeout(onDone, 850);
      return () => {
        clearTimeout(exitTimer);
        clearTimeout(doneTimer);
      };
    }
    const t = setTimeout(() => setLineIndex((i) => i + 1), 380);
    return () => clearTimeout(t);
  }, [lineIndex, onDone]);

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6 bg-[--color-abyss]"
        >
          <div className="relative flex h-16 w-16 items-center justify-center rounded-xl border border-[--color-signal-cyan]/40 bg-[--color-signal-cyan]/10">
            <Radar className="h-7 w-7 text-[--color-signal-cyan]" strokeWidth={1.75} />
            <span className="absolute h-full w-full animate-[ping_2s_ease-in-out_infinite] rounded-xl border border-[--color-signal-cyan]/30" />
          </div>
          <div className="text-center">
            <div className="font-display text-[15px] font-semibold tracking-[0.08em] text-[--color-ink-100]">
              SONARIS
            </div>
            <div className="mt-0.5 text-[10px] font-medium tracking-[0.16em] text-[--color-ink-500]">
              SEAFLOOR INTELLIGENCE
            </div>
          </div>
          <div className="h-5 font-mono-data text-[12px] text-[--color-signal-cyan]">
            {BOOT_LINES[lineIndex]}
          </div>
          <div className="h-1 w-56 overflow-hidden rounded-full bg-[--color-depth-800]">
            <motion.div
              className="h-full rounded-full bg-[--color-signal-cyan]"
              initial={{ width: "0%" }}
              animate={{ width: `${((lineIndex + 1) / BOOT_LINES.length) * 100}%` }}
              transition={{ duration: 0.35 }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
