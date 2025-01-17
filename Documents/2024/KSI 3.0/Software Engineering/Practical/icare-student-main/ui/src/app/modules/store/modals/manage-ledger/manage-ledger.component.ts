import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { Dropdown } from "src/app/shared/modules/form/models/dropdown.model";
import { Field } from "src/app/shared/modules/form/models/field.model";
import { FormValue } from "src/app/shared/modules/form/models/form-value.model";
import { TextArea } from "src/app/shared/modules/form/models/text-area.model";
import { Textbox } from "src/app/shared/modules/form/models/text-box.model";
import { LedgerTypeService } from "src/app/shared/resources/store/services/ledger-type.service";

@Component({
  selector: "app-manage-ledger",
  templateUrl: "./manage-ledger.component.html",
  styleUrls: ["./manage-ledger.component.scss"],
})
export class ManageLedgerComponent implements OnInit {
  ledgerFormFields: Field<string>[];
  isFormValid: boolean = false;
  formData: any = {};
  savingData: boolean = false;
  errorResponse: any;
  shouldConfirm: boolean = false;
  constructor(
    private dialogRef: MatDialogRef<ManageLedgerComponent>,
    private legderTypeService: LedgerTypeService
  ) {}

  ngOnInit(): void {
    this.createLedgerFormFields();
  }

  createLedgerFormFields(): void {
    this.ledgerFormFields = [
      new Textbox({
        id: "name",
        key: "name",
        label: "Ledger",
        type: "text",
        required: true,
      }),
      new Dropdown({
        id: "operation",
        key: "operation",
        label: "Operation",
        required: true,
        options: [
          {
            value: "-",
            label: "Deduction",
            key: "deduction",
          },
          {
            value: "+",
            label: "Addition",
            key: "addition",
          },
        ],
      }),
      new TextArea({
        id: "description",
        key: "description",
        label: "Description",
        type: "text",
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
      this.savingData = true;
      this.shouldConfirm = false;
      this.legderTypeService
        .createLedgerType({
          name: this.formData?.name?.value,
          operation: this.formData?.operation?.value,
        })
        .subscribe((response: any) => {
          if (!response?.error) {
            this.savingData = false;
            this.createLedgerFormFields();
            setTimeout(() => {
              this.dialogRef.close(true);
            }, 200);
          } else {
            this.errorResponse = response?.error;
            this.savingData = false;
          }
        });
    } else {
      this.shouldConfirm = true;
    }
  }

  onFormUpdate(formValues: FormValue): void {
    this.formData = formValues.getValues();
    this.isFormValid = formValues.isValid;
  }
}
