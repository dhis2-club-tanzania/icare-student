import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { tap } from "rxjs/operators";
import { GoogleAnalyticsService } from "src/app/google-analytics.service";
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
    @Inject(MAT_DIALOG_DATA) public data,
    private reOrderLevelService: ReOrderLevelService,
    private googleAnalyticsService: GoogleAnalyticsService
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
        value: this.data?.reOrderLevel?.quantity || null,
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
      if(!this.data){
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
              this.trackActionForAnalytics('Re-orders Levels: Save');

            }
          });
      } else {
        this.savingData = true;
        const reOrderLevel = {
          quantity: this.formData?.level?.value,
          item: {
            uuid: this.formData?.item?.value,
          },
          location: {
            uuid: this.data?.reOrderLevel?.location?.uuid
          }
        }
        this.reOrderLevelService.updateReOrderLevel(this.data?.reOrderLevel?.uuid, reOrderLevel).subscribe((response) => {
        this.savingData = false;
        this.dialogRef.close(true);
        })
      }
    } else {
      this.savingData = false;
      this.shouldConfirm = true;
    }
  }
  onFormUpdate(formValue: FormValue): void {
    this.formData = formValue.getValues();
    this.isFormValid = formValue.isValid;
  }

  trackActionForAnalytics(eventname: any) {
    // Send data to Google Analytics
   this.googleAnalyticsService.sendAnalytics('Pharmacy',eventname,'Pharmacy')
  }


}
