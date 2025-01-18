import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { SystemSettingsService } from "src/app/core/services/system-settings.service";
import { Boolean } from "src/app/shared/modules/form/models/boolean.model";
import { FormValue } from "src/app/shared/modules/form/models/form-value.model";
import { TextArea } from "src/app/shared/modules/form/models/text-area.model";
import { Textbox } from "src/app/shared/modules/form/models/text-box.model";

@Component({
  selector: "app-manage-system-setting",
  templateUrl: "./manage-system-setting.component.html",
  styleUrls: ["./manage-system-setting.component.scss"],
})
export class ManageSystemSettingComponent implements OnInit {
  dialogData: any;
  formFields: any[] = [];
  isFormValid: boolean;

  data: any;
  savingData: boolean = false;
  message: string = "";

  dataType: string;
  constructor(
    private dialogRef: MatDialogRef<ManageSystemSettingComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private systemSettingsService: SystemSettingsService
  ) {
    this.dialogData = data;
  }

  ngOnInit(): void {
    this.data = {
      value: "",
      property: this.dialogData?.property,
      description: this.dialogData?.property,
      uuid: this.dialogData?.uuid,
    };
    if (this.dialogData?.isNew) {
      this.formFields = [
        new Textbox({
          id: "metakeyname",
          key: "metakeyname",
          required: true,
          placeholder: "Key",
          label: "Key",
        }),
      ];
    }

    if (
      this.dialogData?.value === "true" ||
      this.dialogData?.value === "false"
    ) {
      this.dataType = "Boolean";
    } else if (this.dialogData?.value?.indexOf(`{"`) > -1) {
      this.dataType = "json";
    } else {
      this.dataType = "any";
    }
    if (this.dataType) {
      this.formFields = [
        ...this.formFields,
        this.dataType === "Boolean"
          ? new Boolean({
              id: "value",
              key: "value",
              required: true,
              value: this.dialogData?.value
                ? this.dialogData?.value === "true"
                  ? "checked"
                  : ""
                : null,
              placeholder: "Value",
              options: [],
              label: "Value",
            })
          : new Textbox({
              id: "value",
              key: "value",
              required: true,
              value: this.dialogData?.value ? this.dialogData?.value : null,
              placeholder: "Value",
              label: "Value",
            }),
        new TextArea({
          id: "description",
          key: "description",
          value: this.dialogData?.description
            ? this.dialogData?.description
            : null,
          placeholder: "Description",
          label: "Description",
        }),
      ];
    }
  }

  onFormUpdate(formValues: FormValue): void {
    const val = formValues.getValues()["value"]?.value;
    this.data.value =
      val.toString() === "true"
        ? "true"
        : val.toString() === "false"
        ? "false"
        : val;
    this.data.description = formValues.getValues()["description"]?.value;
    if (this.dialogData?.isNew) {
      this.data.property =
        this.dialogData?.key +
        "." +
        formValues.getValues()["metakeyname"]?.value;
    }
    this.isFormValid = formValues.isValid;
  }

  onCancel(event: Event): void {
    event.stopPropagation();
    this.dialogRef.close();
  }

  onSave(event: Event): void {
    this.savingData = true;
    this.message = "Saving data";
    event.stopPropagation();
    this.systemSettingsService
      .updateSystemSettings(this.data)
      .subscribe((response) => {
        if (response) {
          this.message = "Successfully updated";
          this.savingData = false;
          setTimeout(() => {
            this.dialogRef.close(true);
          }, 2000);
        }
      });
  }
}
