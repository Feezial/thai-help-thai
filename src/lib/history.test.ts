import { describe, expect, test } from "vitest";
import { monthTotal, usedThisMonth, usedToday } from "./history";
import type { HistoryEntry } from "../types/history";

// มิ.ย. 2026 (เดือน index 5), เวลาเที่ยง
const NOW = new Date(2026, 5, 15, 12, 0).getTime();

function entry(
  partial: Partial<HistoryEntry> & { ts: number; govPays: number },
): HistoryEntry {
  return {
    id: String(partial.ts),
    price: partial.price ?? partial.govPays / 0.6,
    youPay: partial.youPay ?? 0,
    ...partial,
  };
}

const SAMPLE: HistoryEntry[] = [
  entry({ ts: new Date(2026, 5, 15, 9).getTime(), govPays: 120 }), // วันนี้
  entry({ ts: new Date(2026, 5, 15, 8).getTime(), govPays: 60 }), // วันนี้
  entry({ ts: new Date(2026, 5, 14, 20).getTime(), govPays: 200 }), // เมื่อวาน (เดือนเดียวกัน)
  entry({ ts: new Date(2026, 4, 30, 12).getTime(), govPays: 150 }), // เดือนก่อน
];

describe("usedToday", () => {
  test("รวมเฉพาะ govPays ของรายการวันนี้", () => {
    expect(usedToday(SAMPLE, NOW)).toBe(180);
  });

  test("ไม่มีรายการ → 0", () => {
    expect(usedToday([], NOW)).toBe(0);
  });

  test("ไม่นับรายการเมื่อวาน", () => {
    const onlyYesterday = [
      entry({ ts: new Date(2026, 5, 14, 10).getTime(), govPays: 99 }),
    ];
    expect(usedToday(onlyYesterday, NOW)).toBe(0);
  });
});

describe("usedThisMonth", () => {
  test("รวม govPays ทุกวันในเดือนนี้ (ไม่รวมเดือนก่อน)", () => {
    expect(usedThisMonth(SAMPLE, NOW)).toBe(380);
  });

  test("ไม่มีรายการ → 0", () => {
    expect(usedThisMonth([], NOW)).toBe(0);
  });
});

describe("monthTotal", () => {
  test("รวมยอดซื้อ/รัฐช่วย/จ่ายเอง ของเดือนนี้", () => {
    const t = monthTotal(SAMPLE, NOW);
    expect(t.govPays).toBe(380);
    expect(t.count).toBe(3);
  });
});
