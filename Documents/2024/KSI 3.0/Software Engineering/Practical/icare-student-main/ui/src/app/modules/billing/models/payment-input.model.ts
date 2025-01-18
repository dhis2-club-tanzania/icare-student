import { BillItemObject } from './bill-item-object.model';
import { BillItem } from './bill-item.model';

export interface PaymentInput {
  paymentType: any;
  referenceNumber: string;
  items: BillItem[];
  confirmedItems: BillItem[];
}
