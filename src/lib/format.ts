/** ยูทิลแปลง/จัดรูปแบบสำหรับ UI */

/** อนุญาตเฉพาะตัวเลขและจุดทศนิยมเดียว (สูงสุด 2 ตำแหน่ง) */
export function sanitizeAmount(raw: string): string {
  const cleaned = raw.replace(/[^0-9.]/g, "");
  const [whole, ...rest] = cleaned.split(".");
  if (rest.length === 0) return whole;
  return `${whole}.${rest.join("").slice(0, 2)}`;
}

/** แปลงข้อความจาก input เป็นตัวเลข (ค่าว่าง/ไม่ใช่ตัวเลข → 0) */
export function parseAmount(value: string): number {
  const n = parseFloat(value);
  return Number.isFinite(n) ? n : 0;
}

/** จัดรูปแบบเวลาบันทึกแบบไทย เช่น "15 มิ.ย. 22:11" */
export function formatWhen(ts: number): string {
  return new Date(ts).toLocaleString("th-TH", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}
