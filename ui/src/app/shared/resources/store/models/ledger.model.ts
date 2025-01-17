export interface Ledger {
  batchNo: string;
  item: { uuid: string };
  expiryDate: string;
  remarks: string;
  ledgerType: { uuid: string };
  location: { uuid: string };
  buyingPrice: number;
  quantity: number;
  dateMoved?: string;
}
