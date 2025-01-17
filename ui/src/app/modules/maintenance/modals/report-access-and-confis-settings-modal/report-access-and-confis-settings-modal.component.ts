import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatRadioChange } from "@angular/material/radio";
import { SystemSettingsService } from "src/app/core/services/system-settings.service";
import { Dropdown } from "src/app/shared/modules/form/models/dropdown.model";
import { FormValue } from "src/app/shared/modules/form/models/form-value.model";
import { ICARE_CONFIG } from "src/app/shared/resources/config";
import { uniqBy } from "lodash";

@Component({
  selector: "app-report-access-and-confis-settings-modal",
  templateUrl: "./report-access-and-confis-settings-modal.component.html",
  styleUrls: ["./report-access-and-confis-settings-modal.component.scss"],
})
export class ReportAccessAndConfisSettingsModalComponent implements OnInit {
  periodTypes: any[] = ICARE_CONFIG.periodTypes;
  datesParams: any[];
  otherParameters: any[];
  selectedPeriodType: any;
  defaultPeriodCategoryField: any;
  defaultPeriodCategory: any;
  formattedReportParametersConfigs: any;
  saving: boolean = false;
  errors: any[] = [];
  isFormValid: boolean = false;
  constructor(
    private dialogRef: MatDialogRef<ReportAccessAndConfisSettingsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private systemSettingsService: SystemSettingsService
  ) {}

  ngOnInit(): void {
    this.selectedPeriodType = this.periodTypes[0];
    this.datesParams =
      this.data?.parameters?.filter((param) => param?.type === "DATE") || [];
    this.otherParameters =
      this.data?.parameters?.filter((param) => param?.type !== "DATE") || [];
  }

  onClose(event: Event): void {
    event.stopPropagation();
    this.dialogRef.close();
  }

  getSelectedPeriodType(selectedPeriodType: MatRadioChange): void {
    this.selectedPeriodType = null;
    setTimeout(() => {
      this.selectedPeriodType = selectedPeriodType?.value;
      this.defaultPeriodCategoryField = new Dropdown({
        id: "defaultPeriodCategory",
        key: "defaultPeriodCategory",
        label: "Default Period",
        required: true,
        options: this.selectedPeriodType?.categories?.map((category) => {
          return {
            name: category?.name,
            label: category?.name,
            key: category?.id,
            value: category?.id,
          };
        }),
      });
    }, 50);
  }

  onFormUpdate(formValue: FormValue): void {
    const values = formValue.getValues();
    this.defaultPeriodCategory = (this.selectedPeriodType?.categories?.filter(
      (category) => category?.id === values?.defaultPeriodCategory?.value
    ) || [])[0];
    this.isFormValid = formValue.isValid;
  }

  onSave(event: Event): void {
    event.stopPropagation();
    this.formattedReportParametersConfigs = {
      id: this.data?.id,
      report: this.data?.id,
      name: this.data?.name,
      parameters: [
        ...this.datesParams?.map((parameter) => {
          return {
            ...parameter,
            periodType: {
              ...this.selectedPeriodType,
              default: this.defaultPeriodCategory,
            },
          };
        }),
      ],
      hasNonDefaultDatesConfigs: this.otherParameters?.length == 0,
    };
    const reportsParametersConfigurations = uniqBy(
      [
        ...this.data?.reportsParametersConfigurations?.value?.map((config) => {
          if (config?.id === this.formattedReportParametersConfigs?.id) {
            return this.formattedReportParametersConfigs;
          } else {
            return config;
          }
        }),
        this.formattedReportParametersConfigs,
      ],
      "id"
    );
    this.systemSettingsService
      .updateSystemSettings({
        uuid: this.data?.reportsParametersConfigurations?.uuid
          ? this.data?.reportsParametersConfigurations?.uuid
          : null,
        property: "icare.Reports.Parameters.Configurations",
        value: JSON.stringify(reportsParametersConfigurations),
      })
      .subscribe((response) => {
        if (response && !response?.error) {
          this.saving = false;
          setTimeout(() => {
            this.dialogRef.close(true);
          }, 500);
        } else {
          this.saving = false;
          this.errors = [...this.errors, response];
          setTimeout(() => {
            this.dialogRef.close(true);
          }, 500);
        }
      });
  }
}
