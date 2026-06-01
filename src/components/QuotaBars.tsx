import { DAILY_CAP, MONTHLY_CAP } from "@/lib/calc";
import { ProgressBar } from "./ProgressBar";

export function QuotaBars({
  usedToday,
  usedMonth,
  onClick,
}: {
  usedToday: number;
  usedMonth: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="card rise mt-4 block w-full rounded-3xl p-5 text-left transition-transform active:scale-[0.99] [animation-delay:190ms]"
    >
      <ProgressBar label="เหลือสิทธิ์วันนี้" used={usedToday} cap={DAILY_CAP} />
      <div className="mt-3">
        <ProgressBar label="เหลือสิทธิ์เดือนนี้" used={usedMonth} cap={MONTHLY_CAP} />
      </div>
    </button>
  );
}
