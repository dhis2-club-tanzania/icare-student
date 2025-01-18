import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { getSanitizedFormObject } from "src/app/shared/modules/form/helpers/get-sanitized-form-object.helper";
import { Dropdown } from "src/app/shared/modules/form/models/dropdown.model";
import { FormValue } from "src/app/shared/modules/form/models/form-value.model";
import { Textbox } from "src/app/shared/modules/form/models/text-box.model";
import { BillItem } from "../../models/bill-item.model";
import { BillObject } from "../../models/bill-object.model";
import { Bill } from "../../models/bill.model";
import { BillingService } from "../../services/billing.service";
import { ExemptionConfirmationComponent } from "../exemption-confirmation/exemption-confirmation.component";
import * as _ from "lodash";

@Component({
  selector: "app-exemption-item",
  templateUrl: "./exemption-item.component.html",
  styleUrls: ["./exemption-item.component.scss"],
})
export class ExemptionItemComponent implements OnInit {
  @Input() bill: BillObject;
  @Input() criteria: any;
  exemptionForm: any;
  criteriaObject: any = {};

  exemptionDetails: any;
  file: any;

  @Output() confirmExemption = new EventEmitter();
  private _billItems: BillItem[];
  constructor(
    private dialog: MatDialog,
    private billingService: BillingService
  ) {}

  set billItems(billItems: BillItem[]) {
    this._billItems = billItems;
  }

  get billItems(): BillItem[] {
    return this._billItems;
  }

  get totalBillDiscount(): number {
    return (this.billItems || []).reduce((sum, item) => sum + item.discount, 0);
  }

  get totalPayableBill(): number {
    return (this.billItems || []).reduce((sum, item) => sum + item.payable, 0);
  }

  ngOnInit(): void {
    this.billItems = this.bill?.items;
    this.exemptionDetails = {};

    this.criteriaObject = {
      id: this.criteria["display"],
      key: this.criteria["display"],
      label: this.criteria["display"],
      options: _.map(this.criteria["answers"], (answer) => {
        return {
          key: answer["uuid"],
          value: answer["uuid"],
          label: answer["display"],
        };
      }),
    };

    // this.billingService.discountCriteriaConcept().subscribe(results => {
    //   this.exemptionForm['criteria'] = getSanitizedFormObject(results?.results[0])
    /*{
      id: 'criteria',
      key: 'criteria',
      label: 'Criteria',
      options: [
        { key: 'under five', value: 'UNDER_FIVE', label: 'Under five' },
      ],
    }

      */
    // })

    this.exemptionForm = {
      criteria: new Dropdown(this.criteriaObject),
      exemptionType: new Dropdown({
        id: "exemptionType",
        key: "exemptionType",
        label: "Exemption Type",
        options: [
          {
            key: "FULL_EXEMPTION",
            value: "FULL_EXEMPTION",
            label: "Full Exemption",
          },
          {
            key: "PARTIAL_EXEMPTION",
            value: "PARTIAL_EXEMPTION",
            label: "Partial Exemption",
          },
        ],
      }),
      remarks: new Textbox({
        id: "remarks",
        key: "remarks",
        label: "Remark",
      }),
    };
  }

  onDiscountUpdate(e, billItem: BillItem): void {
    e.stopPropagation();
    const amount = parseInt(e.target.value, 10);
    this.exemptionDetails = {
      ...this.exemptionDetails,
      items: {
        ...(this.exemptionDetails.items || {}),
        [billItem.id]: {
          amount,
          item: billItem.id,
          invoice: this.bill?.id,
        },
      },
    };

    const billItemObjects = this.billItems
      .map((item) => item.toJson())
      .map((itemObject) => ({
        ...itemObject,
        discount: itemObject.id === billItem.id ? amount : itemObject.discount,
      }));

    const newBill = new Bill({ ...this.bill, items: billItemObjects });

    this.billItems = newBill.items;
  }

  onFormUpdate(formValue: FormValue): void {
    this.exemptionDetails = {
      ...this.exemptionDetails,
      ...formValue.getValues(),
    };

    if (this.exemptionDetails?.exemptionType?.value === "FULL_EXEMPTION") {
      const billItemObjects = this.billItems
        .map((item) => item.toJson())
        .map((itemObject) => ({
          ...itemObject,
          discount: itemObject.amount,
        }));

      const newBill = new Bill({ ...this.bill, items: billItemObjects });

      this.billItems = newBill.items;

      (this.billItems || []).forEach((billItem) => {
        this.exemptionDetails = {
          ...this.exemptionDetails,
          items: {
            ...(this.exemptionDetails.items || {}),
            [billItem.id]: {
              amount: billItem.discount,
              item: billItem.id,
              invoice: this.bill?.id,
            },
          },
        };
      });
    }
  }

  onConfirmExemption(e): void {
    e.stopPropagation();
    const dialog = this.dialog.open(ExemptionConfirmationComponent, {
      width: "25%",
      panelClass: "custom-dialog-container",
      data: {
        modelTitle: "Exemption confirmation",
        modelMessage:
          "This is to confirm that you have exempted from the client",
      },
    });

    dialog.afterClosed().subscribe((data) => {
      if (data?.confirmed) {
        this.confirmExemption.emit({
          discountDetails: { ...this.exemptionDetails, file: this.file },
          bill: this.bill,
        });
      }
    });
  }

  fileSelection(event): void {
    event.stopPropagation();
    this.file = event.target.files[0];
  }
}
