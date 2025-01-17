import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { map } from "rxjs/operators";
import { GoogleAnalyticsService } from "src/app/google-analytics.service";
import { Dropdown } from "src/app/shared/modules/form/models/dropdown.model";
import { FormValue } from "src/app/shared/modules/form/models/form-value.model";
import { TextArea } from "src/app/shared/modules/form/models/text-area.model";
import { Textbox } from "src/app/shared/modules/form/models/text-box.model";
import { SupplierService } from "src/app/shared/resources/store/services/supplier.service";

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
    private googleAnalyticsService: GoogleAnalyticsService,
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
        value: this.data?.supplier ? this.data?.supplier?.name : null,
      }),
      new TextArea({
        id: "supplierDescription",
        key: "supplierDescription",
        label: "Supplier's Description",
        value: this.data?.supplier ? this.data?.supplier?.description : null,
      }),
      new Dropdown({
        id: "supplierLocation",
        key: "supplierLocation",
        label: "Supplier's Location",
        value: this.data?.supplier?.location
          ? this.data?.supplier?.location?.uuid
          : null,
        options: this.data?.locations?.map((location) => {
          return {
            key: location?.uuid,
            value: location?.uuid,
            label: location?.display,
          };
        }),
      }),
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
        uuid: this.formValues?.supplierLocation?.value,
      },
    };
    this.supplierService
      .createSuppliers([supplierObject])
      .pipe(
        map((response) => {
          if (!response?.error) {

            this.trackActionForAnalytics('Add Suppliers: Save');

            this.dialog.close();
            return response;
          }
        })
      )
      .subscribe();
  }

  trackActionForAnalytics(eventname: any) {
    // Send data to Google Analytics
   this.googleAnalyticsService.sendAnalytics('Pharmacy',eventname,'Pharmacy')
  }

  onUpdateSupplier(e: any) {
    e?.stopPropagation();
    const supplierObject = {
      name: this.formValues?.supplierName?.value,
      description: this.formValues?.supplierDescription?.value,
      location: {
        uuid: this.formValues?.supplierLocation?.value,
      },
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
