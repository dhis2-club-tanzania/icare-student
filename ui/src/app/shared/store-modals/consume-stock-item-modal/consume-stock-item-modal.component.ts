import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { of, zip } from "rxjs";
import { Dropdown } from "src/app/shared/modules/form/models/dropdown.model";
import { FormValue } from "src/app/shared/modules/form/models/form-value.model";
import { TextArea } from "src/app/shared/modules/form/models/text-area.model";
import { Textbox } from "src/app/shared/modules/form/models/text-box.model";
import { LedgerInput } from "src/app/shared/resources/store/models/ledger-input.model";
import { StockService } from "src/app/shared/resources/store/services/stock.service";

@Component({
  selector: "app-consume-stock-item-modal",
  templateUrl: "./consume-stock-item-modal.component.html",
  styleUrls: ["./consume-stock-item-modal.component.scss"],
})
export class ConsumeStockItemModalComponent implements OnInit {
  formFields: any[];
  isFormValid: boolean = false;
  quantity: number;
  remarks: string;
  saving: boolean = false;
  searchItemField: any;
  currentItemStock: any;
  expiredDate: any;
  itemUuids: any;
  batchNumber: string;
  constructor(
    private dialogRef: MatDialogRef<ConsumeStockItemModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private stockService: StockService
  ) {}

  ngOnInit(): void {
    console.log("data ............................................", this.data);
    this.currentItemStock = this.data?.currentItemStock;
    if (!this.currentItemStock) {
      this.searchItemField = new Dropdown({
        id: "stockItem",
        key: "stockItem",
        label: "Item",
        required: true,
        options: [],
        locationUuid: this.data?.currentLocation?.uuid,
        searchControlType: "drugStock",
        shouldHaveLiveSearchForDropDownFields: true,
      });
    }
    this.createQuantityAndRemarksFields();
  }

  // onGetSelectedItem(formValue: FormValue): void {
  //   this.currentItemStock = formValue.getValues()?.stockItem?.value;
  //   // console.log("currentItemStock", this.currentItemStock);
  //   console.log("searched item ---------------------->",this.currentItemStock)
  //   if (this.currentItemStock?.batches) {
  //     this.formFields = null;
  //     setTimeout(() => {
  //       this.createQuantityAndRemarksFields();
  //     }, 50);
  //   }
  // }
  onGetSelectedItem(formValue: FormValue): void {
    this.currentItemStock = formValue.getValues()?.stockItem?.value;
    // console.log("searched item ---------------------->", this.currentItemStock);

    if (
      this.currentItemStock?.batches &&
      this.currentItemStock.batches.length > 0
    ) {
      //capture expiredate from the body
      const expiryDates = this.currentItemStock.batches
        .filter((batch) => batch.expiryDate)
        .map((batch) => batch.expiryDate);
      //capturing batch number
      const batchnumber = this.currentItemStock.batches
        .filter((batch) => batch.batch)
        .map((batch) => batch.batch);
      //capturing itemUuid
      const itemUuid = this.currentItemStock.batches
        .filter((batch) => batch.itemUuid)
        .map((batch) => batch.itemUuid);

      this.itemUuids = itemUuid[0];
      this.expiredDate = expiryDates[0];
      this.batchNumber = batchnumber[0];

      console.log("itemUuid:", itemUuid[0]);
      console.log("Expiry Dates:", expiryDates[0]);
      console.log("batch number:", batchnumber[0]);
      this.formFields = null;

      setTimeout(() => {
        this.createQuantityAndRemarksFields();
      }, 50);
    }
  }

  createQuantityAndRemarksFields(): void {
    this.formFields = [
      new Textbox({
        id: "quantity",
        key: "quantity",
        label: "Quantity",
        required: true,
        type: "number",
        min: 1,
        max: this.currentItemStock?.eligibleQuantity
          ? this.currentItemStock?.eligibleQuantity
          : this.currentItemStock?.quantity,
      }),
      new TextArea({
        id: "remarks",
        key: "remarks",
        label: "Remarks",
        required: true,
      }),
    ];
  }

  onFormUpdate(formValue: FormValue): void {
    this.isFormValid = formValue.isValid;
    this.quantity = Number(formValue.getValues()?.quantity?.value);
    this.remarks = formValue.getValues()?.remarks?.value;
  }

  onClose(event: Event): void {
    event.stopPropagation();
    this.dialogRef.close();
  }

  onSave(event: Event): void {
    this.saving = true;
    let batchesToDeduct = [];
    let quntityValidator = 0;
    // TODO: Use for loop and break when condition is met
    (
      this.currentItemStock?.batches?.filter((batch) => !batch?.isExpired) || []
    )?.forEach((eligibleBatch) => {
      if (quntityValidator < this.quantity) {
        quntityValidator += this.quantity;
        batchesToDeduct = [...batchesToDeduct, eligibleBatch];
      }
    });
    zip(
      ...batchesToDeduct.map((batch) => {
        const ledgerInput: LedgerInput = {
          // itemUuid: this.data?.currentItemStock?.id,
          itemUuid: this.itemUuids,
          ledgerTypeUuid: this.data && this.data?.ledger?.id,
          locationUuid: this.currentItemStock?.location?.uuid,
          quantity: this.quantity,
          buyingPrice: 0,
          batchNo: this.batchNumber,
          expiryDate: this.expiredDate,
          remarks: this.remarks,
        };
        // console.log(ledgerInput);
        // return of(null);
        return this.stockService.saveStockLedger(ledgerInput);
      })
    ).subscribe((response: any) => {
      if (response && !response?.error) {
        this.saving = false;
        this.dialogRef.close(true);
      }
    });
  }
}
