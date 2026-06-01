
import { DiscountInput,DiscountResult,ReverseResult } from "../types/calc";

export const RATE = 0.6;
export const DAILY_CAP = 200;
export const MONTHLY_CAP = 1000;

function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function clamp(value: number, max: number): number {
  if (!Number.isFinite(value) || value < 0) return 0;
  return Math.min(value, max);
}

const bahtFormatter = new Intl.NumberFormat("th-TH", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export function formatBaht(value: number): string {
  return bahtFormatter.format(Number.isFinite(value) ? value : 0);
}

export function calcDiscount(input: DiscountInput): DiscountResult {
  const price = clamp(input.price, Number.POSITIVE_INFINITY);
  const usedToday = clamp(input.usedToday, DAILY_CAP);
  const usedMonth = clamp(input.usedMonth, MONTHLY_CAP);

  const remainingDaily = round2(DAILY_CAP - usedToday);
  const remainingMonthly = round2(MONTHLY_CAP - usedMonth);
  const availableSubsidy = Math.min(remainingDaily, remainingMonthly);

  const idealSubsidy = RATE * price;
  const govPays = round2(Math.min(idealSubsidy, availableSubsidy));
  const youPay = round2(price - govPays);
  const capped = idealSubsidy > availableSubsidy + Number.EPSILON;

  return {
    price: round2(price),
    govPays,
    youPay,
    capped,
    availableSubsidy,
    remainingDaily,
    remainingMonthly,
    remainingDailyAfter: round2(remainingDaily - govPays),
    remainingMonthlyAfter: round2(remainingMonthly - govPays),
    effectiveDiscountPct: price > 0 ? govPays / price : 0,
  };
}



export function calcReverse(remainingSubsidyInput: number): ReverseResult {
  const remainingSubsidy = clamp(remainingSubsidyInput, DAILY_CAP);
  const maxPurchaseFullSubsidy = round2(remainingSubsidy / RATE);
  const youPayAtMax = round2(maxPurchaseFullSubsidy - remainingSubsidy);

  return { remainingSubsidy, maxPurchaseFullSubsidy, youPayAtMax };
}
