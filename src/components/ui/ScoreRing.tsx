interface ScoreRingProps {
  value: number; // 0–100
  size?: number;
  tone?: string;
  label?: string;
}

export function ScoreRing({ value, size = 64, tone = "var(--color-signal-magenta)", label }: ScoreRingProps) {
  const stroke = 5;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="var(--color-depth-800)" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={tone}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ filter: `drop-shadow(0 0 4px ${tone})`, transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="font-mono-data font-display text-[15px] font-semibold leading-none text-[--color-ink-100]">
          {value}
        </span>
        {label && <span className="mt-0.5 text-[8.5px] text-[--color-ink-500]">{label}</span>}
      </div>
    </div>
  );
}
