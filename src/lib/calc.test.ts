import { describe, expect, test } from "vitest";
import {
  calcDiscount,
  calcReverse,
  DAILY_CAP,
  formatBaht,
  MONTHLY_CAP,
  RATE,
} from "./calc";

describe("ค่าคงที่โครงการ", () => {
  test("รัฐช่วย 60%, เพดาน 200/วัน, 1000/เดือน", () => {
    expect(RATE).toBe(0.6);
    expect(DAILY_CAP).toBe(200);
    expect(MONTHLY_CAP).toBe(1000);
  });
});

describe("calcDiscount — โหมดคำนวณส่วนลด", () => {
  test("ซื้อ 300 ยังไม่ใช้สิทธิ์ → รัฐช่วย 180 จ่ายเอง 120 (40% เป๊ะ)", () => {
    const r = calcDiscount({ price: 300, usedToday: 0, usedMonth: 0 });
    expect(r.govPays).toBe(180);
    expect(r.youPay).toBe(120);
    expect(r.capped).toBe(false);
    expect(r.availableSubsidy).toBe(200);
    expect(r.remainingDailyAfter).toBe(20);
    expect(r.remainingMonthlyAfter).toBe(820);
    expect(r.effectiveDiscountPct).toBeCloseTo(0.6, 5);
  });

  test("ซื้อ 500 ยังไม่ใช้สิทธิ์ → รัฐช่วยถูกตัดที่ 200 จ่ายเอง 300 (เกินเพดาน)", () => {
    const r = calcDiscount({ price: 500, usedToday: 0, usedMonth: 0 });
    expect(r.govPays).toBe(200);
    expect(r.youPay).toBe(300);
    expect(r.capped).toBe(true);
    expect(r.remainingDailyAfter).toBe(0);
    expect(r.remainingMonthlyAfter).toBe(800);
    expect(r.effectiveDiscountPct).toBeCloseTo(0.4, 5);
  });

  test("ซื้อ 300 แต่เดือนนี้ใช้ไป 950 → เพดานเดือนเหลือ 50 คุมไว้", () => {
    const r = calcDiscount({ price: 300, usedToday: 0, usedMonth: 950 });
    expect(r.availableSubsidy).toBe(50);
    expect(r.govPays).toBe(50);
    expect(r.youPay).toBe(250);
    expect(r.capped).toBe(true);
    expect(r.remainingDailyAfter).toBe(150);
    expect(r.remainingMonthlyAfter).toBe(0);
  });

  test("ใช้สิทธิ์วันนี้เต็ม 200 แล้ว → รัฐช่วย 0 จ่ายเองเต็ม", () => {
    const r = calcDiscount({ price: 100, usedToday: 200, usedMonth: 0 });
    expect(r.availableSubsidy).toBe(0);
    expect(r.govPays).toBe(0);
    expect(r.youPay).toBe(100);
    expect(r.capped).toBe(true);
  });

  test("ยอดซื้อ 0 → ทุกค่าเป็น 0 และไม่ถือว่าเกินเพดาน", () => {
    const r = calcDiscount({ price: 0, usedToday: 0, usedMonth: 0 });
    expect(r.govPays).toBe(0);
    expect(r.youPay).toBe(0);
    expect(r.capped).toBe(false);
    expect(r.effectiveDiscountPct).toBe(0);
  });

  test("ปัดทศนิยม 2 ตำแหน่ง (สตางค์)", () => {
    const r = calcDiscount({ price: 99.99, usedToday: 0, usedMonth: 0 });
    // 0.6 * 99.99 = 59.994 → 59.99
    expect(r.govPays).toBe(59.99);
    expect(r.youPay).toBe(40);
  });

  describe("clamp ค่าที่ผิดช่วง", () => {
    test("ราคาติดลบถือเป็น 0", () => {
      const r = calcDiscount({ price: -100, usedToday: 0, usedMonth: 0 });
      expect(r.govPays).toBe(0);
      expect(r.youPay).toBe(0);
    });

    test("ใช้วันนี้เกิน 200 ถูกตัดเหลือ 200 (สิทธิ์เหลือ 0)", () => {
      const r = calcDiscount({ price: 100, usedToday: 999, usedMonth: 0 });
      expect(r.remainingDaily).toBe(0);
      expect(r.govPays).toBe(0);
    });

    test("ใช้เดือนนี้เกิน 1000 ถูกตัดเหลือ 1000 (สิทธิ์เหลือ 0)", () => {
      const r = calcDiscount({ price: 100, usedToday: 0, usedMonth: 5000 });
      expect(r.remainingMonthly).toBe(0);
      expect(r.govPays).toBe(0);
    });

    test("ค่าที่ไม่ใช่ตัวเลข (NaN) ถือเป็น 0", () => {
      const r = calcDiscount({ price: NaN, usedToday: NaN, usedMonth: NaN });
      expect(r.govPays).toBe(0);
      expect(r.youPay).toBe(0);
      expect(r.availableSubsidy).toBe(200);
    });
  });
});

describe("formatBaht — จัดรูปแบบจำนวนเงิน", () => {
  test("จำนวนเต็มไม่แสดงทศนิยม", () => {
    expect(formatBaht(180)).toBe("180");
  });

  test("หลักพันมีลูกน้ำคั่น", () => {
    expect(formatBaht(1234.56)).toBe("1,234.56");
  });

  test("ปัดทศนิยมสูงสุด 2 ตำแหน่ง", () => {
    expect(formatBaht(133.336)).toBe("133.34");
  });

  test("หนึ่งพันถ้วน", () => {
    expect(formatBaht(1000)).toBe("1,000");
  });
});

describe("calcReverse — โหมดคำนวณย้อนกลับ", () => {
  test("สิทธิ์เหลือ 200 → ซื้อได้สูงสุด 333.33 จ่ายเอง 133.33", () => {
    const r = calcReverse(200);
    expect(r.maxPurchaseFullSubsidy).toBeCloseTo(333.33, 2);
    expect(r.youPayAtMax).toBeCloseTo(133.33, 2);
  });

  test("สิทธิ์เหลือ 0 → ซื้อได้สูงสุด 0", () => {
    const r = calcReverse(0);
    expect(r.maxPurchaseFullSubsidy).toBe(0);
    expect(r.youPayAtMax).toBe(0);
  });

  test("สิทธิ์เหลือเกิน 200 ถูก clamp เหลือ 200", () => {
    const r = calcReverse(999);
    expect(r.remainingSubsidy).toBe(200);
    expect(r.maxPurchaseFullSubsidy).toBeCloseTo(333.33, 2);
  });

  test("ค่าติดลบถือเป็น 0", () => {
    const r = calcReverse(-50);
    expect(r.remainingSubsidy).toBe(0);
    expect(r.maxPurchaseFullSubsidy).toBe(0);
  });
});
