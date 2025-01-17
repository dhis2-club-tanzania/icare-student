export interface BillPayment {
  uuid?: string;
  invoice: any;
  items: any[];
  paymentType: any;
  referenceNumber: string;
}
