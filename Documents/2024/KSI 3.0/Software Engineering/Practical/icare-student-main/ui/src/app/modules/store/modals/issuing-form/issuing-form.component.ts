import { Component, Inject, OnInit } from "@angular/core";
import { MatCheckboxChange } from "@angular/material/checkbox";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { orderBy, uniqBy } from "lodash";
import { Observable } from "rxjs";
import { Dropdown } from "src/app/shared/modules/form/models/dropdown.model";
import { Field } from "src/app/shared/modules/form/models/field.model";
import { FormValue } from "src/app/shared/modules/form/models/form-value.model";
import { Textbox } from "src/app/shared/modules/form/models/text-box.model";
import { LocationGet } from "src/app/shared/resources/openmrs";
import {
  IssueInput,
  IssuingObject,
} from "src/app/shared/resources/store/models/issuing.model";
import { RequisitionInput } from "src/app/shared/resources/store/models/requisition-input.model";
import { StockService } from "src/app/shared/resources/store/services/stock.service";

@Component({
  selector: "app-issuing-form",
  templateUrl: "./issuing-form.component.html",
  styleUrls: ["./issuing-form.component.scss"],
})
export class IssuingFormComponent implements OnInit {
  issuingFormValue: FormValue;
  issueFormFields: Field<string>[];
  quantityFormField: Field<string>;
  eligibleQuantity: number = 0;
  stockStatusOfTheItemOnRequestingStore$: Observable<any>;
  stockStatusOfTheItemOnRequestedStore$: Observable<any>;
  quantityToIssue: number;
  isFormValid: boolean = false;

  orderedBatchesByExpirlyDate: any[] = [];

  formData: any = {};
  autoSelectBatch: boolean = true;

  batchSelectionField: Field<string>;

  eligibleBatches: any[] = [];
  quantityFromEligibleBatches: number = 0;
  constructor(
    private dialogRef: MatDialogRef<IssuingFormComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { issue: any; item: any; currentStore: LocationGet },
    private stockService: StockService
  ) {}

  ngOnInit() {
    this.stockStatusOfTheItemOnRequestingStore$ =
      this.stockService.getAvailableStockOfAnItem(
        this.data?.item?.item?.uuid,
        this.data?.issue?.requestingLocation?.uuid
      );
    this.stockStatusOfTheItemOnRequestedStore$ =
      this.stockService.getAvailableStockOfAnItem(
        this.data?.item?.item?.uuid,
        this.data?.issue?.requestedLocation?.uuid
      );
    this.issueFormFields = [
      new Textbox({
        id: "item",
        label: "Item",
        key: "item",
        disabled: true,
        value: this.data?.item?.item?.display,
      }),
      new Textbox({
        id: "requesting_store",
        key: "requestingStore",
        label: "Requesting Store",
        disabled: true,
        value: this.data?.issue?.requestingLocation?.display,
      }),
      new Textbox({
        id: "requested_store",
        key: "requestedStore",
        label: "Requested Store",
        disabled: true,
        value: this.data?.issue?.requestedLocation?.display,
      }),
    ];

    this.quantityFormField = new Textbox({
      id: "quantity",
      key: "quantity",
      required: true,
      label: `Quantity max(${this.data?.item?.quantity})`,
      type: "number",
      min: 0,
      max: this.data?.item?.quantity,
    });
  }

  getBatchsNotExpired(batches) {
    this.orderedBatchesByExpirlyDate = orderBy(
      batches?.filter(
        (batch) => Number(batch?.quantity) > 0 && batch?.expiryDate > Date.now()
      ),
      ["expiryDate"],
      ["asc"]
    );
  }

  onToggleAutoSelection(
    event: MatCheckboxChange,
    stockStatusOfAnItem: any
  ): void {
    this.autoSelectBatch = event?.checked;
    this.getBatchsNotExpired(stockStatusOfAnItem?.batches);
    this.eligibleBatches = [];

    this.batchSelectionField = new Dropdown({
      id: "batch",
      key: "batch",
      label: "Batch to use",
      options: this.orderedBatchesByExpirlyDate?.map((batch) => {
        return {
          value: batch?.batch,
          key: batch?.batch,
          label: batch?.batch + " - " + new Date(batch?.expiryDate).toString(),
        };
      }),
    });
  }

  onCancel(e: Event): void {
    e.stopPropagation();
    this.dialogRef.close();
  }

  onIssue(e: Event): void {
    e.stopPropagation();
    const formValues = this.formData;
    let remainedQuantityToIssue = Number(formValues?.quantity.value);
    const issueInput: IssueInput = {
      requisitionUuid: this.data?.issue?.uuid,
      issuedLocationUuid: this.data?.issue?.requestingLocation.uuid,
      issuingLocationUuid: this.data?.issue?.requestedLocation.uuid,
      issueItems: this.eligibleBatches?.map((batch) => {
        let quantityToIssue =
          remainedQuantityToIssue > batch?.quantity
            ? batch?.quantity
            : remainedQuantityToIssue;
        remainedQuantityToIssue =
          remainedQuantityToIssue > batch?.quantity
            ? remainedQuantityToIssue - Number(batch?.quantity)
            : 0;
        return {
          itemUuid: this.data?.item?.item?.uuid,
          quantity: parseInt(quantityToIssue.toString(), 10),
          batch: batch?.batch,
          expiryDate: new Date(batch?.expiryDate),
        };
      }),
    };
    this.dialogRef.close({ issueInput });
  }

  onUpdateForm(formValue: FormValue, stockStatusOfAnItem: any): void {
    this.getBatchsNotExpired(stockStatusOfAnItem?.batches);
    this.issuingFormValue = formValue;
    this.formData = { ...this.formData, ...this.issuingFormValue.getValues() };
    this.isFormValid = this.issuingFormValue.isValid;
    this.quantityToIssue = this.issuingFormValue.getValues()?.quantity
      ? Number(this.issuingFormValue.getValues()?.quantity?.value)
      : 0;

    if (this.quantityToIssue) {
      if (!this.autoSelectBatch) {
        this.eligibleBatches =
          this.orderedBatchesByExpirlyDate?.filter(
            (batch) => batch?.batch === this.formData?.batch?.value
          ) || [];
        this.quantityFromEligibleBatches = this.eligibleBatches[0]?.quantity;
      } else {
        let batchQuantity = 0;
        let count = 0;
        while (this.quantityToIssue > batchQuantity) {
          batchQuantity =
            batchQuantity +
            Number(this.orderedBatchesByExpirlyDate[count]?.quantity);
          this.eligibleBatches = uniqBy(
            [...this.eligibleBatches, this.orderedBatchesByExpirlyDate[count]],
            "batch"
          );
          this.quantityFromEligibleBatches = batchQuantity;
          count++;
        }
      }
    } else {
      this.eligibleBatches = [];
    }
  }
}
