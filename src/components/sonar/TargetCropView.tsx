import { useEffect, useRef } from "react";
import type { Detection } from "@/data/demoDetections";

function hashSeed(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return h >>> 0;
}

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface TargetCropViewProps {
  detection: Detection;
  size?: number;
}

/** A stylized, synthetic close-up sonar "crop" of a single target — decorative, not real sensor data. */
export function TargetCropView({ detection, size = 340 }: TargetCropViewProps) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = size;
    canvas.height = size;
    const rand = mulberry32(hashSeed(detection.id));

    // Backscatter base.
    ctx.fillStyle = "#071722";
    ctx.fillRect(0, 0, size, size);

    for (let x = 0; x < size; x += 2) {
      const colBrightness = 0.18 + rand() * 0.14;
      for (let y = 0; y < size; y += 2) {
        const speck = rand() * 0.05;
        const c = Math.min(255, Math.floor((colBrightness + speck) * 255));
        ctx.fillStyle = `rgb(${c * 0.55}, ${c * 0.95}, ${c})`;
        ctx.fillRect(x, y, 2, 2);
      }
    }

    // Seabed texture blobs.
    for (let i = 0; i < 10; i++) {
      const bx = rand() * size;
      const by = rand() * size;
      const r = 10 + rand() * 30;
      const radial = ctx.createRadialGradient(bx, by, 0, bx, by, r);
      radial.addColorStop(0, rand() > 0.5 ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.15)");
      radial.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = radial;
      ctx.beginPath();
      ctx.arc(bx, by, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // The object silhouette (bright acoustic return), aspect based on real length/width ratio.
    const cx = size / 2;
    const cy = size / 2;
    const aspect = detection.length / detection.width;
    const objW = size * 0.16;
    const objH = Math.min(size * 0.34, objW * Math.max(1, aspect * 0.6));
    const angle = (hashSeed(detection.id) % 60) * (Math.PI / 180) - Math.PI / 6;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);

    // Acoustic shadow — dark elongated region cast away from the sensor track (down-range).
    const shadowLen = objH * (1.4 + detection.evidence.shadowConsistency * 1.6);
    const shadowGrad = ctx.createLinearGradient(0, objH / 2, 0, objH / 2 + shadowLen);
    shadowGrad.addColorStop(0, "rgba(0,0,0,0.85)");
    shadowGrad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = shadowGrad;
    ctx.beginPath();
    ctx.ellipse(0, objH / 2 + shadowLen / 2, objW / 2, shadowLen / 2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Object bright return.
    const objGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, Math.max(objW, objH) / 1.4);
    objGrad.addColorStop(0, "rgba(255,255,255,0.95)");
    objGrad.addColorStop(0.5, "rgba(200,240,245,0.7)");
    objGrad.addColorStop(1, "rgba(200,240,245,0)");
    ctx.fillStyle = objGrad;
    ctx.beginPath();
    ctx.ellipse(0, 0, objW / 2, objH / 2, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    // Vignette.
    const vignette = ctx.createRadialGradient(cx, cy, size * 0.25, cx, cy, size * 0.72);
    vignette.addColorStop(0, "rgba(0,0,0,0)");
    vignette.addColorStop(1, "rgba(0,0,0,0.55)");
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, size, size);
  }, [detection, size]);

  return (
    <div className="relative overflow-hidden rounded-lg border border-[--color-depth-border-soft]" style={{ width: size, height: size }}>
      <canvas ref={ref} className="h-full w-full" />
      {/* Crosshair */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-6 w-6 rounded-full border border-[--color-signal-cyan]/50" />
      </div>
      <div className="pointer-events-none absolute left-0 top-0 h-4 w-4 border-l border-t border-[--color-signal-cyan]/40" />
      <div className="pointer-events-none absolute right-0 top-0 h-4 w-4 border-r border-t border-[--color-signal-cyan]/40" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-4 w-4 border-b border-l border-[--color-signal-cyan]/40" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-4 w-4 border-b border-r border-[--color-signal-cyan]/40" />
    </div>
  );
}
