import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Patient } from 'src/app/shared/resources/patient/models/patient.model';
import { go } from 'src/app/store/actions';
import { AppState } from 'src/app/store/reducers';
import { getCurrentPatient } from 'src/app/store/selectors/current-patient.selectors';
import { getVisitLoadingState } from 'src/app/store/selectors/visit.selectors';

@Component({
  selector: 'app-patient-home',
  templateUrl: './patient-home.component.html',
  styleUrls: ['./patient-home.component.scss'],
})
export class PatientHomeComponent implements OnInit {
  currentPage: string;
  currentPatient$: Observable<Patient>;
  loadingVisit$: Observable<boolean>;
  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.currentPatient$ = this.store.pipe(select(getCurrentPatient));
    this.loadingVisit$ = this.store.pipe(select(getVisitLoadingState));
  }
}
