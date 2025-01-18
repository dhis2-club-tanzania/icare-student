import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Dropdown } from "src/app/shared/modules/form/models/dropdown.model";
import { FormValue } from "src/app/shared/modules/form/models/form-value.model";
import { TextArea } from "src/app/shared/modules/form/models/text-area.model";
import { Textbox } from "src/app/shared/modules/form/models/text-box.model";
import { OpenmrsHttpClientService } from "src/app/shared/modules/openmrs-http-client/services/openmrs-http-client.service";

@Component({
  selector: "app-add-new-stock-received",
  templateUrl: "./add-new-stock-received.component.html",
  styleUrls: ["./add-new-stock-received.component.scss"],
})
export class AddNewStockReceivedComponent implements OnInit {
  ledgerTypes: any[];
  currentStore: Location;
  billableItems: any[];
  remarks: string;
  response$: Observable<any>;
  saving: boolean = false;
  formFields: any[];
  stockData: any;
  isFormValid: boolean;
  constructor(
    private dialogRef: MatDialogRef<AddNewStockReceivedComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private httpClient: OpenmrsHttpClientService
  ) {
    this.ledgerTypes = data?.ledgerTypes;
    this.currentStore = data?.currentStore;
    this.billableItems = data?.billableItems;
  }

  ngOnInit(): void {
    // Create formfields
    this.formFields = [
      new Textbox({
        id: "batchNo",
        key: "batchNo",
        label: "Batch NO",
        type: "text",
        required: true,
        disabled: false,
        value: "",
      }),
      new Textbox({
        id: "expiryDate",
        key: "expiryDate",
        label: "Expiry date",
        type: "date",
        controlType: "date",
        required: true,
        disabled: false,
        value: "",
      }),
      {
        id: "stockableItem",
        key: "stockableItem",
        label: "Item",
        type: "text",
        controlType: "dropdown",
        shouldHaveLiveSearchForDropDownFields: true,
        searchControlType: "billableItem",
        conceptClass: null,
        required: true,
        disabled: false,
        options: [],
        value: "",
      },
      new Textbox({
        id: "quantity",
        key: "quantity",
        label: "Quantity",
        type: "number",
        disabled: false,
        required: true,
        value: "",
      }),
      new Textbox({
        id: "buyingPrice",
        key: "buyingPrice",
        label: "Buying price",
        type: "number",
        disabled: false,
        required: true,
        value: "",
      }),
      new TextArea({
        id: "remarks",
        key: "remarks",
        label: "Remarks",
        type: "text",
        disabled: false,
        value: "",
      }),
    ];
  }

  onUpdateForm(formValues: FormValue) {
    const values = formValues.getValues();
    this.isFormValid = formValues.isValid;
    this.stockData = {
      batchNo: values?.batchNo?.value,
      item: {
        uuid: values?.stockableItem?.value,
      },
      expiryDate: new Date(values?.expiryDate?.value),
      remarks: values.remarks?.value,
      ledgerType: {
        uuid: "06d7195f-1779-4964-b6a8-393b8152956a",
      },
      location: {
        uuid: "4187da6a-262f-45cf-abf1-a98ae80d0b8b",
      },
      buyingPrice: Number(values.buyingPrice?.value),
      quantity: Number(values.quantity?.value),
    };
  }

  onClose(event: Event) {
    event.stopPropagation();
    this.dialogRef.close();
  }

  onSave(event) {
    event.stopPropagation();

    this.saving = true;
    this.response$ = this.httpClient.post("store/ledger", this.stockData);
    this.response$.subscribe((res) => {
      if (res) {
        this.saving = false;
        setTimeout(() => {
          this.dialogRef.close(true);
        }, 100);
      }
    });
  }
}
