import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { DEMO_STEPS, useDemoMode } from "@/lib/demoMode";

export function DemoModeBar() {
  const { active, stepIndex, step, exit, next, prev } = useDemoMode();
  const navigate = useNavigate();

  useEffect(() => {
    if (active) navigate(step.path);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, stepIndex]);

  const isFirst = stepIndex === 0;
  const isLast = stepIndex === DEMO_STEPS.length - 1;

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="fixed bottom-5 left-1/2 z-50 w-[min(640px,calc(100vw-2rem))] -translate-x-1/2"
        >
          <div className="glass-panel rounded-xl border border-[--color-signal-cyan]/30 shadow-[--shadow-glow-cyan]">
            <div className="flex items-center justify-between gap-3 border-b border-[--color-depth-border-soft] px-4 py-2.5">
              <div className="flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-[--color-signal-cyan]" strokeWidth={2} />
                <span className="text-[11px] font-semibold tracking-wide text-[--color-signal-cyan]">
                  DEMO MODE
                </span>
                <span className="font-mono-data text-[11px] text-[--color-ink-500]">
                  {stepIndex + 1} / {DEMO_STEPS.length}
                </span>
              </div>
              <button
                onClick={exit}
                aria-label="Exit demo mode"
                className="text-[--color-ink-500] hover:text-[--color-ink-100]"
              >
                <X className="h-4 w-4" strokeWidth={2} />
              </button>
            </div>
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="min-w-0 flex-1">
                <div className="text-[13px] font-semibold text-[--color-ink-100]">{step.label}</div>
                <p className="mt-0.5 text-[12px] text-[--color-ink-500]">{step.description}</p>
              </div>
              <div className="flex shrink-0 items-center gap-1.5">
                <Button variant="outline" size="icon" onClick={prev} disabled={isFirst} aria-label="Previous step">
                  <ChevronLeft className="h-4 w-4" strokeWidth={2} />
                </Button>
                <Button variant="primary" size="sm" onClick={isLast ? exit : next}>
                  {isLast ? "Finish" : "Next"}
                  {!isLast && <ChevronRight className="h-3.5 w-3.5" strokeWidth={2} />}
                </Button>
              </div>
            </div>
            <div className="h-1 overflow-hidden rounded-b-xl bg-[--color-depth-800]">
              <motion.div
                className="h-full bg-[--color-signal-cyan]"
                animate={{ width: `${((stepIndex + 1) / DEMO_STEPS.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
