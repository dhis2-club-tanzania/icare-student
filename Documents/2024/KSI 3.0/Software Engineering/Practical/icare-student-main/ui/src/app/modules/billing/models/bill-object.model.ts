import { BillItemObject } from './bill-item-object.model';
import { BillItem } from './bill-item.model';

export interface BillObject {
  id: string;
  uuid: string;
  patient: string;
  created: string;
  status: string;
  payable: number;
  discount: number;
  allItemsConfirmed?: boolean;
  items?: BillItem[];
  confirming?: boolean;
  error?: any;
  discounted?: boolean;
  visitUuid?: string;
}
