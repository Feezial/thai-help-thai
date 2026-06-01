import { formatBaht } from "@/lib/calc";

export function ProgressBar({
  label,
  used,
  cap,
}: {
  label: string;
  used: number;
  cap: number;
}) {
  const remaining = Math.max(0, cap - used);
  const pct = Math.min(100, (used / cap) * 100);

  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between">
        <span className="text-[12px] font-medium text-ink-soft">{label}</span>
        <span className="figure text-[12px] font-semibold text-ink">
          ฿{formatBaht(remaining)}{" "}
          <span className="font-normal text-ink-faint">/ {formatBaht(cap)}</span>
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-blue-050">
        <div
          className="h-full rounded-full bg-blue transition-[width] duration-700 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
