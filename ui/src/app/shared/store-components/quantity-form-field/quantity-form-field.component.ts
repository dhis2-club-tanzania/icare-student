import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormValue } from "src/app/shared/modules/form/models/form-value.model";
import { Textbox } from "src/app/shared/modules/form/models/text-box.model";

@Component({
  selector: "app-quantity-form-field",
  templateUrl: "./quantity-form-field.component.html",
  styleUrls: ["./quantity-form-field.component.scss"],
})
export class QuantityFormFieldComponent implements OnInit {
  @Input() stockStatusForSelectedStore: any;
  @Input() existingRequisitionItem: any;
  quantityField: any;
  @Output() quantity: EventEmitter<number> = new EventEmitter<number>();
  constructor() {}

  ngOnInit(): void {
    this.createQuantityField();
  }

  createQuantityField(): void {
    this.quantityField = new Textbox({
      id: "quantity",
      key: "quantity",
      label: "Quantity",
      min: 1,
      max: Number(this.stockStatusForSelectedStore?.eligibleQuantity),
      required: true,
      type: "number",
      value: this.existingRequisitionItem
        ? this.existingRequisitionItem?.quantity
        : "",
    });
  }

  onUpdateForm(formValue: FormValue): void {
    this.quantity.emit(Number(formValue.getValues()?.quantity?.value));
  }
}
