import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Observable } from "rxjs";
import { SupplierService } from "../../resources/store/services/supplier.service";
import { map } from "rxjs/operators";
import { SystemSettingsService } from "src/app/core/services/system-settings.service";

@Component({
  selector: "app-stock-invoice-form-dialog",
  templateUrl: "./stock-invoice-form-dialog.component.html",
  styleUrls: ["./stock-invoice-form-dialog.component.scss"],
})
export class StockInvoiceFormDialogComponent implements OnInit {
  suppliers$: Observable<any>;
  unitsOfMeasurementSettings$: Observable<string>;
  errors: any[] = [];
  constructor(
    private dialogRef: MatDialogRef<StockInvoiceFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private supplierService: SupplierService,
    private systemSettingsService: SystemSettingsService
  ) {}

  ngOnInit() {
    this.suppliers$ = this.supplierService.getSuppliers().pipe(
      map((response) => {
        if (!response?.error) {
          return response;
        }
        if (response?.error) {
          this.errors = [...this.errors, response.error];
        }
      })
    );

    this.unitsOfMeasurementSettings$ =
      this.systemSettingsService.getSystemSettingsByKey(
        "iCare.store.mappings.items.unitOfMeasure.mappingSource"
      );
  }

  onClosePopup(e?: any) {
    this.dialogRef.close();
  }
}
