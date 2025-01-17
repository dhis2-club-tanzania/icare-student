import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ICARE_CONFIG } from 'src/app/shared/resources/config';
import { Visit } from 'src/app/shared/resources/visits/models/visit.model';
import {
  go,
  loadCurrentPatient,
  startConsultation,
} from 'src/app/store/actions';
import { loadPatientPayments } from 'src/app/store/actions/payment.actions';
import { AppState } from 'src/app/store/reducers';
import { getProviderDetails } from 'src/app/store/selectors/current-user.selectors';
import {
  getActiveVisit,
  getVisitLoadingState,
} from 'src/app/store/selectors/visit.selectors';

@Component({
  selector: 'app-laboratory-investigation-home',
  templateUrl: './laboratory-investigation-home.component.html',
  styleUrls: ['./laboratory-investigation-home.component.scss'],
})
export class LaboratoryInvestigationHomeComponent implements OnInit {
  loadingVisit$: Observable<any>;
  provider$: Observable<any>;
  visit$: Observable<Visit>;
  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.loadingVisit$ = this.store.pipe(select(getVisitLoadingState));
  }

  onSelectPatient(patient) {
    // this.store.dispatch(
    //   loadPatientPayments({
    //     patientUuid: patient['patient']['uuid'],
    //   })
    // );
    // this.store.dispatch(
    //   loadCurrentPatient({ uuid: patient['patient']['uuid'] })
    // );
    this.store.dispatch(
      go({
        path: [
          '/laboratory/lab-investigation-home/order-tests/' +
            patient['patient']['uuid'],
        ],
      })
    );
  }
}
