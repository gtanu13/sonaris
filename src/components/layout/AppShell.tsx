import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { BootSplash } from "@/components/layout/BootSplash";
import { PageTransition } from "@/components/layout/PageTransition";
import { DemoModeBar } from "@/components/layout/DemoModeBar";
import { DemoModeProvider } from "@/lib/demoMode";

export function AppShell() {
  const [booted, setBooted] = useState(false);
  const location = useLocation();

  return (
    <DemoModeProvider>
      {!booted && <BootSplash onDone={() => setBooted(true)} />}
      <div className="relative flex h-screen w-screen overflow-hidden bg-bathymetric font-body text-[--color-ink-100]">
        {/* Background decoration layer — must stay behind all content */}
        <div className="pointer-events-none absolute inset-0 bg-grid-technical opacity-60" />
        <SonarSweep />

        <Sidebar />

        <div className="relative z-10 flex min-w-0 flex-1 flex-col">
          <TopBar />
          <main className="flex-1 overflow-y-auto px-6 py-6">
            <AnimatePresence mode="wait">
              <PageTransition key={location.pathname}>
                <Outlet />
              </PageTransition>
            </AnimatePresence>
          </main>
        </div>

        <DemoModeBar />
      </div>
    </DemoModeProvider>
  );
}

/** A single slow, quiet sonar sweep arc — the shell's one signature ambient motion. */
function SonarSweep() {
  return (
    <div className="pointer-events-none absolute -right-[280px] -top-[280px] h-[640px] w-[640px] opacity-[0.35]">
      <div className="absolute inset-0 rounded-full border border-[--color-signal-cyan]/[0.06]" />
      <div className="absolute inset-[80px] rounded-full border border-[--color-signal-cyan]/[0.05]" />
      <div className="absolute inset-[160px] rounded-full border border-[--color-signal-cyan]/[0.05]" />
      <div className="absolute inset-[240px] rounded-full border border-[--color-signal-cyan]/[0.06]" />
      <div className="sonar-sweep absolute inset-0 rounded-full" />
    </div>
  );
}
