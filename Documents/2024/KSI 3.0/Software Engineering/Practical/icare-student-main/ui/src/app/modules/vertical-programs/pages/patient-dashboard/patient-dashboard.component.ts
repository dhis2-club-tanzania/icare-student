import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { DiagnosisObject } from 'src/app/shared/resources/diagnosis/models/diagnosis-object.model';
import { ObservationObject } from 'src/app/shared/resources/observation/models/obsevation-object.model';
import { Patient } from 'src/app/shared/resources/patient/models/patient.model';
import { VisitObject } from 'src/app/shared/resources/visits/models/visit-object.model';
import { loadFormPrivilegesConfigs } from 'src/app/store/actions/form-privileges-configs.actions';
import { AppState } from 'src/app/store/reducers';
import { getCurrentUserDetails } from 'src/app/store/selectors/current-user.selectors';
import {
  getFormPrivilegesConfigs,
  getFormPrivilegesConfigsLoadingState,
} from 'src/app/store/selectors/form-privileges-configs.selectors';
import { ProgramsService } from '../../services/programs.service';

@Component({
  selector: 'app-patient-dashboard',
  templateUrl: './patient-dashboard.component.html',
  styleUrls: ['./patient-dashboard.component.scss'],
})
export class PatientDashboardComponent implements OnInit {
  programs$: Observable<any>;
  constructor(
    private store: Store<AppState>,
    private programService: ProgramsService
  ) {
    this.store.dispatch(loadFormPrivilegesConfigs());
  }

  privilegesConfigs$: Observable<any>;
  formPrivilegesConfigsLoadingState$: Observable<boolean>;
  currentUser$: Observable<any>;
  ngOnInit(): void {
    this.privilegesConfigs$ = this.store.select(getFormPrivilegesConfigs);
    this.formPrivilegesConfigsLoadingState$ = this.store.select(
      getFormPrivilegesConfigsLoadingState
    );
    this.currentUser$ = this.store.select(getCurrentUserDetails);

    this.programs$ = this.programService.getAllPrograms();
  }
}
