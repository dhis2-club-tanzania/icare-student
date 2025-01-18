import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from 'src/app/store/reducers';
import {
  getFormPrivilegesConfigs,
  getFormPrivilegesConfigsLoadingState,
} from 'src/app/store/selectors/form-privileges-configs.selectors';
import { getCurrentUserDetails } from 'src/app/store/selectors/current-user.selectors';
import { loadFormPrivilegesConfigs } from 'src/app/store/actions/form-privileges-configs.actions';

@Component({
  selector: 'app-patient-consultation',
  templateUrl: './patient-consultation.component.html',
  styleUrls: ['./patient-consultation.component.scss'],
})
export class PatientConsultationComponent implements OnInit {
  privilegesConfigs$: Observable<any>;
  formPrivilegesConfigsLoadingState$: Observable<boolean>;
  currentUser$: Observable<any>;
  constructor(private store: Store<AppState>) {
    this.store.dispatch(loadFormPrivilegesConfigs());
  }

  ngOnInit(): void {
    this.privilegesConfigs$ = this.store.select(getFormPrivilegesConfigs);
    this.formPrivilegesConfigsLoadingState$ = this.store.select(
      getFormPrivilegesConfigsLoadingState
    );
    this.currentUser$ = this.store.select(getCurrentUserDetails);
  }
}
