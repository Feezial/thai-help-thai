import { useEffect, useState } from "react";
import type { HistoryEntry } from "@/types/history";

const STORAGE_KEY = "tct:history:v1";

export interface UseHistory {
  entries: HistoryEntry[];
  /** เวลาปัจจุบัน (epoch ms) — ตั้งหลัง mount เพื่อเลี่ยง hydration mismatch */
  now: number;
  /** โหลดจาก localStorage เสร็จแล้วหรือยัง */
  ready: boolean;
  addEntry: (price: number, govPays: number, youPay: number) => void;
  removeEntry: (id: string) => void;
  clearAll: () => void;
}

function makeId(): string {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
}

/** เก็บประวัติการใช้สิทธิ์ใน localStorage (per-device) */
export function useHistory(): UseHistory {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [now, setNow] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setEntries(JSON.parse(raw));
    } catch {
      /* ข้อมูลเสียหาย — เริ่มใหม่ */
    }
    setNow(Date.now());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch {
      /* localStorage เต็ม/ใช้ไม่ได้ */
    }
  }, [entries, ready]);

  function addEntry(price: number, govPays: number, youPay: number) {
    setNow(Date.now());
    setEntries((prev) => [
      { id: makeId(), ts: Date.now(), price, govPays, youPay },
      ...prev,
    ]);
  }

  const removeEntry = (id: string) =>
    setEntries((prev) => prev.filter((entry) => entry.id !== id));

  const clearAll = () => setEntries([]);

  return { entries, now, ready, addEntry, removeEntry, clearAll };
}
