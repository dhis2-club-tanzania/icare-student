import { BILLING_CONFIGURATION } from '../constants/billing-configuration.constant';
import { PaymentItem } from './payment-item.model';
import { PaymentObject } from './payment-object.model';

export class Payment {
  constructor(private paymentDetails, private paymentIndex?: number) {}

  // Accessing controlNumber
  get controlNumber(): string {
    return this.paymentDetails?.controlNumber; 
  }

  // TODO This may change provided payment is returned with uuid
  get id(): string {
    return this.paymentDetails?.uuid;
  }

  get bill(): string {
    return this.paymentDetails?.invoice?.uuid;
  }
  
  get visit(): string {
    return this.paymentDetails?.visit?.uuid;
  }

  get paymentType(): any {
    return this.paymentDetails?.paymentType;
  }

  get referenceNumber(): string {
    return this.paymentDetails?.referenceNumber;
  }

  get status(): string  {
    //TODO: Find best way to get payment status
    return this.paymentDetails?.status;
  }
  

  get items(): any[] {
    return (this.paymentDetails?.items || []).map(
      (item) =>
        new PaymentItem(item, {
          paymentType: this.paymentType,
          confirmedBy: this.confirmedBy,
          created: this.created,
          referenceNumber: this.referenceNumber,
        })
    );
  }

  get amount(): number {
    return (this.items || []).reduce(
      (sum, item) => sum + parseInt(item.amount, 10),
      0
    );
  }

  get created(): string {
    return this.paymentDetails?.created
      ? new Date(this.paymentDetails.created).toISOString()
      : undefined;
  }

  get confirmedBy(): string {
    return this.paymentDetails?.creator?.display;
  }

  toJson(): PaymentObject {
    return {
      id: this.id,
      bill: this.bill,
      paymentType: this.paymentType,
      items: this.items,
      amount: this.amount,
      status: this.status,
      referenceNumber: this.referenceNumber,
      visit: this.visit,
    };
  }
}
