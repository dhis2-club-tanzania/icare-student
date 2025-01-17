import { Component, OnInit } from "@angular/core";
import { select, Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { ObsCreate, ProviderGetFull } from "src/app/shared/resources/openmrs";
import { Patient } from "src/app/shared/resources/patient/models/patient.model";
import { Visit } from "src/app/shared/resources/visits/models/visit.model";
import { AppState } from "src/app/store/reducers";
import { getCurrentLocation } from "src/app/store/selectors";
import { getCurrentPatient } from "src/app/store/selectors/current-patient.selectors";
import { getProviderDetails } from "src/app/store/selectors/current-user.selectors";
import { getActiveVisit } from "src/app/store/selectors/visit.selectors";
import { OpenmrsHttpClientService } from "src/app/shared/modules/openmrs-http-client/services/openmrs-http-client.service";
import { OpenMRSForm } from "src/app/shared/modules/form/models/custom-openmrs-form.model";
import { go, loadCustomOpenMRSForms } from "src/app/store/actions";
import { getCustomOpenMRSFormsByIds } from "src/app/store/selectors/form.selectors";
import { take } from "rxjs/operators";
import {
  getGroupedObservationByConcept,
  getSavingObservationStatus,
  getVitalSignObservations,
} from "src/app/store/selectors/observation.selectors";
import { saveObservations } from "src/app/store/actions/observation.actions";
import { ICARE_CONFIG } from "src/app/shared/resources/config";

import { map } from "lodash";

@Component({
  selector: "app-theatre-orders",
  templateUrl: "./theatre-orders.component.html",
  styleUrls: ["./theatre-orders.component.scss"],
})
export class TheatreOrdersComponent implements OnInit {
  provider$: Observable<ProviderGetFull>;
  visit$: Observable<Visit>;
  currentLocation$: Observable<Location>;
  patient$: Observable<Patient>;
  triageForm$: Observable<OpenMRSForm>;
  observations$: Observable<any>;
  savingObservations$: Observable<boolean>;

  vitalSignObservations$: Observable<any>;

  forms$: Observable<any[]>;
  constructor(
    private store: Store<AppState>,
    private httpClient: OpenmrsHttpClientService
  ) {}

  ngOnInit(): void {
    this.provider$ = this.store.select(getProviderDetails);
    this.visit$ = this.store.select(getActiveVisit);
    this.currentLocation$ = this.store.pipe(select(getCurrentLocation(false)));
    this.patient$ = this.store.pipe(select(getCurrentPatient));
    this.patient$.pipe(take(1)).subscribe((currentPatient: Patient) => {
      if (!currentPatient) {
        this.store.dispatch(go({ path: ["/theatre"] }));
      }
    });
    this.observations$ = this.store.select(getGroupedObservationByConcept);

    this.vitalSignObservations$ = this.store.pipe(
      select(getVitalSignObservations)
    );
    this.vitalSignObservations$.subscribe((res) => {
      //console.log('res', res);
    });
    this.savingObservations$ = this.store.pipe(
      select(getSavingObservationStatus)
    );
  }

  onSaveObservations(observationsInfo: any, patient): void {
    this.store.dispatch(
      saveObservations({
        observations: observationsInfo?.obs,
        patientId: patient?.patient?.uuid,
      })
    );
  }
}
