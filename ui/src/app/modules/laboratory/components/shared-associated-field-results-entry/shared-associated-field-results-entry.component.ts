import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormValue } from "src/app/shared/modules/form/models/form-value.model";
import { Textbox } from "src/app/shared/modules/form/models/text-box.model";

@Component({
  selector: "app-shared-associated-field-results-entry",
  templateUrl: "./shared-associated-field-results-entry.component.html",
  styleUrls: ["./shared-associated-field-results-entry.component.scss"],
})
export class SharedAssociatedFieldResultsEntryComponent implements OnInit {
  @Input() testAllocationAssociatedField: any;
  formField: any;
  @Output() enteredResults: EventEmitter<any> = new EventEmitter<any>();
  constructor() {}

  ngOnInit(): void {
    this.formField = new Textbox({
      id: this.testAllocationAssociatedField?.uuid,
      key: this.testAllocationAssociatedField?.uuid,
      label: this.testAllocationAssociatedField?.associatedField?.display,
      required: true,
    });
  }

  onFormUpdate(formValue: FormValue): void {
    this.enteredResults.emit(
      formValue.getValues()[this.testAllocationAssociatedField?.uuid]?.value
    );
  }
}
