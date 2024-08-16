import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { SystemSettingsService } from "src/app/core/services/system-settings.service";
import {
  authenticateUser,
  loadCurrentPatient,
  loadRolesDetails,
} from "src/app/store/actions";
import { loadPatientBills } from "src/app/store/actions/bill.actions";
import { loadFormPrivilegesConfigs } from "src/app/store/actions/form-privileges-configs.actions";
import { loadActiveVisit } from "src/app/store/actions/visit.actions";
import { AppState } from "src/app/store/reducers";
import { getCurrentLocation } from "src/app/store/selectors";
import {
  getAllUSerRoles,
  getCurrentUserDetails,
  getCurrentUserPrivileges,
} from "src/app/store/selectors/current-user.selectors";
import {
  getFormPrivilegesConfigs,
  getFormPrivilegesConfigsLoadingState,
} from "src/app/store/selectors/form-privileges-configs.selectors";

@Component({
  selector: "app-nursing-data-home",
  templateUrl: "./nursing-data-home.component.html",
  styleUrls: ["./nursing-data-home.component.scss"],
})
export class NursingDataHomeComponent implements OnInit {
  privilegesConfigs$: Observable<any>;
  formPrivilegesConfigsLoadingState$: Observable<boolean>;
  currentUser$: Observable<any>;
  allUserRoles$: Observable<any[]>;
  userPrivileges$: Observable<any>;
  nursingConfigurations$: Observable<any>;
  currentLocation$: Observable<any>;

  constructor(
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private systemSettingsService: SystemSettingsService
  ) {
    this.store.dispatch(loadFormPrivilegesConfigs());
    // this.store.dispatch(loadRolesDetails());
  }

  ngOnInit(): void {
    this.nursingConfigurations$ = this.systemSettingsService.getSystemSettingsDetailsByKey(
      "icare.nursing.configurations"
    );

    const patientId = this.route.snapshot.queryParams["patient"];
    this.store.dispatch(
      loadPatientBills({
        patientUuid: patientId,
        isRegistrationPage: true,
      })
    );
    this.store.dispatch(loadActiveVisit({ patientId }));
    this.store.dispatch(loadCurrentPatient({ uuid: patientId }));
    this.store.dispatch(loadPatientBills({ patientUuid: patientId }));
    this.userPrivileges$ = this.store.select(getCurrentUserPrivileges).pipe(
      tap(privileges => {
        if (!privileges) {
          console.warn('Warning: User privileges data is missing.');
        }
      })
    );

    this.privilegesConfigs$ = this.store.select(getFormPrivilegesConfigs).pipe(
      tap(configs => {
        if (!configs) {
          console.warn('Warning: Privileges configs data is missing.');
        }
      })
    );

    this.formPrivilegesConfigsLoadingState$ = this.store.select(
      getFormPrivilegesConfigsLoadingState
    );

    this.currentUser$ = this.store.select(getCurrentUserDetails).pipe(
      tap(user => {
        if (!user) {
          console.warn('Warning: Current user data is missing.');
        }
      })
    );

    this.currentLocation$ = this.store.select(getCurrentLocation(false)).pipe(
      tap(location => {
        if (!location) {
          console.warn('Warning: Current location data is missing.');
        }
      })
    );
  }

  hasAllRequiredData(params: any): boolean {
    return (
      params?.currentUser &&
      params?.privilegesConfigs &&
      params?.allUserRoles &&
      params?.allUserRoles?.length > 0 &&
      params?.userPrivileges &&
      params?.nursingConfigurations &&
      params?.nursingConfigurations['value'] !== '' &&
      params?.currentLocation
    );
  }
}
