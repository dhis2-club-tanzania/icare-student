import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Store } from "@ngrx/store";
import { FormValue } from "src/app/shared/modules/form/models/form-value.model";
import { loadCustomOpenMRSForms } from "src/app/store/actions";
import { AppState } from "src/app/store/reducers";

@Component({
  selector: "app-dynamic-openmrs-registration-form",
  templateUrl: "./dynamic-openmrs-registration-form.component.html",
  styleUrls: ["./dynamic-openmrs-registration-form.component.scss"],
})
export class DynamicOpenmrsRegistrationFormComponent implements OnInit {
  @Input() formUuids: string[];
  @Output() formDataUpdate: EventEmitter<FormValue> =
    new EventEmitter<FormValue>();
  @Output() formId: EventEmitter<string> = new EventEmitter<string>();
  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.store.dispatch(
      loadCustomOpenMRSForms({
        formUuids: this.formUuids,
      })
    );
  }

  onFormUpdate(data: FormValue, formId: string): void {
    this.formDataUpdate.emit(data);
    this.formId.emit(formId);
  }
}
