import { Component, OnInit } from "@angular/core";
import { WorkSheetsService } from "src/app/modules/laboratory/resources/services/worksheets.service";
import { FormValue } from "src/app/shared/modules/form/models/form-value.model";

@Component({
  selector: "app-worksheet-configuration",
  templateUrl: "./worksheet-configuration.component.html",
  styleUrls: ["./worksheet-configuration.component.scss"],
})
export class WorksheetConfigurationComponent implements OnInit {
  isFormValid: boolean = false;
  worksheetPayload: any = {};
  errors: any[] = [];
  saving: boolean = false;
  constructor(private worksheetsService: WorkSheetsService) {}

  ngOnInit(): void {}

  onSave(event: Event): void {
    event.stopPropagation();
    this.saving = true;
    this.errors = [];
    this.worksheetsService
      .createWorkSheet([this.worksheetPayload])
      .subscribe((response) => {
        if (response && !response?.error) {
          this.saving = false;
        } else {
          this.saving = false;
          this.errors = [...this.errors, response];
        }
      });
  }

  onGetFormValues(formValue: FormValue): void {
    const values = formValue.getValues();
    this.isFormValid = formValue.isValid;
    this.worksheetPayload = {
      name: values?.name?.value,
      code: values?.code?.value,
      description: values?.description?.value,
      rows: Number(values?.rows?.value),
      columns: Number(values?.columns?.value),
      testorder: values?.testorder?.value
        ? {
            uuid: values?.testorder?.value,
          }
        : null,
      instrument: values?.instrument?.value
        ? {
            uuid: values?.instrument?.value,
          }
        : null,
    };
  }
}
