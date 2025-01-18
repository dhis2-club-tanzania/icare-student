import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FormValue } from "../../modules/form/models/form-value.model";
import { Textbox } from "../../modules/form/models/text-box.model";

@Component({
  selector: "app-retire-metadata-reason-modal",
  templateUrl: "./retire-metadata-reason-modal.component.html",
  styleUrls: ["./retire-metadata-reason-modal.component.scss"],
})
export class RetireMetadataReasonModalComponent implements OnInit {
  dialogData: any;
  formField: any;
  isFormValid: boolean = false;
  reason: string;
  constructor(
    private dialogRef: MatDialogRef<RetireMetadataReasonModalComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.dialogData = data;
  }

  ngOnInit(): void {
    this.formField = new Textbox({
      id: "reason",
      key: "reason",
      required: true,
      label: "Retire reason",
      placeholder: "Retire reason",
    });
  }

  onFormUpdate(formValue: FormValue): void {
    this.isFormValid = formValue.isValid;
    this.reason = formValue.getValues()?.reason?.value;
  }

  onCancel(event: Event): void {
    event.stopPropagation();
    this.dialogRef.close();
  }

  onConfirm(event: Event): void {
    event.stopPropagation();
    this.dialogRef.close(this.reason);
  }
}
