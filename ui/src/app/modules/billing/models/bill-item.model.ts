import { BillItemObject } from "./bill-item-object.model";

export class BillItem {
  constructor(private billItem: any, private bill: string) {}

  get id(): string {
    return this.billItem?.item?.uuid || this.billItem?.id;
  }

  get name(): string {
    return this.billItem?.item?.concept?.name || this.billItem?.name;
  }

  get quantity(): number {
    return parseInt(this.billItem?.quantity, 10) || 0;
  }

  get price(): number {
    return parseInt(this.billItem?.price, 10) || 0;
  }

  get amount(): number {
    return this.quantity * this.price;
  }

  get calculatedPayableAmount(): number {
    return this.quantity * this.price - this.discount;
  }

  get order(): any {
    return this.billItem.order;
  }

  get discounted(): boolean {
    return this.billItem?.discounted;
  }

  get discount(): number {
    return !isNaN(this.billItem?.discount) ? this.billItem.discount : 0;
  }

  get payable(): number {
    return this.amount - this.discount;
  }

  get paid(): boolean {
    return this.billItem?.paid;
  }

  get confirmed(): boolean {
    return this.billItem?.confirmed;
  }

  public static create(): BillItem {
    return null;
  }

  public toJson(): BillItemObject {
    return {
      id: this.id,
      uuid: this.id,
      item: this.name,
      amount: this.amount,
      quantity: this.quantity,
      discount: this.discount,
      price: this.price,
      payable: this.payable,
      bill: this.bill,
      order: this.order,
      calculatedPayableAmount: this.calculatedPayableAmount,
    };
  }
}
