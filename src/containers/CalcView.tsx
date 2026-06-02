import { useMemo, useState } from "react";
import {
  calcDiscount,
  calcReverse,
  DAILY_CAP,
  formatBaht,
  MONTHLY_CAP,
} from "@/lib/calc";
import { parseAmount, sanitizeAmount } from "@/lib/format";
import { useManualRemaining } from "@/hooks/useManualRemaining";
import type { Mode } from "@/types/ui";
import { AnimatedBaht } from "@/components/AnimatedBaht";
import { Field } from "@/components/common/Field";
import { Header } from "@/components/common/Header";
import { QuotaBars } from "@/components/QuotaBars";
import { SegmentedTabs, type SegOption } from "@/components/SegmentedTabs";
import { StatChip } from "@/components/StatChip";

const MODE_OPTIONS: readonly [SegOption<Mode>, SegOption<Mode>] = [
  { value: "discount", label: "คำนวณส่วนลด" },
  { value: "reverse", label: "ซื้อได้สูงสุด" },
];

export function CalcView({
  usedToday,
  usedMonth,
  onSave,
  goHistory,
}: {
  usedToday: number;
  usedMonth: number;
  onSave: (price: number, govPays: number, youPay: number) => void;
  goHistory: () => void;
}) {
  const [mode, setMode] = useState<Mode>("discount");
  const [price, setPrice] = useState("");
  const [justSaved, setJustSaved] = useState(false);
  const daily = useManualRemaining(Math.max(0, DAILY_CAP - usedToday), DAILY_CAP);
  const monthly = useManualRemaining(
    Math.max(0, MONTHLY_CAP - usedMonth),
    MONTHLY_CAP,
  );

  const discount = useMemo(
    () =>
      calcDiscount({
        price: parseAmount(price),
        usedToday: daily.used,
        usedMonth: monthly.used,
      }),
    [price, daily.used, monthly.used],
  );

  const remainingNow = Math.max(0, Math.min(daily.remaining, monthly.remaining));
  const reverse = useMemo(() => calcReverse(remainingNow), [remainingNow]);

  function handleSave() {
    if (discount.price <= 0) return;
    onSave(discount.price, discount.govPays, discount.youPay);
    daily.deduct(discount.govPays);
    monthly.deduct(discount.govPays);
    setPrice("");
    setJustSaved(true);
    window.setTimeout(() => setJustSaved(false), 1800);
  }

  return (
    <div className="view-enter">
      <Header title="คำนวณสิทธิ์ 60/40" subtitle="รัฐช่วย 60% · คุณจ่าย 40%" />

      <SegmentedTabs
        value={mode}
        onChange={setMode}
        options={MODE_OPTIONS}
        className="rise mb-5 [animation-delay:60ms]"
      />

      {mode === "discount" ? (
        <div className="view-enter">
          <div className="card rise rounded-3xl p-5 [animation-delay:110ms]">
            <Field
              id="price"
              label="ยอดที่จะซื้อ"
              value={price}
              onChange={(v) => setPrice(sanitizeAmount(v))}
              placeholder="0"
            />

            <div className="mt-4 grid grid-cols-2 gap-3">
              <Field
                id="remaining-today"
                label="สิทธิ์ที่เหลือวันนี้"
                value={daily.value}
                onChange={(v) => daily.set(sanitizeAmount(v))}
                suffix={`/ ${formatBaht(DAILY_CAP)}`}
                size="sm"
              />
              <Field
                id="remaining-month"
                label="สิทธิ์ที่เหลือเดือนนี้"
                value={monthly.value}
                onChange={(v) => monthly.set(sanitizeAmount(v))}
                suffix={`/ ${formatBaht(MONTHLY_CAP)}`}
                size="sm"
              />
            </div>
            <p className="mt-1.5 text-[11px] text-ink-faint">
              เพิ่งเข้ามาครั้งแรก? ปรับให้ตรงยอดคงเหลือจริงในแอปเป๋าตัง
            </p>

            <div className="mt-5 flex items-end justify-between border-t border-line pt-5">
              <div>
                <p className="text-sm font-medium text-ink-soft">คุณจ่ายเอง</p>
                <p className="mt-0.5 text-[11px] text-ink-faint">
                  {/* {Math.round(discount.effectiveDiscountPct * 100)}% ของยอด */}
                  {discount.capped ? " · ส่วนลดไม่ถึง 60%" : ""}
                </p>
              </div>
              <AnimatedBaht
                value={discount.youPay}
                className="figure text-4xl font-bold leading-none text-ink"
              />
            </div>

            <div className="mt-4 flex items-center justify-between rounded-2xl bg-blue-050 px-4 py-3">
              <span className="text-sm font-medium text-blue-deep">รัฐช่วย (60%)</span>
              <AnimatedBaht
                value={discount.govPays}
                className="figure text-lg font-bold text-blue"
              />
            </div>

            <div
              className="grid transition-[grid-template-rows,opacity,margin] duration-300 ease-out"
              style={{
                gridTemplateRows: discount.capped ? "1fr" : "0fr",
                opacity: discount.capped ? 1 : 0,
                marginTop: discount.capped ? "0.75rem" : 0,
              }}
            >
              <div className="overflow-hidden">
                <p className="rounded-2xl border border-warn-line bg-warn-bg px-4 py-2.5 text-[12.5px] leading-relaxed text-warn-ink">
                  ⚠️ สิทธิ์รัฐช่วยถูกตัดที่เพดาน (เหลือใช้ได้{" "}
                  <b className="figure">฿{formatBaht(discount.availableSubsidy)}</b>)
                  ส่วนเกินจ่ายเองเต็มจำนวน
                </p>
              </div>
            </div>

            <button
              type="button"
              className={`mt-5 w-full rounded-2xl py-3.5 text-[15px] font-semibold transition-transform active:scale-[0.98] ${
                justSaved ? "btn-saved text-white" : "btn-primary"
              }`}
              onClick={handleSave}
              disabled={discount.price <= 0}
            >
              {justSaved ? "บันทึกแล้ว ✓" : "บันทึกการใช้สิทธิ์"}
            </button>
          </div>

          <QuotaBars
            usedToday={daily.used}
            usedMonth={monthly.used}
            onClick={goHistory}
          />
        </div>
      ) : (
        <div className="view-enter">
          <div className="card rounded-3xl p-5">
            <p className="text-sm font-medium text-ink-soft">ตอนนี้ซื้อได้สูงสุด</p>
            <p className="mt-1 text-[11px] text-ink-faint">
              จากสิทธิ์ที่เหลือ ฿{formatBaht(remainingNow)} · ยังได้รัฐช่วย 60% เต็ม
            </p>
            <AnimatedBaht
              value={reverse.maxPurchaseFullSubsidy}
              className="figure mt-3 block text-5xl font-bold leading-none text-blue"
            />

            <div className="mt-5 grid grid-cols-2 gap-3">
              <StatChip label="รัฐช่วย" value={reverse.remainingSubsidy} sub="60% ของยอด" />
              <StatChip label="คุณจ่ายเอง" value={reverse.youPayAtMax} sub="40% ของยอด" />
            </div>
          </div>

          <QuotaBars
            usedToday={daily.used}
            usedMonth={monthly.used}
            onClick={goHistory}
          />
        </div>
      )}
    </div>
  );
}
