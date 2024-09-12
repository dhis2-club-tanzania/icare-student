export interface PaymentObject {
  id: string;
  display?: string;
  bill: string;
  status?: 'PENDING' | 'PAID';
  paymentType: any;
  referenceNumber: string;
  amount: number;
  visit: string;
  items: any[];
}
