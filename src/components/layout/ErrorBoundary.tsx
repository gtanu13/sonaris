import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { StatusPill } from "@/components/ui/StatusPill";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error("SONARIS system error:", error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center gap-4 bg-[--color-abyss] text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-[--color-signal-red]/40 bg-[--color-signal-red]/10">
          <AlertTriangle className="h-6 w-6 text-[--color-signal-red]" strokeWidth={1.75} />
        </div>
        <StatusPill label="ERROR" tone="red" />
        <div>
          <h1 className="font-display text-lg font-semibold text-[--color-ink-100]">System Fault Detected</h1>
          <p className="mt-1.5 max-w-sm text-[13px] text-[--color-ink-500]">
            An unexpected error interrupted the sonar pipeline. Reload to restore the analysis workspace.
          </p>
        </div>
        <Button variant="secondary" size="sm" onClick={() => window.location.reload()}>
          <RotateCcw className="h-3.5 w-3.5" strokeWidth={2} />
          Reload SONARIS
        </Button>
      </div>
    );
  }
}
