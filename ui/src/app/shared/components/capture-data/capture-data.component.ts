import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { select, Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { FormValue } from "src/app/shared/modules/form/models/form-value.model";
import { OpenmrsHttpClientService } from "src/app/shared/modules/openmrs-http-client/services/openmrs-http-client.service";
import { ICARE_CONFIG } from "src/app/shared/resources/config";
import { Patient } from "src/app/shared/resources/patient/models/patient.model";
import { VisitObject } from "src/app/shared/resources/visits/models/visit-object.model";
import { AppState } from "src/app/store/reducers";

import * as _ from "lodash";
import { getSavingObservationStatus } from "src/app/store/selectors/observation.selectors";
import { OpenMRSForm } from "src/app/shared/modules/form/models/custom-openmrs-form.model";

@Component({
  selector: "app-capture-data",
  templateUrl: "./capture-data.component.html",
  styleUrls: ["./capture-data.component.scss"],
})
export class CaptureDataComponent implements OnInit {
  currentForm: any;
  currentFormState: FormValue;
  isFormValid: boolean = false;
  obsDetails: any = {};
  currentVitalsEncounterUuid: string;

  @Input() patient: Patient;
  @Input() location: any;
  @Input() visit: VisitObject;
  @Input() provider: any;
  @Input() forms: OpenMRSForm[];
  @Input() observations: any;
  @Input() useSideBar: boolean;

  @Output() saveObservations = new EventEmitter();
  obsSavingState$: Observable<boolean>;
  @Input() savingObservations: boolean;
  currentCustomForm: any;
  obsSaved: boolean = false;

  formData: any;
  encounterData: any;
  constructor(
    private store: Store<AppState>,
    private service: OpenmrsHttpClientService
  ) {}

  ngOnInit(): void {
    this.currentCustomForm = this.forms[0];
    /**
     * TODO: use global configurations for ICARE_CONFIG
     */

    this.encounterData = {
      visit: this.visit?.uuid,
      patient: this.patient?.id,
      encounterType: ICARE_CONFIG?.consultation?.encounterTypeUuid,
      location: this.location?.uuid,
      form: {
        uuid: this.currentCustomForm?.uuid
      },
      obs: [],
      orders: [],
      encounterProviders: [
        {
          provider: this.provider?.uuid,
          encounterRole: ICARE_CONFIG.encounterRole,
        },
      ],
    };

    this.obsSavingState$ = this.store.select(getSavingObservationStatus);
  }

  onSetForm(e, form) {
    e.stopPropagation();
    this.currentCustomForm = form;
  }

  onFormUpdate(formValue: FormValue): void {
    this.currentFormState = formValue;
    this.isFormValid = this.currentFormState.isValid;
    const valueForObs = formValue.getValues();

    this.obsDetails[Object.keys(valueForObs)[0]] = {
      person: this.patient["patient"]?.uuid,
      obsDatetime: new Date().toISOString(),
      concept: Object.keys(valueForObs)[0],
      location: this.location["uuid"],
      encounter: this.currentVitalsEncounterUuid,
      groupMembers: undefined,
      voided: false,
      value: valueForObs[Object.keys(valueForObs)[0]]["value"],
      status: "PRELIMINARY",
    };
  }

  onSave(e): void {
    e.stopPropagation();
    this.obsSaved = true;
    const obs = _.map(Object.keys(this.obsDetails), (key) => {
      return this.obsDetails[key];
    });
    this.encounterData.obs =
      obs.filter((observation) => observation?.value != "") || [];
    
    this.saveObservations.emit(this.encounterData);
  }

  onClear(event: Event, form: any): void {
    event.stopPropagation();
    this.currentCustomForm = null;
    setTimeout(() => {
      this.currentCustomForm = form;
    }, 20);
  }
}
                        