export interface LedgerTypeObject {
  id: string;
  name: string;
  operation: string;
}

export class LedgerType {
  constructor(private ledgerType: any) {}

  get id(): string {
    return this.ledgerType?.uuid;
  }

  get name(): string {
    return this.ledgerType?.name;
  }

  get operation(): string {
    return this.ledgerType?.operation;
  }

  toJson(): LedgerTypeObject {
    return {
      id: this.id,
      name: this.name,
      operation: this.operation,
    };
  }
}
