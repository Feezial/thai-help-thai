import { AnimatedBaht } from "./AnimatedBaht";

export function StatChip({
  label,
  value,
  sub,
}: {
  label: string;
  value: number;
  sub: string;
}) {
  return (
    <div className="rounded-2xl bg-surface-2 px-4 py-3">
      <p className="text-[11px] font-medium text-ink-soft">{label}</p>
      <AnimatedBaht value={value} className="figure mt-1 block text-xl font-bold text-ink" />
      <p className="text-[10.5px] text-ink-faint">{sub}</p>
    </div>
  );
}
