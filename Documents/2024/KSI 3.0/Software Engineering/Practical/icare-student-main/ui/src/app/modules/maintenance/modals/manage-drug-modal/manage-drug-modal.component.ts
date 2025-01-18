import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Dropdown } from "src/app/shared/modules/form/models/dropdown.model";
import { Field } from "src/app/shared/modules/form/models/field.model";
import { FormValue } from "src/app/shared/modules/form/models/form-value.model";
import { TextArea } from "src/app/shared/modules/form/models/text-area.model";
import { Textbox } from "src/app/shared/modules/form/models/text-box.model";
import { DrugsService } from "src/app/shared/resources/drugs/services/drugs.service";

@Component({
  selector: "app-manage-drug-modal",
  templateUrl: "./manage-drug-modal.component.html",
  styleUrls: ["./manage-drug-modal.component.scss"],
})
export class ManageDrugModalComponent implements OnInit {
  dialogData: any;
  shouldConfirm: boolean;

  drugFormFields: Field<string>[];
  genericDrugFormField: Field<string>;
  formData: any = {};
  isFormValid: boolean = false;
  saving: boolean = false;
  errors: any[];

  drugsAvailable$: Observable<any[]>;
  constructor(
    private dialogRef: MatDialogRef<ManageDrugModalComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private drugService: DrugsService
  ) {
    this.dialogData = data;
  }

  ngOnInit(): void {
    this.createGenericDrugField(this.dialogData);
    this.createDrugsFormField(this.dialogData);
  }

  createGenericDrugField(data): void {
    this.genericDrugFormField = new Dropdown({
      id: "genericDrug",
      key: "genericDrug",
      label: "Generic Drug",
      value: data && data?.concept?.uuid ? data?.concept?.uuid : null,
      required: true,
      shouldHaveLiveSearchForDropDownFields: true,
      options: [],
      conceptClass: "Drug",
      searchControlType: "concept",
    });
  }

  createDrugsFormField(data?: any): void {
    this.drugFormFields = [
      new Textbox({
        id: "drug",
        key: "drug",
        label: "Drug",
        type: "text",
        value: data && data?.display ? data?.display : null,
        required: true,
      }),
      new TextArea({
        id: "description",
        key: "description",
        label: "Description",
        value: data && data?.description ? data?.description : null,
        required: false,
      }),
      new Textbox({
        id: "strength",
        key: "strength",
        label: "Strength",
        value: data && data?.strength ? data?.strength : null,
        required: true,
      }),
    ];
  }

  onClose(event: Event): void {
    event.stopPropagation();
    this.dialogRef.close();
  }

  onSave(event: Event, drug, confirmed?: boolean): void {
    event.stopPropagation();
    if (confirmed) {
      this.saving = true;
      const data = {
        name: this.formData?.drug?.value,
        concept: this.formData?.genericDrug?.value,
        strength: this.formData?.strength?.value,
        combination: false,
        description: this.formData?.description?.value,
      };
      (this.dialogData?.uuid
        ? this.drugService.updateDrug(drug?.uuid, { uuid: drug?.uuid, ...data })
        : this.drugService.createDrug(data)
      ).subscribe((response: any) => {
        if (response && !response?.error) {
          this.shouldConfirm = false;
          this.saving = false;
          setTimeout(() => {
            this.dialogRef.close(true);
          }, 200);
        } else {
          this.saving = false;
          this.errors = [response];
        }
      });
    } else {
      this.shouldConfirm = true;
    }
  }

  onFormUpdate(formValue: FormValue): void {
    this.formData = formValue.getValues();
    this.isFormValid = formValue.isValid;
  }

  onFormUpdateForGenericDrug(formValue: FormValue): void {
    this.formData = formValue.getValues();
    this.isFormValid = formValue.isValid;
    this.drugsAvailable$ = this.drugService
      .getDrugsUsingConceptUuid(this.formData?.genericDrug?.value)
      .pipe(map((response) => response?.results || []));
  }
}
