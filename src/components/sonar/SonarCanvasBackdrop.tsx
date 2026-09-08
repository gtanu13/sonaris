import { useEffect, useRef } from "react";

// Deterministic PRNG so the "sonar image" is stable across renders.
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface SonarCanvasBackdropProps {
  width: number;
  height: number;
  seed?: number;
}

/** Renders a stylized side-scan sonar backscatter texture onto a canvas. Decorative — not real sonar data. */
export function SonarCanvasBackdrop({ width, height, seed = 42 }: SonarCanvasBackdropProps) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = width;
    canvas.height = height;
    const rand = mulberry32(seed);

    // Base fill — deep sonar teal/navy.
    ctx.fillStyle = "#061621";
    ctx.fillRect(0, 0, width, height);

    // Column-wise ping noise (classic side-scan look: vertical streaks of varying brightness).
    const colWidth = 2;
    for (let x = 0; x < width; x += colWidth) {
      const columnBrightness = 0.15 + rand() * 0.12;
      for (let y = 0; y < height; y += 2) {
        const rangeAttenuation = 1 - Math.abs(x - width / 2) / (width / 2); // brighter near nadir
        const speck = rand();
        const intensity = columnBrightness * (0.4 + rangeAttenuation * 0.6) + speck * 0.06;
        const c = Math.min(255, Math.floor(intensity * 255));
        ctx.fillStyle = `rgb(${c * 0.55}, ${c * 0.95}, ${c})`;
        ctx.fillRect(x, y, colWidth, 2);
      }
    }

    // Nadir gap — dark center strip (directly beneath the towfish, no return).
    const nadirWidth = width * 0.035;
    const grad = ctx.createLinearGradient(width / 2 - nadirWidth, 0, width / 2 + nadirWidth, 0);
    grad.addColorStop(0, "rgba(2,8,13,0)");
    grad.addColorStop(0.5, "rgba(2,8,13,0.92)");
    grad.addColorStop(1, "rgba(2,8,13,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(width / 2 - nadirWidth, 0, nadirWidth * 2, height);

    // Soft seabed texture blobs (natural formations, ripples).
    for (let i = 0; i < 26; i++) {
      const bx = rand() * width;
      const by = rand() * height;
      const r = 14 + rand() * 46;
      const radial = ctx.createRadialGradient(bx, by, 0, bx, by, r);
      const shade = rand() > 0.5 ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.18)";
      radial.addColorStop(0, shade);
      radial.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = radial;
      ctx.beginPath();
      ctx.arc(bx, by, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Horizontal ping-line texture for authenticity.
    ctx.globalAlpha = 0.05;
    ctx.strokeStyle = "#000000";
    for (let y = 0; y < height; y += 3) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // Edge vignette.
    const vignette = ctx.createRadialGradient(
      width / 2,
      height / 2,
      height * 0.2,
      width / 2,
      height / 2,
      height * 0.9
    );
    vignette.addColorStop(0, "rgba(0,0,0,0)");
    vignette.addColorStop(1, "rgba(0,0,0,0.5)");
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, width, height);
  }, [width, height, seed]);

  return <canvas ref={ref} className="h-full w-full" />;
}
