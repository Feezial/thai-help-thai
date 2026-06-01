import { useState } from "react";
import { DAILY_CAP, formatBaht, MONTHLY_CAP } from "@/lib/calc";
import { monthTotal } from "@/lib/history";
import { formatWhen } from "@/lib/format";
import type { HistoryEntry } from "@/types/history";
import { AnimatedBaht } from "@/components/AnimatedBaht";
import { Header } from "@/components/common/Header";
import { IconClose } from "@/components/icons";
export function HistoryView({
  entries,
  now,
  ready,
  usedToday,
  onRemove,
  onClear,
  goCalc,
}: {
  entries: HistoryEntry[];
  now: number;
  ready: boolean;
  usedToday: number;
  onRemove: (id: string) => void;
  onClear: () => void;
  goCalc: () => void;
}) {
  const month = monthTotal(entries, now);
  const [removing, setRemoving] = useState<Set<string>>(new Set());

  function handleRemove(id: string) {
    setRemoving((prev) => new Set(prev).add(id));
    window.setTimeout(() => onRemove(id), 250);
  }

  return (
    <div className="view-enter">
      <Header title="ประวัติการใช้สิทธิ์" subtitle="เก็บไว้ในเครื่องนี้เท่านั้น" />

      <div className="card rise rounded-3xl p-5 [animation-delay:80ms]">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-[11px] font-medium text-ink-soft">วันนี้ใช้ไป</p>
            <AnimatedBaht
              value={usedToday}
              className="figure mt-0.5 block text-2xl font-bold text-ink"
            />
            <p className="text-[10.5px] text-ink-faint">จาก ฿{formatBaht(DAILY_CAP)}</p>
          </div>
          <div>
            <p className="text-[11px] font-medium text-ink-soft">เดือนนี้ใช้ไป</p>
            <AnimatedBaht
              value={month.govPays}
              className="figure mt-0.5 block text-2xl font-bold text-ink"
            />
            <p className="text-[10.5px] text-ink-faint">
              จาก ฿{formatBaht(MONTHLY_CAP)} · {month.count} รายการ
            </p>
          </div>
        </div>
      </div>

      {ready && entries.length === 0 ? (
        <div className="rise mt-5 rounded-3xl border border-dashed border-line-strong px-6 py-12 text-center [animation-delay:140ms]">
          <p className="text-sm font-medium text-ink-soft">ยังไม่มีประวัติ</p>
          <p className="mt-1 text-[12.5px] text-ink-faint">
            บันทึกการใช้สิทธิ์ได้จากหน้าคำนวณ
          </p>
          <button
            type="button"
            onClick={goCalc}
            className="btn-primary mt-5 rounded-2xl px-5 py-2.5 text-sm font-semibold transition-transform active:scale-[0.97]"
          >
            ไปหน้าคำนวณ
          </button>
        </div>
      ) : (
        <>
          <ul className="mt-4 space-y-2.5">
            {entries.map((entry, index) => (
              <li
                key={entry.id}
                style={{ animationDelay: `${Math.min(index, 8) * 45}ms` }}
                className={`card flex items-center gap-3 rounded-2xl px-4 py-3 ${
                  removing.has(entry.id) ? "item-exit" : "item-enter"
                }`}
              >
                <div className="flex-1">
                  <p className="figure text-[15px] font-semibold text-ink">
                    ฿{formatBaht(entry.price)}
                  </p>
                  <p className="text-[11px] text-ink-faint">{formatWhen(entry.ts)}</p>
                </div>
                <div className="text-right">
                  <p className="figure text-[13px] font-semibold text-blue">
                    รัฐช่วย ฿{formatBaht(entry.govPays)}
                  </p>
                  <p className="figure text-[11px] text-ink-soft">
                    จ่าย ฿{formatBaht(entry.youPay)}
                  </p>
                </div>
                <button
                  type="button"
                  aria-label="ลบรายการ"
                  onClick={() => handleRemove(entry.id)}
                  className="ml-1 flex h-8 w-8 items-center justify-center rounded-full text-ink-faint transition-colors hover:bg-warn-bg hover:text-warn-ink active:scale-90"
                >
                  <IconClose />
                </button>
              </li>
            ))}
          </ul>

          {entries.length > 0 && (
            <button
              type="button"
              onClick={onClear}
              className="mt-5 w-full rounded-2xl border border-line py-3 text-sm font-medium text-ink-soft transition-colors hover:border-warn-line hover:bg-warn-bg hover:text-warn-ink active:scale-[0.99]"
            >
              ล้างประวัติทั้งหมด
            </button>
          )}
        </>
      )}
    </div>
  );
}
