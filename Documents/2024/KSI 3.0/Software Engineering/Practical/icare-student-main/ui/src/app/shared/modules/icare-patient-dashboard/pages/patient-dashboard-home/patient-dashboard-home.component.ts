import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { DiagnosisObject } from 'src/app/shared/resources/diagnosis/models/diagnosis-object.model';
import { ObservationObject } from 'src/app/shared/resources/observation/models/obsevation-object.model';
import { Patient } from 'src/app/shared/resources/patient/models/patient.model';
import { VisitObject } from 'src/app/shared/resources/visits/models/visit-object.model';
import { AppState } from 'src/app/store/reducers';
import { getAllDiagnoses } from 'src/app/store/selectors';
import { getCurrentPatient } from 'src/app/store/selectors/current-patient.selectors';
import { getVitalSignObservations } from 'src/app/store/selectors/observation.selectors';
import {
  getActiveVisit,
  getVisitLoadingState,
} from 'src/app/store/selectors/visit.selectors';

@Component({
  selector: 'ngx-icare-patient-dashboard-home',
  templateUrl: './patient-dashboard-home.component.html',
  styleUrls: ['./patient-dashboard-home.component.scss'],
})
export class PatientDashboardHomeComponent implements OnInit {
  currentPatient$: Observable<Patient>;
  vitalSignObservations$: Observable<ObservationObject[]>;
  loadingVisit$: Observable<boolean>;
  diagnoses$: Observable<DiagnosisObject[]>;
  activeVisit$: Observable<VisitObject>;
  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.currentPatient$ = this.store.pipe(select(getCurrentPatient));

    this.vitalSignObservations$ = this.store.pipe(
      select(getVitalSignObservations)
    );
    this.diagnoses$ = this.store.select(getAllDiagnoses);

    this.loadingVisit$ = this.store.pipe(select(getVisitLoadingState));
    this.activeVisit$ = this.store.pipe(select(getActiveVisit));
  }
}
