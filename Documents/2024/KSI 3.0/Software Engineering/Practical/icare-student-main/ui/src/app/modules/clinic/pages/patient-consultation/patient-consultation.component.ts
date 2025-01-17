import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { loadCurrentPatient, loadRolesDetails } from 'src/app/store/actions';
import { loadPatientBills } from 'src/app/store/actions/bill.actions';
import { loadFormPrivilegesConfigs } from 'src/app/store/actions/form-privileges-configs.actions';
import { loadActiveVisit } from 'src/app/store/actions/visit.actions';
import { AppState } from 'src/app/store/reducers';
import {
  getCurrentUserDetails,
  getCurrentUserPrivileges,
  getIfCurrentUserPrivilegesAreSet,
} from 'src/app/store/selectors/current-user.selectors';
import {
  getFormPrivilegesConfigs,
  getFormPrivilegesConfigsLoadingState,
} from 'src/app/store/selectors/form-privileges-configs.selectors';
@Component({
  selector: 'app-patient-consultation',
  templateUrl: './patient-consultation.component.html',
  styleUrls: ['./patient-consultation.component.scss'],
})
export class PatientConsultationComponent implements OnInit {
  privilegesConfigs$: Observable<any>;
  formPrivilegesConfigsLoadingState$: Observable<boolean>;
  currentUser$: Observable<any>;
  patientIdentifier: string;
  userPrivileges$: Observable<any>;
  userPrivilegesSet$: Observable<boolean>;
  constructor(private store: Store<AppState>, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const patientId = this.route.snapshot.params['patientID'];
    this.patientIdentifier = patientId;
    this.store.dispatch(loadFormPrivilegesConfigs());
    this.store.dispatch(loadRolesDetails());
    // this.store.dispatch(loadActiveVisit({ patientId }));
    this.store.dispatch(loadCurrentPatient({ uuid: patientId }));
    this.privilegesConfigs$ = this.store.select(getFormPrivilegesConfigs);
    this.formPrivilegesConfigsLoadingState$ = this.store.select(
      getFormPrivilegesConfigsLoadingState
    );
    this.currentUser$ = this.store.select(getCurrentUserDetails);
    this.userPrivileges$ = this.store.select(getCurrentUserPrivileges);
    this.userPrivilegesSet$ = this.store.select(
      getIfCurrentUserPrivilegesAreSet
    );
  }
}
