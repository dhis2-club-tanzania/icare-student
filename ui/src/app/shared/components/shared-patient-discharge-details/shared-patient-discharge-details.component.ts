import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Field } from "../../modules/form/models/field.model";
import { TextArea } from "../../modules/form/models/text-area.model";
import { FormValue } from "../../modules/form/models/form-value.model";

import { Observable } from "rxjs";
import { Store } from "@ngrx/store";
import { AppState } from "src/app/store/reducers";
import { getCustomOpenMRSFormById } from "src/app/store/selectors/form.selectors";
import { OpenmrsHttpClientService } from "../../modules/openmrs-http-client/services/openmrs-http-client.service";
import {
  formatDateToString,
  formatDateToYYMMDD,
} from "../../helpers/format-date.helper";
import { ObservationService } from "../../resources/observation/services";
import { groupObservationByConcept } from "../../helpers/observations.helpers";
import { getAllDiagnosesFromVisitDetails } from "../../helpers/patient.helper";
import { Diagnosis } from "../../resources/diagnosis/models/diagnosis.model";

@Component({
  selector: "app-shared-patient-discharge-details",
  templateUrl: "./shared-patient-discharge-details.component.html",
  styleUrls: ["./shared-patient-discharge-details.component.scss"],
})
export class SharedPatientDischargeDetailsComponent implements OnInit {
  @Input() parentLocation: any;
  @Input() locationLogoAttributeTypeUuid: string;
  @Input() visitDetails: any;
  @Input() currentUser: any;
  @Input() dischargeFormUuid: string;
  @Input() activeVisit: any;
  @Output() discharge: EventEmitter<any> = new EventEmitter<any>();
  @Output() observationData: EventEmitter<any> = new EventEmitter<any>();
  dischargeForm$: Observable<any>;
  dateOfDischarge: Date = new Date();
  formData: any = {};
  isFormValid: boolean = false;
  observations: any = {};
  encounterProvider: any;
  @Output() readyToConfirmDischarge: EventEmitter<boolean> =
    new EventEmitter<boolean>();
  diagnoses: any[];
  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.diagnoses = getAllDiagnosesFromVisitDetails(this.activeVisit);
    this.diagnoses =
      this.diagnoses?.filter(
        (diagnosis: Diagnosis) => diagnosis?.isConfirmedDiagnosis
      ) || [];
    this.encounterProvider = {
      ...this.visitDetails?.admissionEncounter?.encounterProviders[0]?.provider,
      display:
        this.visitDetails?.admissionEncounter?.encounterProviders[0]?.provider?.display?.split(
          "-"
        )[1],
    };
    
    this.observations = groupObservationByConcept(
      this.activeVisit?.observations
    );
    this.dischargeForm$ = this.store.select(
      getCustomOpenMRSFormById(this.dischargeFormUuid)
    );
  }

  onFormUpdate(formValue: FormValue): void {
    this.isFormValid = formValue.isValid;
    this.formData = {
      ...this.formData,
      ...formValue.getValues(),
    };
    Object.keys(this.formData).forEach((key: string) => {
      if (this.observations[key]) {
        this.readyToConfirmDischarge.emit(true);
      }
    });
    this.observationData.emit(this.formData);
  }
}
