import { Link } from "react-router-dom";
import { Radar, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { StatusPill } from "@/components/ui/StatusPill";

export default function NotFound() {
  return (
    <div className="flex h-full min-h-[70vh] flex-col items-center justify-center gap-4 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-[--color-depth-border] bg-[--color-depth-900]">
        <Radar className="h-6 w-6 text-[--color-ink-500]" strokeWidth={1.5} />
      </div>
      <StatusPill label="SIGNAL LOST" tone="orange" />
      <div>
        <h1 className="font-display text-lg font-semibold text-[--color-ink-100]">Route Not Found</h1>
        <p className="mt-1.5 max-w-sm text-[13px] text-[--color-ink-500]">
          This location isn't part of the current survey. The page you're looking for doesn't exist.
        </p>
      </div>
      <Link to="/">
        <Button variant="secondary" size="sm">
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} />
          Return to Mission Control
        </Button>
      </Link>
    </div>
  );
}
