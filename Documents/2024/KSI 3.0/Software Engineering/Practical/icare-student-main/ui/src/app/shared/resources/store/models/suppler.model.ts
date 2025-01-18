import { LedgerInput } from './ledger-input.model';
import { Ledger } from './ledger.model';
import { StockBatch } from './stock-batch.model';
import { head } from 'lodash';

export interface SupplierObject {
  id?: string;
  name: string;
  description?: string;
}

export class Supplier {
  constructor() {}

  get id(): string {
    return this.id;
  }

  get name(): string {
    return this.name;
  }

  get description(): string {
    return this.description;
  }

  toJson(): SupplierObject {
    return {
      id: this.id,
      name: this.name,
      description: this.description
    };
  }
}
