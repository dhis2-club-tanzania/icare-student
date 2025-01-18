export class PaymentItem {
  constructor(
    private paymentItem: any,
    private options: {
      paymentType: any;
      confirmedBy: string;
      created: string;
      referenceNumber: string;
    }
  ) {}

  get name(): string {
    return this.paymentItem?.item?.name;
  }

  get amount(): string {
    return this.paymentItem?.amount;
  }

  get paymentType(): string {
    return this.options?.paymentType?.name;
  }

  get confirmedBy(): string {
    return this.options?.confirmedBy;
  }

  get created(): string {
    return this.options?.created;
  }

  get referenceNumber(): string {
    return this.options?.referenceNumber;
  }
}
