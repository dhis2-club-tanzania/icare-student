import { LedgerInput } from './ledger-input.model';
import { Ledger } from './ledger.model';
import { StockBatch } from './stock-batch.model';
import { head } from 'lodash';

export interface StockObject {
  id: string;
  name: string;
  display: string;
  quantity: number;
  eligibleQuantity: number;
  drugUuid: string;
  location: any;
  batches?: StockBatch[];
}

export class Stock {
  constructor(private stockBatches: StockBatch[]) {}

  get id(): string {
    return this.stockBatches[0] ? this.stockBatches[0]?.itemUuid : undefined;
  }

  get name(): string {
    return this.stockBatches[0] ? this.stockBatches[0]?.name : undefined;
  }

  get display(): string {
    return `${this.name} - (${this.eligibleQuantity} Available, Location: ${this.location?.name})`;
  }

  get drugUuid(): string {
    return this.stockBatches[0] ? this.stockBatches[0]?.drug?.uuid : undefined;
  }

  get location(): any {
    return this.stockBatches[0] ? this.stockBatches[0]?.location : null;
  }

  get quantity(): number {
    if (!this.stockBatches || this.stockBatches?.length === 0) {
      return 0;
    }

    return this.stockBatches.reduce(
      (sum, stockBatch) => sum + stockBatch.quantity,
      0
    );
  }

  get eligibleQuantity(): number {
    const eligibleBatches = (this.stockBatches || []).filter(
      (batch) => !batch.isExpired
    );

    if (eligibleBatches?.length === 0) {
      return 0;
    }

    return eligibleBatches.reduce(
      (sum, stockBatch) => sum + stockBatch.quantity,
      0
    );
  }

  toJson(): StockObject {
    return {
      id: this.id,
      name: this.name,
      display: this.display,
      quantity: this.quantity,
      eligibleQuantity: this.eligibleQuantity,
      drugUuid: this.drugUuid,
      location: this.location,
      batches: this.quantity > 0 ? this.stockBatches : [],
    };
  }

  static createLedger(ledgerInput: LedgerInput): Ledger {
    if (!ledgerInput) {
      return null;
    }

    return {
      batchNo: ledgerInput.batchNo,
      item: { uuid: ledgerInput.itemUuid },
      expiryDate: new Date(ledgerInput.expiryDate).toISOString(),
      remarks: ledgerInput.remarks,
      ledgerType: { uuid: ledgerInput.ledgerTypeUuid },
      location: { uuid: ledgerInput.locationUuid },
      buyingPrice: ledgerInput.buyingPrice,
      quantity: ledgerInput.quantity,
    };
  }
}
