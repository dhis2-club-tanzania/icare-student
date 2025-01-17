import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Field } from "../../modules/form/models/field.model";
import { FormValue } from "../../modules/form/models/form-value.model";
import { TextArea } from "../../modules/form/models/text-area.model";
import { ConceptsService } from "../../resources/concepts/services/concepts.service";
import { Observable } from "rxjs";
import { Dropdown } from "../../modules/form/models/dropdown.model";

@Component({
  selector: "app-shared-confirmation",
  templateUrl: "./shared-confirmation.component.html",
  styleUrls: ["./shared-confirmation.component.scss"],
})
export class SharedConfirmationComponent implements OnInit {
  remarksField: Field<string>;
  remarks: string;
  disposeMethods$: Observable<any[]>;
  disposeMethodField: any;
  isFormValid: boolean = true;
  disposeMethod: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private matDialogRef: MatDialogRef<SharedConfirmationComponent>,
    private conceptService: ConceptsService
  ) {}

  ngOnInit() {
    this.remarksField = new TextArea({
      id: "remarks",
      key: "remarks",
      label: this.data?.remarksFieldLabel || "Remarks",
    });
    if (this.data?.captureDisposeMethods) {
      this.disposeMethodField = new Dropdown({
        id: "disposeMethod",
        key: "disposeMethod",
        label: "Dispose method",
        required: true,
        searchTerm: "SAMPLE_DISPOSE_METHOD",
        options: [],
        conceptClass: "Misc",
        searchControlType: "concept",
        shouldHaveLiveSearchForDropDownFields: true,
      });
      this.isFormValid = false;
      this.disposeMethods$ = this.conceptService.searchConcept({
        q: "SAMPLE_DISPOSE_METHOD",
      });
    }
  }

  getDisposeMethod(formValue: FormValue, disposeMethods: any[]): void {
    this.isFormValid = formValue.isValid;
    const uuid = formValue.getValues()?.disposeMethod?.value;
    this.disposeMethod = (disposeMethods?.filter(
      (disposeMethod) => disposeMethod?.uuid === uuid
    ) || [])[0];
  }

  onCancel(e): void {
    e.stopPropagation();
    this.matDialogRef.close();
  }

  onConfirm(e): void {
    e.stopPropagation();
    this.matDialogRef.close({
      confirmed: true,
      remarks: this.remarks,
      disposeMethods: [this.disposeMethod],
    });
  }

  onFormUpdate(formValaue: FormValue): void {
    this.remarks = formValaue.getValues()?.remarks?.value;
  }
}
