import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormValue } from 'src/app/shared/modules/form/models/form-value.model';

import { map, filter } from 'lodash';

@Component({
  selector: 'app-orders-options-form',
  templateUrl: './orders-options-form.component.html',
  styleUrls: ['./orders-options-form.component.scss'],
})
export class OrdersOptionsFormComponent implements OnInit {
  @Input() fieldOption: any;
  @Input() provider: any;
  @Input() orderType: any;
  @Input() orderTypes: any[];
  @Input() orderClassName: string;
  @Input() isBillable: boolean;
  @Input() orderMapping: Array<any>;
  @Input() setMember: any;
  @Input() departmentGroup: any;
  formattedField: any;
  @Output() formValues = new EventEmitter<any>();

  orderEnabled: boolean;

  currentOrderType: any;
  constructor() {}

  ngOnInit(): void {
    this.orderEnabled =
      filter(this.orderMapping, (orderMap) => {
        return orderMap?.display === 'Lab Test Availability: no (no)'
          ? true
          : false;
      })?.length === 0
        ? true
        : false;
    // TODO: Find a better way to work with the order types in relation to item to be ordered
    this.currentOrderType = this.orderClassName
      ? (filter(this.orderTypes, (orderType) => {
          if (
            orderType?.conceptClassName == this.orderClassName ||
            orderType?.conceptClassName
              .toLowerCase()
              .indexOf(this.departmentGroup.name.toLowerCase().split(' ')[0]) >
              -1
          ) {
            return orderType;
          }
        }) || [])[0]
      : null;

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
     * TODO: use store to hold orders to be saved and softcode order types
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
      orderType: this.currentOrderType?.uuid,
      type:
        this.departmentGroup?.name?.toLowerCase().indexOf('radiology') > -1 ||
        this.currentOrderType?.name?.toLowerCase().indexOf('procedure') > -1 ||
        this.currentOrderType?.name?.toLowerCase().indexOf('admission') > -1
          ? 'order'
          : this.currentOrderType?.name.replace(' ', '').toLowerCase(),
      hasValue: formDataValue[Object.keys(formDataValue)[0]]?.value,
    });

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
}
