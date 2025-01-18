export interface BillItemObject {
  id: string;
  uuid: string;
  item: string;
  quantity: number;
  amount: number;
  discount: number;
  payable: number;
  price: number;
  paid?: boolean;
  bill: string;
  confirmed?: boolean;
  order?: any;
  discounted?: boolean;
  paymentMode?: {
    display: string;
    uuid: string;
  };
  calculatedPayableAmount?: number;
}
