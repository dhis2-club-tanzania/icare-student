import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Dropdown } from "src/app/shared/modules/form/models/dropdown.model";
import { FormValue } from "src/app/shared/modules/form/models/form-value.model";

@Component({
  selector: "app-concept-reference-terms-selection",
  templateUrl: "./concept-reference-terms-selection.component.html",
  styleUrls: ["./concept-reference-terms-selection.component.scss"],
})
export class ConceptReferenceTermsSelectionComponent implements OnInit {
  @Input() referenceTerms: any[];
  field: any;
  @Output() selectedReferenceTerm: EventEmitter<any> = new EventEmitter<any>();
  constructor() {}

  ngOnInit(): void {
    this.field = new Dropdown({
      id: "referenceterm",
      key: "referenceterm",
      label: "Select parameter",
      options: this.referenceTerms?.map((term) => {
        return {
          value: term?.uuid,
          key: term?.uuid,
          label: term?.display?.split("(")[1]?.replace(")", ""),
          name: term?.display?.split("(")[1]?.replace(")", ""),
        };
      }),
    });
  }

  onFormUpdate(formValue: FormValue): void {
    this.selectedReferenceTerm.emit(
      formValue.getValues()?.referenceterm?.value
    );
  }
}
