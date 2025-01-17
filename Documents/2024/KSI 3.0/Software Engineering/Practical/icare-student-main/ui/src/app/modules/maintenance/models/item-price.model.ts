export interface ItemPriceInterface {
  id: string;
  uuid: string;
  price: number;
  paymentScheme: string;
  paymentType: string;
}

export class ItemPrice {
  constructor(private itemPriceDetails: any) {}

  get uuid(): string {
    return this.itemPriceDetails?.item?.uuid;
  }

  get id(): string {
    return `${this.uuid}:${this.paymentScheme?.uuid}`;
  }

  get display(): string {
    return this.itemPriceDetails?.item?.display;
  }

  get paymentType(): any {
    return this.itemPriceDetails?.paymentType;
  }

  get paymentScheme(): any {
    return this.itemPriceDetails?.paymentScheme;
  }

  get price(): number {
    return this.itemPriceDetails?.price;
  }

  toJson(): ItemPriceInterface {
    return {
      id: this.id,
      uuid: this.uuid,
      price: this.price,
      paymentScheme: this.paymentScheme?.uuid,
      paymentType: this.paymentType?.uuid,
    };
  }
}
