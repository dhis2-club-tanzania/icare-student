import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { PaymentScheme } from "src/app/shared/models/payment-scheme.model";
import { PaymentTypeInterface } from "src/app/shared/models/payment-type.model";
import { Field } from "src/app/shared/modules/form/models/field.model";
import { FormValue } from "src/app/shared/modules/form/models/form-value.model";
import { Textbox } from "src/app/shared/modules/form/models/text-box.model";
import { ItemPriceInterface } from "../../../modules/maintenance/models/item-price.model";
import { PricingItemInterface } from "../../../modules/maintenance/models/pricing-item.model";

@Component({
  selector: "app-pricing-item",
  templateUrl: "./pricing-item.component.html",
  styleUrls: ["./pricing-item.component.scss"],
})
export class PricingItemComponent implements OnInit {
  @Input() pricingItem: PricingItemInterface;
  @Input() paymentScheme: any;
  @Input() paymentType: any;

  showForm: boolean;
  formValue: FormValue;
  fieldId: string;
  pricingItemField: Field<string>;
  payableItemField: Field<string>;
  priceObject: any = {};

  @Output() saveItemPrice = new EventEmitter<any>();
  constructor() {}

  get itemValue(): number | string {
    return this.pricingItem
      ? (this.pricingItem.prices.filter(
          (priceInfo) =>
            priceInfo?.paymentScheme?.uuid ===
              this.paymentScheme?.concept?.uuid &&
            priceInfo?.paymentType?.uuid === this.paymentScheme?.paymentTypeUuid
        ) || [])[0]?.price
      : "";
  }

  get itemPayableValue(): number | string {
    return this.pricingItem
      ? (this.pricingItem.prices.filter(
          (priceInfo) =>
            priceInfo?.paymentScheme?.uuid ===
              this.paymentScheme?.concept?.uuid &&
            priceInfo?.paymentType?.uuid === this.paymentScheme?.paymentTypeUuid
        ) || [])[0]?.payable
      : "";
  }

  ngOnInit() {
    this.fieldId = `${this.paymentScheme?.concept?.uuid}_${this.pricingItem?.uuid}`;

    this.pricingItemField = new Textbox({
      id: this.fieldId,
      label: `Price`,
      key: this.fieldId,
      required: true,
      value: this.itemValue?.toString(),
    });

    this.payableItemField = new Textbox({
      id: this.fieldId + "-payable",
      label: `Payable`,
      key: this.fieldId + "-payable",
      value: this.itemPayableValue?.toString(),
    });
  }

  onToggleForm(e) {
    e.stopPropagation();
    this.showForm = !this.showForm;
  }

  onSaveItemPrice(e) {
    e.stopPropagation();
    this.showForm = false;
    this.saveItemPrice.emit({
      item: {
        uuid: this.pricingItem?.uuid,
      },
      paymentType: { uuid: this.paymentScheme?.paymentTypeUuid },
      paymentScheme: { uuid: this.paymentScheme?.concept?.uuid },
      price: this.priceObject[this.fieldId]?.value,
      payable: this.priceObject[this.fieldId + "-payable"]?.value,
    });
  }

  onPriceUpdate(formValue: FormValue) {
    this.formValue = formValue;
    this.priceObject = { ...this.priceObject, ...formValue.getValues() };
  }

  onPayableUpdate(formValue: FormValue): void {
    this.priceObject = { ...this.priceObject, ...formValue.getValues() };
  }
}
