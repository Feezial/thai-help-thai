import { useState } from "react";
import { parseAmount } from "@/lib/format";

function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/**
 * จัดการช่อง "สิทธิ์ที่เหลือ" ที่ผู้ใช้ปรับเองได้
 * - ค่าเริ่มต้นมาจากประวัติ (derivedRemaining); ถ้ายังไม่แตะ จะ sync ตามประวัติ
 * - พอผู้ใช้พิมพ์ จะใช้ค่าที่กรอกแทน
 */
export function useManualRemaining(derivedRemaining: number, cap: number) {
  const [manual, setManual] = useState<string | null>(null);

  const value = manual ?? String(derivedRemaining);
  const remaining = Math.min(cap, Math.max(0, parseAmount(value)));
  const used = cap - remaining;

  return {
    /** ค่าที่แสดงในช่อง input */
    value,
    /** สิทธิ์ที่เหลือ (clamp 0..cap) */
    remaining,
    /** สิทธิ์ที่ใช้ไป = cap - remaining */
    used,
    /** ผู้ใช้แก้ค่า (รับค่าที่ sanitize แล้ว) */
    set: (next: string) => setManual(next),
    /** หักสิทธิ์หลังบันทึก — เฉพาะกรณีผู้ใช้กรอกเอง (โหมด auto ปล่อยให้ประวัติหักเอง) */
    deduct: (amount: number) => {
      if (manual !== null) {
        setManual(String(Math.max(0, round2(remaining - amount))));
      }
    },
  };
}
