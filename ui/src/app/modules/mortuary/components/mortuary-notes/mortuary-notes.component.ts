import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormValue } from "src/app/shared/modules/form/models/form-value.model";

@Component({
  selector: "app-mortuary-notes",
  templateUrl: "./mortuary-notes.component.html",
  styleUrls: ["./mortuary-notes.component.scss"],
})
export class MortuaryNotesComponent implements OnInit {
  @Input() form: any;
  @Output() formDataDetails: EventEmitter<{ [key: string]: any }> =
    new EventEmitter<any>();
  constructor() {}

  ngOnInit(): void {}

  onFormUpdate(formValue: FormValue): void {
    this.formDataDetails.emit({
      data: formValue.getValues(),
      encounterType: this.form?.encounterType,
      isFormValid: formValue.isValid,
    });
  }
}
