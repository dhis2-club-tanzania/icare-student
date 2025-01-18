export interface PaymentObject {
  id: string;
  display?: string;
  bill: string;
  status?: string;
  paymentType: any;
  referenceNumber: string;
  amount: number;
  visit: string;
  items: any[];
}
