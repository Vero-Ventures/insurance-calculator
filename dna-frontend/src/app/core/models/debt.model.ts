export interface Debt {
  id: string;
  name: string | null;
  initialValue: number | null;
  yearAcquired: number | null;
  rate: number | null;
  term: number | null;
  annualPayment: number | null;
}
