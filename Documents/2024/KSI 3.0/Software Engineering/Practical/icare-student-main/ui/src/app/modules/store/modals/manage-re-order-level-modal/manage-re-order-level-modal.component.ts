import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { Dropdown } from "src/app/shared/modules/form/models/dropdown.model";
import { Field } from "src/app/shared/modules/form/models/field.model";
import { FormValue } from "src/app/shared/modules/form/models/form-value.model";
import { Textbox } from "src/app/shared/modules/form/models/text-box.model";
import { ReOrderLevelService } from "src/app/shared/resources/store/services/re-order-level.service";

@Component({
  selector: "app-manage-re-order-level-modal",
  templateUrl: "./manage-re-order-level-modal.component.html",
  styleUrls: ["./manage-re-order-level-modal.component.scss"],
})
export class ManageReOrderLevelModalComponent implements OnInit {
  formFields: Field<string>[];
  savingData: boolean = false;

  formData: any = {};
  isFormValid: boolean = false;
  shouldConfirm: boolean = false;
  constructor(
    private dialogRef: MatDialogRef<ManageReOrderLevelModalComponent>,
    private reOrderLevelService: ReOrderLevelService
  ) {}

  ngOnInit(): void {
    this.createFormFields();
  }

  createFormFields(data?: any): void {
    // TODO: Use data to set default value when editing
    // TODO: Add location as part of selection to set re-order level
    this.formFields = [
      new Dropdown({
        id: "item",
        key: "item",
        label: "Stockable Item",
        required: true,
        options: [],
        shouldHaveLiveSearchForDropDownFields: true,
        searchControlType: "billableItem",
      }),
      new Textbox({
        id: "level",
        key: "level",
        required: true,
        type: "number",
        min: 0,
        label: "Re-Order Level",
      }),
    ];
  }

  onClose(event: Event): void {
    event.stopPropagation();
    this.dialogRef.close();
  }

  onSave(event: Event, confirmed?: boolean): void {
    event.stopPropagation();
    if (confirmed) {
      const data = {
        item: {
          uuid: this.formData?.item?.value,
        },
        location: {
          uuid: JSON.parse(localStorage.getItem("currentLocation"))?.uuid,
        },
        quantity: this.formData?.level?.value,
      };
      this.savingData = true;
      this.shouldConfirm = false;
      this.reOrderLevelService
        .createReOrderLevelOfAnItem(data)
        .subscribe((response: any) => {
          if (response && !response?.error) {
            this.savingData = false;
            this.dialogRef.close(true);
          }
        });
    } else {
      this.savingData = false;
      this.shouldConfirm = true;
    }
  }

  onFormUpdate(formValue: FormValue): void {
    this.formData = formValue.getValues();
    this.isFormValid = formValue.isValid;
  }
}
