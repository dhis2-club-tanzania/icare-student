import { BillItem } from "./bill-item.model";
import { BillObject } from "./bill-object.model";
import { BillPayment } from "./bill-payment.model";
import { keys, flatten, find } from "lodash";
import { PaymentInput } from "./payment-input.model";
import * as _ from "lodash";

export class Bill {
  constructor(public billDetails: any) {}

  get id(): string {
    return this.billDetails?.uuid;
  }

  get uuid(): string {
    return this.id;
  }

  get patient(): string {
    return this.billDetails?.patientUuid;
  }
  get created(): string {
    return this.billDetails?.date;
  }

  get discounted(): boolean {
    return this.discount && this.discount > 0 ? true : false;
  }

  get status(): "NEW" | "PENDING" {
    return this.billDetails?.status;
  }

  get items(): BillItem[] {
    const paymentItems = flatten(
      (this.billDetails.payments || [])
        .map((payment) => payment?.items)
        .filter((item) => item)
    );

    return (this.billDetails?.items || [])
      .filter((billItem) => {
        return (
          paymentItems.filter(
            (paymentItem) => paymentItem?.item?.uuid === billItem?.item?.uuid
          ).length === 0
        );
      })
      .map((billItem) => {
        let discount = 0;

        const discountsForABillItem = _.filter(
          this.billDetails?.discountItems,
          (discountItem) => {
            return discountItem?.item?.uuid == billItem?.item?.uuid
              ? true
              : false;
          }
        );

        _.each(discountsForABillItem, (discountForABillItem) => {
          discount += discountForABillItem?.amount;
        });

        return new BillItem(
          {
            ...billItem,
            discount: discount === 0 ? billItem.discount : discount,
            discounted: discount > 0 ? true : false,
          },
          this.id
        );
      });
  }

  get itemPayments(): any[] {
    return this.items.map((billItem: BillItem) => {
      return {
        item: {
          uuid: billItem.id,
          display: billItem.name,
        },
        invoice: {
          uuid: this.id,
        },
        order: billItem.order,
        amount: billItem.payable,
      };
    });
  }

  get totalPaymentAmount(): number {
    return (this.itemPayments || []).reduce(
      (sum, item) => sum + item.amount,
      0
    );
  }
  get payable(): number {
    return this.items
      .map((item) => item.payable)
      .reduce(
        (previousPayable, currentPayable) => previousPayable + currentPayable,
        0
      );
  }

  get discount(): number {
    return this.items
      .map((item) => item.discount)
      .reduce(
        (previousDiscount, currentDiscount) =>
          previousDiscount + currentDiscount,
        0
      );
  }

  get confirmed(): boolean {
    return this.billDetails?.confirmed;
  }

  get paymentMode(): string {
    return this.billDetails?.paymentMode?.display;
  }

  get isInsurance(): boolean {
    return this.paymentMode === "Insurance";
  }

  public static create(input: any): Bill {
    return new Bill({});
  }

  get visitUuid(): string {
    return this.billDetails?.visit?.uuid;
  }

  public static createDiscount(discountDetails) {
    const items = keys(discountDetails.items).map((key) => {
      const itemObject = discountDetails?.items
        ? discountDetails.items[key]
        : null;

      if (!itemObject) {
        return null;
      }

      return {
        item: {
          uuid: itemObject.item,
        },
        invoice: {
          uuid: itemObject.invoice,
        },

        amount: itemObject.amount,
      };
    });

    return {
      exempted: discountDetails?.isFullExempted
        ? discountDetails?.isFullExempted
        : false,
      remarks: discountDetails?.remarks?.value,
      patient: {
        uuid: discountDetails?.patient,
      },
      criteria: {
        uuid: discountDetails?.Criteria?.value,
      },
      attachment: discountDetails?.attachmentUuid
        ? {
            uuid: discountDetails?.attachmentUuid,
          }
        : null,
      items,
    };
  }

  public static createPayment(
    bill: BillObject,
    paymentInput: PaymentInput
  ): BillPayment {
    const billInstance = new Bill({
      ...(bill as any).billDetails,
      items: (paymentInput?.confirmedItems || []).map((item) => item.toJson()),
    });

    return {
      invoice: {
        uuid: billInstance?.id,
      },
      paymentType: {
        uuid: paymentInput?.paymentType?.uuid,
        display: paymentInput?.paymentType?.display,
      },
      referenceNumber: paymentInput?.referenceNumber,

      items: billInstance.itemPayments,
    };
  }

  public toJson(): BillObject {
    return {
      id: this.id,
      uuid: this.uuid,
      patient: this.patient,
      created: this.created,
      status: this.status,
      payable: this.payable,
      discount: this.discount,
      items: this.items,
      discounted: this.discounted,
      visitUuid: this.visitUuid,
    };
  }
}
