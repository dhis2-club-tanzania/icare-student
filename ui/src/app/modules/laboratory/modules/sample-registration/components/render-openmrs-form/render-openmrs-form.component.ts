import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { SystemSettingsService } from "src/app/core/services/system-settings.service";
import { FormValue } from "src/app/shared/modules/form/models/form-value.model";
import { AppState } from "src/app/store/reducers";
import { getCustomOpenMRSFormById } from "src/app/store/selectors/form.selectors";

@Component({
  selector: "app-render-openmrs-form",
  templateUrl: "./render-openmrs-form.component.html",
  styleUrls: ["./render-openmrs-form.component.scss"],
})
export class RenderOpenmrsFormComponent implements OnInit {
  @Input() formId: string;
  customForm$: Observable<any>;
  @Output() formDataUpdate: EventEmitter<FormValue> =
    new EventEmitter<FormValue>();
  formValidationRules$: Observable<any>;
  constructor(
    private store: Store<AppState>,
    private systemSettingsService: SystemSettingsService
  ) {}

  ngOnInit(): void {
    this.customForm$ = this.store.select(getCustomOpenMRSFormById(this.formId));
    this.formValidationRules$ =
      this.systemSettingsService.getSystemSettingsByKey(
        `icare.formValidation.rules.6f188aa8-61c7-4fa9-8f83-ccf3a7db7e21`
      );
  }

  onFormUpdate(data: FormValue): void {
    this.formDataUpdate.emit(data);
  }
}
