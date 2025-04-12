export interface PaymentMethod {
  id: string;
  card: { brand: string; last4: string; exp_month: number; exp_year: number };
  isDefault: boolean;
}

export interface PaymentHistoryEntry {
  id: string;
  amount: number;
  currency: string;
  status: string;
  created: number;
  paymentMethodId: string;
}
