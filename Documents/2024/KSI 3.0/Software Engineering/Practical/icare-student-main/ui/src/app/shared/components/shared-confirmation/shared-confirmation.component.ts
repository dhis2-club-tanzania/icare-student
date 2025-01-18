import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Field } from "../../modules/form/models/field.model";
import { FormValue } from "../../modules/form/models/form-value.model";
import { TextArea } from "../../modules/form/models/text-area.model";

@Component({
  selector: "app-shared-confirmation",
  templateUrl: "./shared-confirmation.component.html",
  styleUrls: ["./shared-confirmation.component.scss"],
})
export class SharedConfirmationComponent implements OnInit {
  remarksField: Field<string>;
  remarks: string;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private matDialogRef: MatDialogRef<SharedConfirmationComponent>
  ) {}

  ngOnInit() {
    this.remarksField = new TextArea({
      id: "remarks",
      key: "remarks",
      label: this.data?.remarksFieldLabel || "Remarks",
    });
  }

  onCancel(e): void {
    e.stopPropagation();
    this.matDialogRef.close();
  }

  onConfirm(e): void {
    e.stopPropagation();
    this.matDialogRef.close({ confirmed: true, remarks: this.remarks });
  }

  onFormUpdate(formValaue: FormValue): void {
    this.remarks = formValaue.getValues()?.remarks?.value;
  }
}
