import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormValue } from 'src/app/shared/modules/form/models/form-value.model';

@Component({
  selector: 'app-orders-options-form',
  templateUrl: './orders-options-form.component.html',
  styleUrls: ['./orders-options-form.component.scss'],
})
export class OrdersOptionsFormComponent implements OnInit {
  @Input() fieldOption: any;
  @Input() provider: any;
  @Input() orderType: any;
  formattedField: any;
  @Output() formValues = new EventEmitter<any>();
  constructor() {}

  ngOnInit(): void {
    this.formattedField = {
      key: this.fieldOption?.key ? this.fieldOption?.key : this.fieldOption?.id,
      id: this.fieldOption?.key ? this.fieldOption?.key : this.fieldOption?.id,
      label: this.fieldOption?.label
        ? this.fieldOption?.label
        : this.fieldOption?.name,
      required: false,
      order: 1,
      controlType: 'checkboxbtn',
      type: '',
      value: null,
    };
  }

  onFormUpdate(formValue: FormValue): void {
    /**
     * TODO: use store to hold orders to be saved
     */
    const formDataValue = formValue.getValues();
    this.formValues.emit({
      id: this.fieldOption?.key ? this.fieldOption?.key : this.fieldOption?.id,
      key: this.fieldOption?.key ? this.fieldOption?.key : this.fieldOption?.id,
      valueName: this.fieldOption?.label
        ? this.fieldOption?.label
        : this.fieldOption?.name,
      value: Object.keys(formDataValue)[0],
      orderer: this.provider?.uuid,
      orderType: this.orderType?.uuid,
      hasValue: formDataValue[Object.keys(formDataValue)[0]]?.value,
    });
  }
}
