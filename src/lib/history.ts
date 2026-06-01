
import { HistoryEntry,MonthTotal } from '../types/history';

function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function isSameDay(a: number, b: number): boolean {
  const da = new Date(a);
  const db = new Date(b);
  return (
    da.getFullYear() === db.getFullYear() &&
    da.getMonth() === db.getMonth() &&
    da.getDate() === db.getDate()
  );
}

function isSameMonth(a: number, b: number): boolean {
  const da = new Date(a);
  const db = new Date(b);
  return (
    da.getFullYear() === db.getFullYear() && da.getMonth() === db.getMonth()
  );
}

export function usedToday(entries: HistoryEntry[], nowMs: number): number {
  return round2(
    entries
      .filter((e) => isSameDay(e.ts, nowMs))
      .reduce((sum, e) => sum + e.govPays, 0),
  );
}

export function usedThisMonth(entries: HistoryEntry[], nowMs: number): number {
  return round2(
    entries
      .filter((e) => isSameMonth(e.ts, nowMs))
      .reduce((sum, e) => sum + e.govPays, 0),
  );
}


export function monthTotal(entries: HistoryEntry[], nowMs: number): MonthTotal {
  const inMonth = entries.filter((e) => isSameMonth(e.ts, nowMs));
  return {
    price: round2(inMonth.reduce((s, e) => s + e.price, 0)),
    govPays: round2(inMonth.reduce((s, e) => s + e.govPays, 0)),
    youPay: round2(inMonth.reduce((s, e) => s + e.youPay, 0)),
    count: inMonth.length,
  };
}
