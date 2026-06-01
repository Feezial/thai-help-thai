export type HistoryEntry = {
    id: string;
    ts: number; 
    price: number; 
    govPays: number; 
    youPay: number; 
}

export type MonthTotal = {
    price: number;
    govPays: number;
    youPay: number;
    count: number;
}