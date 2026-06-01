export type DiscountInput = {
  price: number;
  usedToday: number;
  usedMonth: number;
};

export type DiscountResult = {  
  price: number;
  govPays: number;
  youPay: number;
  capped: boolean;
  availableSubsidy: number;
  remainingDaily: number;
  remainingMonthly: number;
  remainingDailyAfter: number;
  remainingMonthlyAfter: number;
  effectiveDiscountPct: number;
}

export type ReverseResult = {
  remainingSubsidy: number;
  maxPurchaseFullSubsidy: number;
  youPayAtMax: number;
}