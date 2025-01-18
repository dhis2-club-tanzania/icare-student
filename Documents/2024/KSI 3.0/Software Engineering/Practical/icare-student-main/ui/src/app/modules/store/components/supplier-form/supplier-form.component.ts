import { Component, Inject, Input, OnInit } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { from, interval, Observable, of } from "rxjs";
import { debounceTime, map, tap } from "rxjs/operators";
import { LocationService } from "src/app/core/services";
import { formatDateToYYMMDD } from "src/app/shared/helpers/format-date.helper";
import { Dropdown } from "src/app/shared/modules/form/models/dropdown.model";
import { FormValue } from "src/app/shared/modules/form/models/form-value.model";
import { TextArea } from "src/app/shared/modules/form/models/text-area.model";
import { Textbox } from "src/app/shared/modules/form/models/text-box.model";
import { LocationGet } from "src/app/shared/resources/openmrs";
import { LedgerInput } from "src/app/shared/resources/store/models/ledger-input.model";
import { StockObject } from "src/app/shared/resources/store/models/stock.model";
import { StockService } from "src/app/shared/resources/store/services/stock.service";
import { SupplierService } from "src/app/shared/resources/store/services/supplier.service";
import { AddNewStockReceivedComponent } from "../../modals/add-new-stock-received/add-new-stock-received.component";

@Component({
  selector: "app-supplier-form",
  templateUrl: "./supplier-form.component.html",
  styleUrls: ["./supplier-form.component.scss"],
})
export class SupplierFormComponent implements OnInit {
  supplierNameField: any;
  errors: any[] = [];
  supplierFields: any[];
  itemFields: any[];
  formValues: any;
  constructor(
    private dialog: MatDialogRef<SupplierFormComponent>,
    private supplierService: SupplierService,
    @Inject(MAT_DIALOG_DATA) public data
  ) {}

  ngOnInit(): void {
    this.setFields();
  }

  setFields(): void {
    this.supplierFields = [
      new Textbox({
        id: "supplierName",
        key: "supplierName",
        label: "Supplier's Name",
        value: this.data?.supplier ? this.data?.supplier?.name : "",
      }),
      new TextArea({
        id: "supplierDescription",
        key: "supplierDescription",
        label: "Supplier's Description",
        value: this.data?.supplier ? this.data?.supplier?.description : "",
      }),
      new Dropdown({
        id: "supplierLocation",
        key: "supplierLocation",
        label: "Supplier's Location",
        value: this.data?.supplier?.location ? this.data?.supplier?.location?.uuid : null,
        options: this.data?.locations?.map((location) => {
          return {
            key: location?.uuid,
            value: location?.uuid,
            label: location?.display
          }
        })
      })
    ];
  }

  onFormUpdate(formValues: FormValue) {
    this.formValues = formValues.getValues();
  }

  onSaveSupplier(e: any) {
    e?.stopPropagation();
    const supplierObject = {
      name: this.formValues?.supplierName?.value,
      description: this.formValues?.supplierDescription?.value,
      location: {
        uuid: this.formValues?.supplierLocation?.value
      },
    };
    this.supplierService
      .createSuppliers([supplierObject])
      .pipe(
        map((response) => {
          if (!response?.error) {
            this.dialog.close();
            return response;
          }
        })
      )
      .subscribe();
  }

  onUpdateSupplier(e: any) {
    e?.stopPropagation();
    const supplierObject = {
      name: this.formValues?.supplierName?.value,
      description: this.formValues?.supplierDescription?.value,
      location: {
        uuid: this.formValues?.supplierLocation?.value
      }
    };
    this.supplierService
      .updateSupplier(this.data?.supplier?.uuid, supplierObject)
      .pipe(
        map((response) => {
          if (!response?.error) {
            this.dialog.close();
            return response;
          }
        })
      )
      .subscribe();
  }

  onCancel($event) {
    this.dialog.close();
  }
}
